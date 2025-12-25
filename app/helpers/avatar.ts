/* =======================
   HELPERS
======================= */
export async function fetchAvatarBase64(url: string) {
  const res = await fetch(url);
  if (!res.ok) return null;

  const buffer = await res.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return `data:image/png;base64,${btoa(binary)}`;
}
