import React from 'react';
import { Search, Edit } from 'lucide-react';
import './ESGDetails.css';

const FrameworksPage = () => {
  const defaultFrameworks = [
    { id: 1, name: 'IFRS S1' },
    { id: 2, name: 'IFRS S2' },
    { id: 3, name: 'TNFD' }
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="flex items-center gap-8">
            <div className="logo">ecoM</div>
            <nav>
              <ul className="nav-menu">
                <li>SEARCH</li>
                <li>COMPARISON TOOL</li>
                <li className="text-[#3b82f6]">FRAMEWORKS</li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span>Hi there, zhongshuaming</span>
            <button className="logout-button">LOG OUT</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        <div className="flex justify-between items-center mb-8">
          <h1 className="page-title">Frameworks Page</h1>
          <button className="help-button">Help</button>
        </div>

        {/* Search and Create Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative w-[600px]">
            <input
              type="text"
              placeholder="Search frameworks..."
              className="w-full p-2 pr-10 border rounded-md"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button className="bg-[#90be6d] text-white px-4 py-2 rounded-md flex items-center gap-2">
            Create New Framework +
          </button>
        </div>

        {/* Active Frameworks Section */}
        <div className="mb-8">
          <h2 className="text-[#3b82f6] font-semibold border-b-2 border-[#3b82f6] inline-block mb-4">
            Active Frameworks
          </h2>
        </div>

        {/* Default Frameworks Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Default Frameworks</h2>
          <div className="space-y-2">
            {defaultFrameworks.map((framework) => (
              <div
                key={framework.id}
                className="flex justify-between items-center bg-[#e2e8f0] p-4 rounded-md"
              >
                <span>{framework.name}</span>
                <button className="p-2 hover:bg-gray-200 rounded-md">
                  <Edit size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameworksPage;
