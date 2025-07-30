import Navbar from '../Navbar';
import TransitionWrapper from '../TransitionWrapper';

export default function SkillsPage() {
  return (
    <>
      <Navbar />
      <TransitionWrapper>
        <main className="ml-48 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">My Skills</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              'React.js',
              'Node.js',
              'JavaScript',
              'MongoDB',
              'Express.js',
              'Tailwind CSS',
              'HTML & CSS',
              'Git & GitHub',
              'Next.js',
              'REST APIs',
              'Postman',
              'Figma'
            ].map((skill, index) => (
              <div
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center shadow hover:scale-105 transition-transform duration-200"
              >
                {skill}
              </div>
            ))}
          </div>
        </main>
      </TransitionWrapper>
    </>
  );
}
