import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* You can add a logo or site title here later */}
        <div className="text-lg font-bold">
          <Link href="/">MyApp</Link> {/* Link to landing page */}
        </div>
        <div className="space-x-4"> {/* Added space-x-4 for spacing */}
          <Link href="/login" className="hover:text-gray-300">
            Login
          </Link>
          <Link href="/register" className="hover:text-gray-300"> {/* Added Register link */} 
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
} 