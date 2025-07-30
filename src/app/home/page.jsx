'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ChatBox from '../components/ChatBox';

const videos = [
  { name: 'demi', title: '🎤 Demzi - Live' },
  { name: 'lab2', title: '🧪 Lab 2 Demonstration' },
  { name: 'congo', title: '💃 Congo Dance' },
  { name: 'trivela', title: '⚽ Trivela Skill' },
  { name: 'dance', title: '🎶 Dance' },
];

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMessage('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', data.username);
      setIsLoggedIn(true);
      setLoginMessage(`✅ Welcome, ${data.username}`);
    } catch (err) {
      setLoginMessage(`❌ ${err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <h1 className="text-4xl font-extrabold text-center md:text-left text-gray-800 dark:text-white">
            🎬 Video Library
          </h1>

          {isLoggedIn && (
            <div className="flex gap-4">
              <Link
                href="/upload"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition duration-200"
              >
                ⬆️ Upload Video
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow"
              >
                🔓 Logout
              </button>
            </div>
          )}
        </div>

        {/* Login Form */}
        {!isLoggedIn && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md mb-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">🔐 Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              >
                Login
              </button>
            </form>
            {loginMessage && (
              <p
                className={`mt-4 font-medium ${
                  loginMessage.includes('✅') ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {loginMessage}
              </p>
            )}
          </div>
        )}

        {/* Video Grid */}
        {isLoggedIn && (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <Link
                key={video.name}
                href={`/watch/${video.name}`}
                className="group block bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="relative overflow-hidden rounded-t-xl">
                  <video
                    className="w-full h-48 object-cover group-hover:brightness-90"
                    muted
                    playsInline
                    autoPlay
                    loop
                    preload="metadata"
                  >
                    <source src={`/videos/${video.name}.mp4`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 transition">
                    {video.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Click to watch</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Live Chat */}
      {isLoggedIn && <ChatBox />}
    </div>
  );
}
