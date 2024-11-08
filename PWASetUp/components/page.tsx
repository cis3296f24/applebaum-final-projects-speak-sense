import React, { ReactNode } from 'react';
import AppBar from './appbar';
import BottomNav from './bottom-nav';

interface PageProps {
  children: ReactNode;
  className?: string;
}

const Page: React.FC<PageProps> = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen bg-background text-text">
      <AppBar />
      <main className={`pt-16 pb-20 px-6 ${className}`}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default Page;