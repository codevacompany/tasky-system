import { awsService } from '@/services/awsService';
import axios from 'axios';
import { toast } from 'vue3-toastify';

export const ticketDetailsEditorOptions = {
  modules: {
    toolbar: [
      [{ size: ['small', false, 'large'] }],
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      ['link', 'image', 'video'],
    ],
  },
  placeholder: 'Adicionar comentário...',
};

const dataUrlToBlob = (dataUrl: string) => {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return { blob: new Blob([u8arr], { type: mime }), mime };
};

const uploadInlineImage = async (dataUrl: string) => {
  const { blob, mime } = dataUrlToBlob(dataUrl);
  const ext = mime.split('/')[1] || 'png';
  const fileName = `image_${Date.now()}.${ext}`;
  const { data } = await awsService.getSignedUrl(fileName);
  await axios.put(data.url, blob, {
    headers: {
      'Content-Type': mime,
    },
  });
  return data.url.split('?')[0];
};

export const convertUrlsToLinks = (html: string): string => {
  if (typeof window === 'undefined' || !html) return html;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  const urlRegex =
    /(https?:\/\/[^\s<>"{}|\\^`[\]]+|www\.[^\s<>"{}|\\^`[\]]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s<>"{}|\\^`[\]]*)/gi;

  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      const parent = node.parentNode;

      if (
        parent &&
        (parent.nodeName === 'A' || (parent instanceof Element && parent.closest('a')))
      ) {
        return;
      }

      const matches = Array.from(text.matchAll(urlRegex));
      if (matches.length > 0) {
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;

        matches.forEach((match) => {
          const url = match[0];
          const index = match.index || 0;

          if (index > lastIndex) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex, index)));
          }

          const link = document.createElement('a');
          let href = url;
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            href = url.startsWith('www.') ? `https://${url}` : `https://${url}`;
          }
          link.href = href;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = url;
          link.className = 'comment-link';

          const isDarkMode =
            document.body.classList.contains('dark-mode') ||
            document.body.classList.contains('dark');
          link.style.cursor = 'pointer';
          link.style.setProperty('color', isDarkMode ? '#60a5fa' : '#2563eb', 'important');

          if (isDarkMode) {
            link.setAttribute('data-dark-mode', 'true');
          }

          fragment.appendChild(link);
          lastIndex = index + url.length;
        });

        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
        }

        if (parent) {
          parent.replaceChild(fragment, node);
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      if (
        element.tagName === 'SCRIPT' ||
        element.tagName === 'STYLE' ||
        element.tagName === 'A' ||
        element.closest('a')
      ) {
        return;
      }

      const childNodes = Array.from(node.childNodes);
      childNodes.forEach(processNode);
    }
  };

  const childNodes = Array.from(tempDiv.childNodes);
  childNodes.forEach(processNode);

  const isDarkMode =
    document.body.classList.contains('dark-mode') || document.body.classList.contains('dark');
  const allLinks = tempDiv.querySelectorAll('a');
  allLinks.forEach((link) => {
    if (isDarkMode) {
      link.style.setProperty('color', '#60a5fa', 'important');
      link.setAttribute('data-dark-mode', 'true');
    } else {
      link.style.setProperty('color', '#2563eb', 'important');
    }
    link.style.cursor = 'pointer';
  });

  return tempDiv.innerHTML;
};

export function useTicketDetailsRichText() {
  const processRichTextContent = async (html: string) => {
    if (typeof window === 'undefined' || !html) return html;

    const processedHtml = convertUrlsToLinks(html);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = processedHtml;

    const images = Array.from(tempDiv.querySelectorAll('img'));
    for (const img of images) {
      const src = img.getAttribute('src');
      if (src && src.startsWith('data:')) {
        try {
          const uploadedUrl = await uploadInlineImage(src);
          img.setAttribute('src', uploadedUrl);
        } catch (error) {
          console.error('Erro ao enviar imagem embutida:', error);
          toast.error('Erro ao enviar imagem do comentário. Tente novamente.');
          throw error;
        }
      }
    }

    return tempDiv.innerHTML;
  };

  return {
    editorOptions: ticketDetailsEditorOptions,
    processRichTextContent,
    convertUrlsToLinks,
  };
}
