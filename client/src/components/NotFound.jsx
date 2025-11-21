import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
        <h1 className="text-9xl font-black text-white mb-4">404</h1>
        <p className="text-2xl text-white/80 mb-8">Page Not Found</p>
        <Link 
          to="/" 
          className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:opacity-90 transition inline-block"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
