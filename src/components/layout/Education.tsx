import React from 'react';
import { getEducation } from '@/lib/contentful';
import { GraduationCap } from 'lucide-react';

// --- Main Component ---

const Education = async () => {
  const educationHistory = await getEducation();

  return (
    <section id="education" className="py-24 sm:py-32 animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Education</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
            My academic background and qualifications.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {educationHistory.map((edu) => (
            <div key={edu.sys.id} className="bg-card rounded-lg p-8 text-center flex flex-col items-center border shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <div className="p-4 bg-primary/10 rounded-full mb-6">
                <GraduationCap className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{edu.fields.institution as string}</h3>
              <p className="text-muted-foreground mb-1 flex-grow">{edu.fields.degree as string}</p>
              <p className="text-muted-foreground text-sm mt-2">{edu.fields.period as string}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
