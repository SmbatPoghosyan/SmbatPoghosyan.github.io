import React from 'react';
import { type WorkHistory } from '@/lib/types';

interface JobCardProps {
  job: WorkHistory;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">{job.title}</h3>
          <p className="text-muted-foreground font-medium">
            {job.company}, {job.location}
          </p>
        </div>
        <p className="text-muted-foreground text-sm">{job.period}</p>
      </div>
      <p className="mt-4 text-muted-foreground">{job.description}</p>
    </div>
  );
};

export default JobCard;
