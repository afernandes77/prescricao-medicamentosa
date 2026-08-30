import React from 'react';
import { FiHeartHandshake } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-blue-600">
          <FiHeartHandshake size={32} />
          MedCheck
        </Link>
        <nav className="flex gap-6">
          <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">
            Upload
          </Link>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
            Sobre
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
