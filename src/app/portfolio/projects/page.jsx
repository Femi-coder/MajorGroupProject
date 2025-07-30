import Navbar from '../Navbar';
import TransitionWrapper from '../TransitionWrapper';

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <TransitionWrapper>
        <main className="ml-48 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Projects</h2>

            {/* Project 1: Eco Wheels Dublin */}
            <div className="bg-gray-800 p-6 rounded shadow border border-gray-700 space-y-4 mb-10">
              <h3 className="text-2xl font-semibold">Eco Wheels Dublin</h3>
              <p className="text-gray-400 italic">Group project • Sept 2024 – May 2025</p>

              <p className="text-gray-300">
                Eco Wheels Dublin is a full-stack electric vehicle rental platform developed over two semesters
                as part of a group college project. Users can browse and book available EVs, return them, and
                view nearby EV charging stations and return points through an integrated map interface.
              </p>

              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Users can rent and return electric cars via a clean web interface</li>
                <li>Admins can manage vehicle availability and monitor fleet status</li>
                <li>Integrated live maps showing EV stations using MapTiler & Overpass API</li>
                <li>Role-based access: users, student-sharers, and admin</li>
                <li>Transaction history & dynamic data per user</li>
              </ul>

              <p className="text-gray-300">
                <strong>Tech Stack:</strong> React, Next.js, Node.js, MongoDB, Tailwind CSS, MapTiler API, Overpass API
              </p>

              <p className="text-gray-400">
                This project reflects my ability to collaborate on real-world applications, implement full-stack features,
                and manage advanced UI integrations like live maps and data filtering.
              </p>

              <div className="mt-4">
                <a
                  href="https://major-group-project-mu.vercel.app/majorgroupproject"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded transition"
                >
                  View Live Demo
                </a>
              </div>
            </div>

            {/* Project 2: Video Gallery Website */}
            <div className="bg-gray-800 p-6 rounded shadow border border-gray-700 space-y-4">
              <h3 className="text-2xl font-semibold">Video Gallery Website</h3>
              <p className="text-gray-400 italic">Personal project • 2025</p>

              <p className="text-gray-300">
                A responsive video gallery website where users can browse and watch embedded video content. Built to practice layout design, media integration, and dynamic video rendering.
              </p>

              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Displays a grid of video thumbnails</li>
                <li>Responsive layout using Tailwind CSS</li>
                <li>Videos play in a lightbox or modal popup</li>
                <li>Designed to be mobile-friendly</li>
              </ul>

              <p className="text-gray-300">
                <strong>Tech Stack:</strong> React, Tailwind CSS, HTML5 Video, JavaScript
              </p>

              <div className="mt-4">
                <a
                  href="https://your-video-gallery-link.vercel.app" // update with your actual Vercel link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded transition"
                >
                  View Live Demo
                </a>
              </div>
            </div>
          </div>
        </main>
      </TransitionWrapper>
    </>
  );
}
