import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="py-16 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Contact</h2>
        <p className="text-center text-lg text-muted-foreground">
          Feel free to reach out to me on my social media platforms.
        </p>
        {/* Social links will be in the footer */}
      </div>
    </section>
  );
};

export default Contact;
