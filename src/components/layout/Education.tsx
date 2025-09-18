import React from 'react';

const Education = () => {
  return (
    <section id="education" className="py-16 bg-muted animate-fadeIn" style={{ animationDelay: '0.4s' }}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Education</h2>
        <div className="flex justify-center gap-8">
          {/* Placeholder for education items */}
          <div className="bg-background rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Russian-Armenian University</h3>
            <p className="text-muted-foreground">2013-2017</p>
          </div>
          <div className="bg-background rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Armenian Code Academy</h3>
            <p className="text-muted-foreground">2018-2019</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
