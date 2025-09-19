import React from 'react';
import { type WorkHistoryEntry } from '@/lib/types';
import JobCard from './JobCard';

interface TimelineProps {
  jobs: WorkHistoryEntry[];
}

const Timeline: React.FC<TimelineProps> = ({ jobs }) => {
  return (
    <div className="relative container mx-auto px-4">
      <div className="absolute h-full border-l-2 border-border left-4 -translate-x-1/2 md:left-1/2"></div>
      <div className="space-y-12">
        {jobs.map((job, index) => (
          <div
            key={job.sys.id}
            className="relative w-full animate-fadeInUp md:flex md:items-center"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div
              className="absolute w-4 h-4 rounded-full bg-primary left-4 -translate-x-1/2 md:left-1/2"
            ></div>
            <div
              className={`w-full pl-10 md:w-1/2 ${
                index % 2 === 0 ? 'md:pl-0 md:pr-8 md:mr-auto' : 'md:pl-8 md:ml-auto'
              }`}
            >
              <JobCard job={job} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
