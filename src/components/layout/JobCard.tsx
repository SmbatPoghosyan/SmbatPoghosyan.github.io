import React from 'react';
import { type WorkHistoryEntry } from '@/lib/types';

interface JobCardProps {
  job: WorkHistoryEntry;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="bg-background rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">{job.fields.title as string}</h3>
          <p className="text-muted-foreground font-medium">
            {job.fields.company as string}, {job.fields.location as string}
          </p>
        </div>
        <p className="text-muted-foreground text-sm">{job.fields.period as string}</p>
      </div>
      <p className="mt-4 text-muted-foreground">{job.fields.description as string}</p>
    </div>
  );
};

export default JobCard;
