import React from 'react';

const AppBar: React.FC = () => {
  return (
    <header className="bg-surface text-text px-6 py-4 fixed top-0 w-full z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">SpeakSense</h1>
          <div className="relative">
            <input
              type="search"
              placeholder="Search here..."
              className="bg-background rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 rounded-full hover:bg-background"
            aria-label="Notifications"
          >
            <span className="sr-only">Notifications</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-600" />
        </div>
      </div>
    </header>
  );
};

export default AppBar;