import Navbar from '../Navbar';
import TransitionWrapper from '../TransitionWrapper';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <TransitionWrapper>
        <main className="ml-48 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
  <div className="max-w-xl mx-auto">
    <h1 className="text-3xl font-bold mb-6 text-center">Contact Me</h1>

    <form
      action="https://formspree.io/f/mgvzzowd"
      method="POST"
      className="space-y-4"
    >
      <div>
        <label htmlFor="name" className="block mb-1 text-gray-300">Name</label>
        <input
          type="text"
          name="name"
          required
          className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
        />
      </div>

      <div>
        <label htmlFor="email" className="block mb-1 text-gray-300">Email</label>
        <input
          type="email"
          name="email"
          required
          className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
        />
      </div>

      <div>
        <label htmlFor="message" className="block mb-1 text-gray-300">Message</label>
        <textarea
          name="message"
          rows="5"
          required
          className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
        ></textarea>
      </div>

      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-6 rounded transition"
      >
        Send
      </button>
    </form>
  </div>
</main>

      </TransitionWrapper>
    </>
  );
}
