import * as htmlToImage from 'html-to-image';

const AGENDA_FILE_NAME = 'agenda-eac.png';
const EXPORT_OPTIONS = {
  pixelRatio: 2,
  backgroundColor: '#F0EFE9',
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
  URL.revokeObjectURL(objectUrl);
};

export async function exportarAgendaComoImagem(node: HTMLElement): Promise<void> {
  const dataUrl = await htmlToImage.toPng(node, EXPORT_OPTIONS);
  downloadFromDataUrl(dataUrl);
}

export async function compartilharAgendaOuBaixar(node: HTMLElement): Promise<void> {
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

    const canShareFiles = typeof navigator.canShare === 'function'
      ? navigator.canShare(shareData)
      : true;

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
