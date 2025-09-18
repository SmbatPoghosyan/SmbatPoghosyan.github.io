import React from 'react';
import { getWorkHistory } from '@/lib/contentful';
import { getExperience } from '@/lib/utils';
import Timeline from './Timeline';

// --- Main Component ---

const WorkHistory = async () => {
  const workHistory = await getWorkHistory();
  const experienceYears = getExperience(workHistory);

  return (
    <section id="work-history" className="py-24 sm:py-32 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Work History</h2>
          {experienceYears > 0 && (
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
              With over {experienceYears}+ years of hands-on experience, I have had the opportunity to work with some amazing companies and on some challenging projects.
            </p>
          )}
        </div>

        <Timeline jobs={workHistory} />
      </div>
    </section>
  );
};

export default WorkHistory;
