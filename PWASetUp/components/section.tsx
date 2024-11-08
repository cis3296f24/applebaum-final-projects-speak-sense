import React, { ReactNode } from 'react';

interface SectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, className = '' }) => {
  return (
    <section className={`mb-6 ${className}`}>
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      {children}
    </section>
  );
};

export default Section;