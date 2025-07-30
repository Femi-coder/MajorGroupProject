import Navbar from '../Navbar';
import TransitionWrapper from '../TransitionWrapper';
import { FaGraduationCap, FaCode, FaLaptopCode, FaHeart } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <TransitionWrapper>
        <main className="ml-48 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
          <div className="max-w-4xl mx-auto space-y-10">
            <section>
              <h2 className="text-3xl font-bold mb-3">About Me</h2>
              <p className="text-gray-300 leading-relaxed">
                I'm a final-year Computing student passionate about full-stack web development. I enjoy building clean, modern, and functional user experiences.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2"><FaGraduationCap /> Education</h3>
              <p className="text-gray-400">BSc in Computing – TU Dublin (2022–2026)</p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2"><FaLaptopCode /> What I Do</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Build full-stack web apps with React, Node.js, and MongoDB</li>
                <li>Create responsive UIs using Tailwind CSS and Next.js</li>
                <li>Version control & collaboration with Git & GitHub</li>
                <li>Deployment with Vercel</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2"><FaHeart /> Interests</h3>
              <p className="text-gray-400">
                I love exploring new tech, solving real-world problems, working on side projects, and improving my UI/UX design skills. Outside of coding, I enjoy fitness, playing football and cooking.
              </p>
            </section>
          </div>
        </main>
      </TransitionWrapper>
    </>
  );
}
