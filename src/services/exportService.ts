/**
 * Export service for generating PDF/DOCX from tailored resume text.
 *
 * TODO: Integrate jsPDF and docx libraries for production use.
 * For now, uses browser-native download with plain text.
 */

export function exportAsPDF(resumeText: string, fileName: string): void {
  // TODO: Replace with jsPDF generation for proper PDF formatting
  const blob = new Blob([resumeText], { type: 'text/plain' });
  downloadBlob(blob, `${fileName}.txt`);
}

export function exportAsDOCX(resumeText: string, fileName: string): void {
  // TODO: Replace with docx library generation for proper DOCX formatting
  const blob = new Blob([resumeText], { type: 'text/plain' });
  downloadBlob(blob, `${fileName}.txt`);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
