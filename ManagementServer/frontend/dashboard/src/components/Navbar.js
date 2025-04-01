'use client';

import Link from 'next/link';
import ThemeToggleButton from './ThemeToggleButton';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">
          <Link href="/">EndPoint Guard Inc.</Link>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggleButton />
          <Link href="/login" className="hover:text-gray-300">
            Login
          </Link>
          <Link href="/register" className="hover:text-gray-300">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
} 