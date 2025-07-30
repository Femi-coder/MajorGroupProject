'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Home', path: '/portfolio' },
  { name: 'About', path: '/portfolio/about' },
  { name: 'Skills', path: '/portfolio/skills' },
  { name: 'Projects', path: '/portfolio/projects' },
  { name: 'Contact', path: '/portfolio/contact' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-48 bg-indigo-900 text-white flex flex-col items-center py-8 shadow-lg">
      <h1 className="text-xl font-bold mb-10">My Portfolio</h1>
      <nav className="flex flex-col space-y-4 w-full px-4">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.path}
            className={`py-2 px-3 rounded transition ${
              pathname === link.path
                ? 'bg-white text-indigo-900 font-semibold'
                : 'hover:bg-indigo-800'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
