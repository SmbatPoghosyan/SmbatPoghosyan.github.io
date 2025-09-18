import React from 'react';
import { getWorkHistory } from '@/lib/contentful';
import { getExperience } from '@/lib/utils';
import JobCard from './JobCard';

// --- Main Component ---

const WorkHistory = async () => {
  const workHistory = await getWorkHistory();
  const experienceYears = getExperience(workHistory);

  return (
    <section id="work-history" className="py-16 bg-muted animate-fadeIn" style={{ animationDelay: '0.2s' }}>
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Work History</h2>
          {experienceYears > 0 && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              With over {experienceYears}+ years of hands-on experience, I have had the opportunity to work with some amazing companies and on some challenging projects.
            </p>
          )}
        </div>

        <div className="mt-12 space-y-8">
          {workHistory.map((job) => (
            <JobCard key={job.sys.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkHistory;
