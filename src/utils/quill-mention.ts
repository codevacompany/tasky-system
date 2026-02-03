import Quill from 'quill';
import type { User } from '@/models';

// Type for Quill instance with all properties we use
type QuillInstance = InstanceType<typeof Quill> & {
  container: HTMLElement;
  root: HTMLElement;
  getSelection: () => { index: number; length: number } | null;
  getText: () => string;
  getContents: () => { ops: Array<{ insert?: string | object }> };
  getBounds: (index: number) => { top: number; left: number; height: number };
  getLength: () => number;
  getLeaf: (index: number) => [{ domNode: Node } | null, number];
  setSelection: (index: number, length: number, source?: string) => void;
  deleteText: (index: number, length: number, source?: string) => void;
  insertText: (index: number, text: string, source?: string) => void;
  insertEmbed: (index: number, type: string, value: object, source?: string) => void;
  focus: () => void;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
};

const Embed = Quill.import('blots/embed');

class MentionBlot extends Embed {
  static blotName = 'mention';
  static tagName = 'span';
  static className = 'mention';

  static create(data: { userId: number; userName: string }) {
    const node = super.create();
    node.setAttribute('data-user-id', data.userId.toString());
    node.setAttribute('data-user-name', data.userName);
    node.setAttribute('data-mention', 'true');
    node.textContent = `@${data.userName}`;
    node.classList.add('mention');

    return node;
  }

  static value(node: HTMLElement) {
    return {
      userId: parseInt(node.getAttribute('data-user-id') || '0', 10),
      userName: node.getAttribute('data-user-name') || '',
    };
  }

  static formats(node: HTMLElement) {
    return {
      userId: parseInt(node.getAttribute('data-user-id') || '0', 10),
      userName: node.getAttribute('data-user-name') || '',
    };
  }
}

// Register the MentionBlot only if not already registered
try {
  Quill.register(MentionBlot, true);
} catch {
  // Already registered, ignore
}

export interface MentionData {
  userId: number;
  position: number;
  length: number;
}

export class QuillMention {
  private quill: QuillInstance;
  private mentionableUsers: User[] = [];
  private mentionSelector: HTMLElement | null = null;
  private selectedIndex: number = 0;
  private currentMentionStart: number = -1;
  private searchTerm: string = '';
  private currentFilteredUsers: User[] = []; // Cache da lista filtrada atual
  private onMentionInserted?: () => void; // Callback para restaurar foco
  private mentionInsertionInProgress: boolean = false; // Flag to prevent double insertion

  constructor(quill: QuillInstance, mentionableUsers: User[], onMentionInserted?: () => void) {
    this.quill = quill;
    this.mentionableUsers = mentionableUsers;
    this.onMentionInserted = onMentionInserted;
    this.setupEventListeners();
  }

  updateMentionableUsers(users: User[]) {
    this.mentionableUsers = users;
  }

  private setupEventListeners() {
    this.quill.on('text-change', this.handleTextChange.bind(this));
    this.quill.on('selection-change', this.handleSelectionChange.bind(this));

    // Add keydown listener to Quill's root element with capture phase to catch events before Quill processes them
    const quillRoot = this.quill.root;
    if (quillRoot) {
      quillRoot.addEventListener('keydown', this.handleKeyDown.bind(this), true);
    }

    // Also listen on document as fallback
    document.addEventListener('keydown', this.handleKeyDown.bind(this), true);
    document.addEventListener('click', this.handleClickOutside.bind(this), false);
  }

  private handleTextChange(_delta: unknown, _oldDelta: unknown, source: string) {
    if (source !== 'user') return;

    const selection = this.quill.getSelection();
    if (!selection) return;

    const cursorPosition = selection.index;

    // Get the actual content (includes embeds)
    const contents = this.quill.getContents();
    const ops = contents.ops || [];

    // Build a representation of text positions accounting for embeds
    let currentPos = 0;
    let textBeforeCursor = '';

    for (let i = 0; i < ops.length && currentPos < cursorPosition; i++) {
      const op = ops[i];

      if (op.insert) {
        if (typeof op.insert === 'string') {
          // Text insert
          const text = op.insert;
          const availableLength = Math.min(text.length, cursorPosition - currentPos);
          textBeforeCursor += text.substring(0, availableLength);
          currentPos += text.length;
        } else {
          // Embed (mention, image, etc) - takes 1 position but no text
          currentPos += 1;
          // Add a marker so we know there was an embed here
          textBeforeCursor += '\uFFFC'; // Object replacement character
        }
      }
    }

    // Now search backwards in textBeforeCursor for @
    const cursorInText = textBeforeCursor.length;
    let searchStart = cursorInText - 1;
    let foundAt = -1;

    while (searchStart >= 0) {
      const char = textBeforeCursor[searchStart];

      if (char === '@') {
        // Found an @, check if it's valid
        const charBefore = searchStart > 0 ? textBeforeCursor[searchStart - 1] : '';
        if (!charBefore || charBefore.match(/[\s\n]/) || charBefore === '\uFFFC') {
          foundAt = searchStart;
          break;
        }
      }

      // Stop if we hit whitespace or embed marker
      if (char === ' ' || char === '\n' || char === '\uFFFC') {
        break;
      }

      searchStart--;
    }

    if (foundAt !== -1) {
      const textAfterAt = textBeforeCursor.substring(foundAt + 1);

      // Check if there's whitespace after @
      if (
        textAfterAt.includes(' ') ||
        textAfterAt.includes('\n') ||
        textAfterAt.includes('\uFFFC')
      ) {
        this.hideMentionSelector();
        return;
      }

      // Map back from text position to actual Quill position
      let actualPosition = 0;
      let textPosition = 0;

      for (let i = 0; i < ops.length; i++) {
        const op = ops[i];

        if (op.insert) {
          if (typeof op.insert === 'string') {
            for (let j = 0; j < op.insert.length; j++) {
              if (textPosition === foundAt) {
                this.currentMentionStart = actualPosition;
                break;
              }
              textPosition++;
              actualPosition++;
            }
          } else {
            textPosition++; // For the embed marker
            actualPosition++;
          }
        }

        if (this.currentMentionStart >= 0 && textPosition > foundAt) break;
      }

      const newSearchTerm = textAfterAt.toLowerCase();
      this.searchTerm = newSearchTerm;

      if (this.searchTerm !== newSearchTerm) {
        this.selectedIndex = 0;
        this.currentFilteredUsers = [];
      }

      this.showMentionSelector();
    } else {
      this.hideMentionSelector();
    }
  }

  private handleSelectionChange(range: { index: number; length: number } | null) {
    if (!range) {
      this.hideMentionSelector();
      return;
    }

    const text = this.quill.getText();
    const cursorPosition = range.index;
    const lastAtSymbol = text.lastIndexOf('@', cursorPosition - 1);

    if (lastAtSymbol !== -1) {
      const textAfterAt = text.substring(lastAtSymbol + 1, cursorPosition);
      if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
        const textBeforeAt = text.substring(Math.max(0, lastAtSymbol - 1), lastAtSymbol);
        if (!textBeforeAt || textBeforeAt.match(/[\s\n]/) || lastAtSymbol === 0) {
          this.currentMentionStart = lastAtSymbol;
          this.searchTerm = textAfterAt.toLowerCase();
          this.showMentionSelector();
          return;
        }
      }
    }

    this.hideMentionSelector();
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.mentionSelector || !this.mentionSelector.parentElement) return;

    // Use cached filtered users to ensure consistency
    const filteredUsers =
      this.currentFilteredUsers.length > 0 ? this.currentFilteredUsers : this.getFilteredUsers();

    if (filteredUsers.length === 0) {
      this.hideMentionSelector();
      return;
    }

    // Ensure selectedIndex is within bounds
    if (this.selectedIndex >= filteredUsers.length) {
      this.selectedIndex = filteredUsers.length - 1;
    }
    if (this.selectedIndex < 0) {
      this.selectedIndex = 0;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        event.stopPropagation();
        this.selectedIndex = (this.selectedIndex + 1) % filteredUsers.length;
        this.updateMentionSelector();
        break;
      case 'ArrowUp':
        event.preventDefault();
        event.stopPropagation();
        this.selectedIndex = (this.selectedIndex - 1 + filteredUsers.length) % filteredUsers.length;
        this.updateMentionSelector();
        break;
      case 'Enter':
      case 'Tab':
        event.preventDefault();
        event.stopPropagation();
        // Use the cached filtered users to ensure we get the correct user
        const selectedUser = filteredUsers[this.selectedIndex];
        if (selectedUser) {
          // Store user before hiding selector
          const userToInsert = selectedUser;
          this.insertMention(userToInsert);
        }
        break;
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        this.hideMentionSelector();
        break;
    }
  }

  private handleClickOutside(event: MouseEvent) {
    const target = event.target as Node;

    // Don't hide if clicking inside the mention selector
    if (this.mentionSelector && this.mentionSelector.contains(target)) {
      return;
    }

    // Hide if clicking outside both the selector and the quill editor
    const quillContainer = this.quill.container;
    if (!quillContainer.contains(target)) {
      // Use setTimeout to allow click events on mention items to process first
      setTimeout(() => {
        if (!this.mentionInsertionInProgress && this.mentionSelector) {
          this.hideMentionSelector();
        }
      }, 150);
    }
  }

  private getFilteredUsers(): User[] {
    if (!this.searchTerm) return this.mentionableUsers;

    return this.mentionableUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(this.searchTerm) ||
        user.lastName.toLowerCase().includes(this.searchTerm) ||
        user.email.toLowerCase().includes(this.searchTerm) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(this.searchTerm),
    );
  }

  private showMentionSelector() {
    if (!this.mentionSelector) {
      this.createMentionSelector();
    }

    const filteredUsers = this.getFilteredUsers();
    if (filteredUsers.length === 0) {
      this.hideMentionSelector();
      return;
    }

    // Cache filtered users
    this.currentFilteredUsers = filteredUsers;

    // Reset selected index to 0 when showing selector
    this.selectedIndex = 0;
    this.updateMentionSelector();
    this.positionMentionSelector();
  }

  private createMentionSelector() {
    if (this.mentionSelector) {
      return;
    }

    this.mentionSelector = document.createElement('div');
    this.mentionSelector.className = 'quill-mention-selector';
    this.mentionSelector.style.cssText = `
      position: absolute;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      max-height: 200px;
      overflow-y: auto;
      z-index: 10000;
      min-width: 250px;
      padding: 4px;
      pointer-events: auto;
    `;

    document.body.appendChild(this.mentionSelector);
  }

  private handleMentionItemClick(user: User) {
    // Prevent double insertion if both mousedown and click fire
    if (this.mentionInsertionInProgress) {
      return;
    }
    this.mentionInsertionInProgress = true;

    // Reset flag after a short delay
    setTimeout(() => {
      this.mentionInsertionInProgress = false;
    }, 100);

    // Keep Quill focused
    const editor = this.quill.root;
    if (editor && editor instanceof HTMLElement) {
      editor.focus({ preventScroll: true });
    }

    // Insert mention immediately
    this.insertMention(user);
  }

  private updateMentionSelector() {
    if (!this.mentionSelector) return;

    const filteredUsers = this.getFilteredUsers();

    // Cache the filtered users
    this.currentFilteredUsers = filteredUsers;

    // Ensure selectedIndex is within bounds
    if (this.selectedIndex >= filteredUsers.length) {
      this.selectedIndex = filteredUsers.length - 1;
    }
    if (this.selectedIndex < 0) {
      this.selectedIndex = 0;
    }

    this.mentionSelector.innerHTML = '';

    filteredUsers.forEach((user, index) => {
      const isActive = index === this.selectedIndex;
      const item = document.createElement('div');
      item.className = `mention-item ${isActive ? 'active' : ''}`;
      item.setAttribute('data-user-index', index.toString());
      item.setAttribute('data-user-id', user.id.toString());
      item.style.cssText = `
        display: flex;
        align-items: center;
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 4px;
        ${isActive ? 'background-color: #f3f4f6;' : ''}
      `;

      const avatar = document.createElement('div');
      avatar.style.cssText = `
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #3b82f6;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
        font-weight: 500;
        font-size: 0.875rem;
      `;
      avatar.textContent = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

      const info = document.createElement('div');
      info.style.cssText = 'display: flex; flex-direction: column; flex: 1;';

      const name = document.createElement('div');
      name.style.cssText = 'font-weight: 500; font-size: 0.875rem; color: #111827;';
      name.textContent = `${user.firstName} ${user.lastName}`;

      const department = document.createElement('div');
      department.style.cssText = 'font-size: 0.75rem; color: #6b7280;';
      department.textContent = user.department?.name || '';

      info.appendChild(name);
      info.appendChild(department);
      item.appendChild(avatar);
      item.appendChild(info);

      // Store user data on the item
      item.setAttribute('data-user-index', index.toString());
      item.setAttribute('data-user-id', user.id.toString());

      // Attach click handlers directly to each item - this is more reliable than delegation
      const handleItemClick = (e: MouseEvent | PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.handleMentionItemClick(user);
      };

      // Use both pointerdown and click for maximum compatibility
      item.addEventListener('pointerdown', handleItemClick, true);
      item.addEventListener('mousedown', handleItemClick, true);
      item.addEventListener('click', handleItemClick, true);

      item.addEventListener('mouseenter', () => {
        this.selectedIndex = index;
        this.updateMentionSelector();
      });

      this.mentionSelector!.appendChild(item);
    });

    // Scroll to selected item if needed
    if (this.selectedIndex >= 0 && this.selectedIndex < filteredUsers.length) {
      const selectedItem = this.mentionSelector.children[this.selectedIndex] as HTMLElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }

  private positionMentionSelector() {
    if (!this.mentionSelector) return;

    const selection = this.quill.getSelection();
    if (!selection) return;

    const bounds = this.quill.getBounds(selection.index);
    const container = this.quill.container.getBoundingClientRect();

    this.mentionSelector.style.top = `${container.top + bounds.top + bounds.height + window.scrollY}px`;
    this.mentionSelector.style.left = `${container.left + bounds.left + window.scrollX}px`;
  }

  private insertMention(user: User) {
    if (this.currentMentionStart === -1) {
      console.warn('QuillMention: currentMentionStart is -1, cannot insert mention');
      return;
    }

    // Store mention start BEFORE hiding selector (which resets it to -1)
    const mentionStart = this.currentMentionStart;

    // Get current text to find where the search term ends
    const text = this.quill.getText();
    const editor = this.quill.root;

    // Maintain focus and hide selector
    if (editor && editor instanceof HTMLElement) {
      editor.focus({ preventScroll: true });
    }
    this.hideMentionSelector();

    // Find the actual end of the search term (up to next space/newline or end of text)
    let actualEnd = mentionStart + 1;
    for (let i = mentionStart + 1; i < text.length; i++) {
      if (text[i] === ' ' || text[i] === '\n') {
        actualEnd = i;
        break;
      }
      actualEnd = i + 1;
    }

    // Calculate the length to delete (from @ to end of search term)
    const deleteLength = actualEnd - mentionStart;

    // Set selection to the range we want to replace
    this.quill.setSelection(mentionStart, deleteLength, 'user');

    // Delete the @ and search text
    this.quill.deleteText(mentionStart, deleteLength, 'user');

    // Insert mention at the position where @ was
    const mentionData = {
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
    };

    try {
      // Insert the mention embed
      this.quill.insertEmbed(mentionStart, 'mention', mentionData, 'user');

      // Position after mention should be mentionStart + 1 (the embed takes 1 position)
      const positionAfterMention = mentionStart + 1;

      // Add a space after the mention for easier typing
      this.quill.insertText(positionAfterMention, ' ', 'user');

      // Final cursor position is after the space we just inserted
      const finalPosition = positionAfterMention + 1;

      // Clear currentMentionStart after successful insertion
      this.currentMentionStart = -1;

      // Restore focus and position cursor synchronously (no delay)
      this.quill.setSelection(finalPosition, 0, 'user');
      this.quill.focus();

      // Call the callback if provided
      if (this.onMentionInserted) {
        this.onMentionInserted();
      }
    } catch (error) {
      console.error('QuillMention: Error inserting mention embed, using fallback', error);
      // Fallback: insert as plain text with @
      const mentionText = `@${user.firstName} ${user.lastName} `;
      this.quill.insertText(mentionStart, mentionText, 'user');
      const finalPosition = mentionStart + mentionText.length;

      // Clear currentMentionStart
      this.currentMentionStart = -1;

      // Aggressively restore focus
      const restoreFocus = () => {
        try {
          const editor = this.quill.root;
          if (editor && editor instanceof HTMLElement) {
            editor.focus({ preventScroll: true });
            setTimeout(() => {
              this.quill.setSelection(finalPosition, 0, 'user');
            }, 0);
          }
          this.quill.focus();
          this.quill.setSelection(finalPosition, 0, 'user');
          const container = this.quill.container;
          if (container) {
            const editableElement = container.querySelector('.ql-editor') as HTMLElement;
            if (editableElement) {
              editableElement.focus({ preventScroll: true });
              setTimeout(() => {
                this.quill.setSelection(finalPosition, 0, 'user');
              }, 0);
            }
          }
        } catch (error) {
          console.warn('QuillMention: Error restoring focus (fallback)', error);
        }
      };

      restoreFocus();
      requestAnimationFrame(() => {
        restoreFocus();
        setTimeout(() => restoreFocus(), 10);
        setTimeout(() => restoreFocus(), 50);
        setTimeout(() => restoreFocus(), 100);
        setTimeout(() => restoreFocus(), 200);
      });
    }
  }

  private hideMentionSelector() {
    if (this.mentionSelector && this.mentionSelector.parentElement) {
      this.mentionSelector.parentElement.removeChild(this.mentionSelector);
    }
    this.mentionSelector = null;
    this.selectedIndex = 0;
    this.currentMentionStart = -1;
    this.currentFilteredUsers = []; // Clear cache
  }

  destroy() {
    this.hideMentionSelector();
    const quillRoot = this.quill?.root;
    if (quillRoot) {
      quillRoot.removeEventListener('keydown', this.handleKeyDown.bind(this), true);
    }
    document.removeEventListener('keydown', this.handleKeyDown.bind(this), true);
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  /**
   * Extract mentions from Quill content
   */
  static extractMentions(html: string): MentionData[] {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const mentions: MentionData[] = [];

    // Convert HTML to plain text and track positions
    // const getTextContent = (node: Node): string => {
    //   if (node.nodeType === Node.TEXT_NODE) {
    //     return node.textContent || '';
    //   }
    //   if (node.nodeType === Node.ELEMENT_NODE) {
    //     const element = node as HTMLElement;
    //     if (element.classList.contains('mention')) {
    //       return element.textContent || '';
    //     }
    //     let text = '';
    //     for (const child of Array.from(element.childNodes)) {
    //       text += getTextContent(child);
    //     }
    //     return text;
    //   }
    //   return '';
    // };

    // Build text representation and track mention positions
    let textPosition = 0;
    const processNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        textPosition += (node.textContent || '').length;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        if (element.classList.contains('mention')) {
          const userId = parseInt(element.getAttribute('data-user-id') || '0', 10);
          const userName = element.getAttribute('data-user-name') || '';
          const mentionText = `@${userName}`;
          const mentionLength = mentionText.length;

          mentions.push({
            userId,
            position: textPosition,
            length: mentionLength,
          });

          textPosition += mentionLength;
        } else {
          for (const child of Array.from(element.childNodes)) {
            processNode(child);
          }
        }
      }
    };

    for (const child of Array.from(tempDiv.childNodes)) {
      processNode(child);
    }

    return mentions;
  }
}

export default QuillMention;
