import React from 'react';

const education = [
  {
    institution: 'Rau (Russian-armenian university)',
    degree: 'Masters Degree in Infocommunication technologies',
    period: '2018 - 2020',
  },
  {
    institution: 'RAU (RUSSIAN-ARMENIAN UNIVERSITY)',
    degree: "Bachelor's Degree in Infocommunication technologies",
    period: '2012 - 2016',
  },
  {
    institution: 'Aca (Armenian code academy)',
    degree: 'JavaScript (ReactJS)',
    period: 'october 2018 - march 2019',
  },
];

const Education = () => {
  return (
    <section id="education" className="py-16 bg-muted animate-fadeIn" style={{ animationDelay: '0.4s' }}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Education</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {education.map((edu, index) => (
            <div key={index} className="bg-background rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold mb-2">{edu.institution}</h3>
              <p className="text-muted-foreground mb-1">{edu.degree}</p>
              <p className="text-muted-foreground text-sm">{edu.period}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
