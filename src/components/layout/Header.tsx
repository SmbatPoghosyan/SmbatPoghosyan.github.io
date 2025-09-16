import React from 'react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <a href="#" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Smbat Poghosyan</span>
          </a>
          <a href="#about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            About
          </a>
          <a href="#work" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Work
          </a>
          <a href="#education" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Education
          </a>
          <a href="#contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
