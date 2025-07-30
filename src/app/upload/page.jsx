'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!video) {
      setMessage('❌ Please select a video first.');
      return;
    }

    setIsUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('video', video);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      setMessage(result.message || result.error || 'Unknown response');
    } catch (err) {
      setMessage('❌ Upload failed. Try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-6">
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
          ⬆️ Upload a New Video
        </h2>

        <form onSubmit={handleUpload} className="space-y-6">
          <input
            type="file"
            accept="video/mp4"
            onChange={(e) => setVideo(e.target.files[0])}
            className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <button
            type="submit"
            disabled={isUploading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow transition ${
              isUploading && 'opacity-50 cursor-not-allowed'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>

        {message && (
          <p
            className={`mt-6 text-center font-medium ${
              message.startsWith('❌') ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
