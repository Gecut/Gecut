export function downloadBlob(
  content: string,
  filename: string,
  contentType = 'text/csv;charset=utf-8;',
): void {
  const blob = new Blob([content], {type: contentType});
  const url = URL.createObjectURL(blob);

  const pom = document.createElement('a');
  pom.href = url;
  pom.setAttribute('download', filename);
  pom.click();
}
