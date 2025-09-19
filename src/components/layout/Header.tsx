import React from 'react';
import { getAuthor } from '@/lib/contentful';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#work-history', label: 'Work History' },
  { href: '#projects', label: 'Projects' },
  { href: '#education', label: 'Education' },
  { href: '#contact', label: 'Contact' },
];

const Header = async () => {
  const author = await getAuthor();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <a href="#" className="flex items-center space-x-2">
          <span className="font-bold text-lg tracking-tight">{author?.fields.name as string}</span>
        </a>
        <nav className="hidden items-center space-x-6 text-sm md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-medium text-muted-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
