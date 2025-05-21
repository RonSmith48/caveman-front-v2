// utils/isUTF8.js

export const isUTF8 = async (file) => {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  try {
    // Throws on invalid UTF-8
    new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    return true;
  } catch (err) {
    return false;
  }
};
