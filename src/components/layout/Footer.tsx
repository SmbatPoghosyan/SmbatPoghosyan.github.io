import React from 'react';

const Footer = () => {
  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} Smbat Poghosyan. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/SmbatPoghosyan" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/smbat-poghosyan-429688189/" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
