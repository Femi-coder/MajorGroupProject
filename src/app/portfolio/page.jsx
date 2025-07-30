import Navbar from './Navbar';
import TransitionWrapper from './TransitionWrapper';
import Image from 'next/image';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <TransitionWrapper>
        <main className="ml-48 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
          <div className="text-center p-8">
            <Image
              src="/femi.png"
              alt="Femi"
              width={500}
              height={300}
              className="rounded-full mx-auto mb-6 object-cover border-4 border-gray-700 shadow-lg"
            />
            <h1 className="text-5xl font-bold mb-3">Hi, I'm Femi Onasanya</h1>
            <p className="text-xl text-gray-300">Final Year Computing Student • React & Node.js Developer</p>
          </div>
        </main>
      </TransitionWrapper>
    </>
  );
}
