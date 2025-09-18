import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="py-16 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Contact</h2>
        <div className="text-center text-lg text-muted-foreground">
          <p className="mb-4">Feel free to reach out to me.</p>
          <p>
            <a href="mailto:sampogosyan1995@gmail.com" className="font-medium underline underline-offset-4">
              sampogosyan1995@gmail.com
            </a>
          </p>
          <p>
            <a href="tel:+374-44-821-484" className="font-medium underline underline-offset-4">
              +374-44-821-484
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
