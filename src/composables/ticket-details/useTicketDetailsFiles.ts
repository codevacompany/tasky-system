import { computed } from 'vue';
import { ticketService } from '@/services/ticketService';
import { awsService } from '@/services/awsService';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import type { TicketFile } from '@/models/ticketFile';
import type { TicketDetailsContext } from './ticketDetailsContext';

export function useTicketDetailsFiles(
  ctx: TicketDetailsContext,
  refreshSelectedTicket: () => Promise<void>,
) {
  const {
    loadedTicket,
    selectedFiles,
    fileInput,
    isUploading,
    selectedImage,
    currentImageIndex,
  } = ctx;

  const isImageFile = (file: TicketFile): boolean => {
    if (file.mimeType && file.mimeType.trim() && file.mimeType.startsWith('image/')) {
      return true;
    }

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
    const fileName = file.name.toLowerCase().trim();
    const fileUrl = (file.url || '').toLowerCase().trim();

    return imageExtensions.some(
      (ext) => fileName.endsWith(ext) || fileUrl.includes(ext),
    );
  };

  const imageFiles = computed(() => {
    if (!loadedTicket.value) return [];
    return loadedTicket.value.files.filter((file) => isImageFile(file));
  });

  const hasPreviousImage = computed(() => currentImageIndex.value > 0);

  const hasNextImage = computed(() => currentImageIndex.value < imageFiles.value.length - 1);

  const openImageViewer = (file: TicketFile) => {
    if (!isImageFile(file)) {
      downloadFile(file);
      return;
    }

    const index = imageFiles.value.findIndex((f) => f.id === file.id);
    if (index !== -1) {
      currentImageIndex.value = index;
      selectedImage.value = file;
      document.body.style.overflow = 'hidden';
    }
  };

  const closeImageViewer = () => {
    selectedImage.value = null;
    currentImageIndex.value = 0;
    document.body.style.overflow = '';
  };

  const previousImage = () => {
    if (hasPreviousImage.value) {
      currentImageIndex.value--;
      selectedImage.value = imageFiles.value[currentImageIndex.value];
    }
  };

  const nextImage = () => {
    if (hasNextImage.value) {
      currentImageIndex.value++;
      selectedImage.value = imageFiles.value[currentImageIndex.value];
    }
  };

  const handleImageLoad = () => {};

  const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  };

  const truncateFileName = (fileName: string, maxLength: number = 19): string => {
    if (!fileName) return '';

    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) {
      if (fileName.length <= maxLength) return fileName;
      return fileName.substring(0, maxLength - 3) + '...';
    }

    const extension = fileName.substring(lastDotIndex);
    const nameWithoutExt = fileName.substring(0, lastDotIndex);

    if (fileName.length <= maxLength) return fileName;

    const lastThreeChars =
      nameWithoutExt.length >= 3
        ? nameWithoutExt.substring(nameWithoutExt.length - 3)
        : nameWithoutExt;

    const neededLength = 3 + 3 + extension.length;
    if (maxLength < neededLength) return '...' + lastThreeChars + extension;

    const availableLength = maxLength - 3 - 3 - extension.length;
    if (availableLength <= 0) return '...' + lastThreeChars + extension;

    return nameWithoutExt.substring(0, availableLength) + '...' + lastThreeChars + extension;
  };

  const downloadFile = async (file: TicketFile) => {
    try {
      await awsService.downloadFile(file.url, file.name);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Erro ao baixar arquivo');
    }
  };

  const downloadImage = () => {
    if (!selectedImage.value) return;
    downloadFile(selectedImage.value);
  };

  const removeFile = async (file: TicketFile) => {
    if (!loadedTicket.value) return;

    try {
      await ticketService.deleteFile(file.id);
      await refreshSelectedTicket();
    } catch {
      toast.error('Erro ao remover arquivo');
    }
  };

  const openFileInput = () => {
    fileInput.value?.click();
  };

  const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target?.files || !loadedTicket.value) return;

    const files = Array.from(target.files);
    selectedFiles.value = files;
    isUploading.value = true;

    try {
      const uploadedFiles: Array<{ url: string; name: string; mimeType: string; size: number }> = [];

      for (const file of files) {
        const { data } = await awsService.getSignedUrl(file.name);
        await axios.put(data.url, file, {
          headers: { 'Content-Type': file.type },
        });
        uploadedFiles.push({
          url: data.url.split('?')[0],
          name: file.name,
          mimeType: file.type,
          size: file.size,
        });
      }

      if (uploadedFiles.length > 0) {
        const response = await ticketService.addFiles(loadedTicket.value.customId, uploadedFiles);
        if (response?.data) {
          loadedTicket.value = response.data;
        }
        toast.success('Sucesso');
        await refreshSelectedTicket();
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao anexar arquivos');
    } finally {
      selectedFiles.value = [];
      isUploading.value = false;
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    }
  };

  const handleImageViewerKeyboard = (event: KeyboardEvent) => {
    if (!selectedImage.value) return;

    if (event.key === 'Escape') {
      closeImageViewer();
    } else if (event.key === 'ArrowLeft' && hasPreviousImage.value) {
      previousImage();
    } else if (event.key === 'ArrowRight' && hasNextImage.value) {
      nextImage();
    }
  };

  const cleanupFiles = () => {
    document.body.style.overflow = '';
  };

  return {
    isImageFile,
    imageFiles,
    hasPreviousImage,
    hasNextImage,
    openImageViewer,
    closeImageViewer,
    previousImage,
    nextImage,
    handleImageLoad,
    handleImageError,
    truncateFileName,
    downloadFile,
    downloadImage,
    removeFile,
    openFileInput,
    handleFileChange,
    handleImageViewerKeyboard,
    cleanupFiles,
  };
}
