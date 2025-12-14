export const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix if only base64 is needed
      const base64 = result.split(",")[1];
      resolve(base64);
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};
