import { useState, useEffect, React } from 'react';

function ProfileUploader({returnBase64String}) {
  const [base64String, setBase64String] = useState('');

  useEffect(() => {
    returnBase64String(base64String);
  }, [base64String]);

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        const base64Content = await readFileAsBase64(file);
        setBase64String(base64Content);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = btoa(reader.result);
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsBinaryString(file);
    });
  };

  return (
    <form>
        <input type="file" id="profileUploader" onChange={handleFileInputChange} />
    </form>
  );
};

export default ProfileUploader;

