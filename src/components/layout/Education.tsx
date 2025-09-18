import React from 'react';
import { getEducation } from '@/lib/contentful';

// --- Icon Component ---

const GraduationCapIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.084a1 1 0 0 0 0 1.838l8.57 3.908a2 2 0 0 0 1.66 0l8.59-3.908Z" />
    <path d="M6 12v4c0 4.5 3 6 6 6s6-1.5 6-6v-4" />
  </svg>
);

// --- Main Component ---

const Education = async () => {
  const educationHistory = await getEducation();

  return (
    <section id="education" className="py-16 bg-muted animate-fadeIn" style={{ animationDelay: '0.4s' }}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Education</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {educationHistory.map((edu) => (
            <div key={edu.sys.id} className="bg-background rounded-lg p-6 text-center flex flex-col items-center shadow-md">
              <div className="p-3 bg-primary/10 rounded-full mb-4">
                <GraduationCapIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{edu.fields.institution as string}</h3>
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
