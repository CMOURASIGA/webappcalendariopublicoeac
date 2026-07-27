import * as htmlToImage from 'html-to-image';

const AGENDA_FILE_NAME = 'agenda-eac.png';
const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
const EXPORT_OPTIONS = {
  pixelRatio: 1,
  backgroundColor: '#FAF9F5',
  cacheBust: true,
  skipFonts: true,
  imagePlaceholder: TRANSPARENT_PIXEL,
};

const waitForAssets = async (node: HTMLElement): Promise<void> => {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    await document.fonts.ready;
  }

  const images = Array.from(node.querySelectorAll('img'));
  await Promise.all(images.map(async (image) => {
    if (image.complete && image.naturalWidth > 0) return;

    try {
      await image.decode();
    } catch {
      await new Promise<void>((resolve) => {
        const finish = () => resolve();
        image.addEventListener('load', finish, { once: true });
        image.addEventListener('error', finish, { once: true });
        window.setTimeout(finish, 3000);
      });
    }
  }));
};

const downloadFromDataUrl = (dataUrl: string): void => {
  const link = document.createElement('a');
  link.download = AGENDA_FILE_NAME;
  link.href = dataUrl;
  link.click();
};

const downloadFromBlob = (blob: Blob): void => {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = AGENDA_FILE_NAME;
  link.href = objectUrl;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};

export async function exportarAgendaComoImagem(node: HTMLElement): Promise<void> {
  await waitForAssets(node);
  const dataUrl = await htmlToImage.toPng(node, EXPORT_OPTIONS);
  downloadFromDataUrl(dataUrl);
}

export async function compartilharAgendaOuBaixar(node: HTMLElement): Promise<void> {
  await waitForAssets(node);
  const blob = await htmlToImage.toBlob(node, EXPORT_OPTIONS);

  if (!blob) {
    await exportarAgendaComoImagem(node);
    return;
  }

  const canUseNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  if (canUseNativeShare) {
    const imageFile = new File([blob], AGENDA_FILE_NAME, { type: 'image/png' });
    const shareData: ShareData = {
      title: 'Agenda EAC',
      text: 'Compartilhe com seu grupo',
      files: [imageFile],
    };

    let canShareFiles = false;
    try {
      canShareFiles = typeof navigator.canShare === 'function' && navigator.canShare(shareData);
    } catch {
      canShareFiles = false;
    }

    if (canShareFiles) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }
    }
  }

  downloadFromBlob(blob);
}
