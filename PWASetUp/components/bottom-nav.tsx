import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard' },
  { href: '/record', label: 'Record' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/settings', label: 'Settings' },
];

const BottomNav: React.FC = () => {
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 w-full bg-surface text-text px-6 py-3">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center p-2 ${
              router.pathname === item.href
                ? 'text-primary'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;