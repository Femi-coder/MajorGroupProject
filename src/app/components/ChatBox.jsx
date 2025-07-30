'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Change to your backend URL if deployed

export default function ChatBox() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('chatMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('chatMessage');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chatMessage', message);
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 bg-white p-4 rounded shadow-md w-72">
      <h2 className="font-bold text-lg mb-2">💬 Live Chat</h2>
      <div className="h-40 overflow-y-auto border p-2 mb-2 text-sm">
        {messages.map((msg, i) => (
          <div key={i} className="mb-1">{msg}</div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border px-2 py-1 rounded-l text-sm"
          placeholder="Type your message..."
        />
        <button type="submit" className="bg-blue-500 text-white px-3 rounded-r text-sm">
          Send
        </button>
      </form>
    </div>
  );
}
