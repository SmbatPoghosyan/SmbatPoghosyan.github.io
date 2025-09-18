import React from 'react';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#work-history', label: 'Work History' },
  { href: '#projects', label: 'Projects' },
  { href: '#education', label: 'Education' },
  { href: '#contact', label: 'Contact' },
];

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-lg bg-background/80 border-border/40">
      <div className="container flex h-16 items-center justify-between">
        <a href="#" className="flex items-center space-x-2">
          <span className="font-bold text-lg tracking-tight">Smbat Poghosyan</span>
        </a>
        <nav className="hidden items-center space-x-6 text-sm md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-medium text-muted-foreground/80 transition-colors hover:text-primary"
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
