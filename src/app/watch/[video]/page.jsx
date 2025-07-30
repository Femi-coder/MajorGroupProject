'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function WatchPage() {
  const params = useParams();
  const video = params.video;

  const videoFile = `/videos/${video}.mp4`;

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments([...comments, comment.trim()]);
    setComment('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-800 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">🎬 Now Watching: {video}</h1>

      <video className="rounded shadow-lg w-full max-w-3xl mb-6" controls>
        <source src={videoFile} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 p-2 rounded border border-gray-300"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Post
          </button>
        </form>

        <div className="space-y-2">
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            comments.map((c, i) => (
              <div
                key={i}
                className="p-3 bg-white rounded shadow border border-gray-200"
              >
                {c}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
