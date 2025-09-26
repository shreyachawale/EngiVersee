// API utility for frontend to call backend
export async function uploadProjectToBackend(formData: any, files: File[]) {
  const data = new FormData();
  data.append('formData', JSON.stringify(formData));
  files.forEach((file) => data.append('files', file));

  const response = await fetch('http://localhost:5000/analyze', {
    method: 'POST',
    body: data,
  });
  if (!response.ok) throw new Error('Failed to upload project');
  return response.json();
}
