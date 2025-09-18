import React from 'react';
import { contentfulClient } from '@/lib/contentful';
import { type Entry, type EntryFieldTypes, type EntrySkeletonType } from 'contentful';

// --- Data Fetching and Types ---

interface WorkHistorySkeleton extends EntrySkeletonType {
  fields: {
    company: EntryFieldTypes.Text;
    location: EntryFieldTypes.Text;
    period: EntryFieldTypes.Text;
    title: EntryFieldTypes.Text;
    description: EntryFieldTypes.Text;
    startDate: EntryFieldTypes.Date;
  };
  contentTypeId: 'workHistory';
}

type Job = Entry<WorkHistorySkeleton>;

const getWorkHistory = async (): Promise<Job[]> => {
  const entries = await contentfulClient.getEntries<WorkHistorySkeleton>({
    content_type: 'workHistory',
    order: ['-fields.startDate'], // Order by start date, newest first
  });
  return entries.items;
};

// --- Helper Functions ---

const getExperience = (jobs: Job[]) => {
  if (!jobs.length) {
    return 0;
  }
  // Find the earliest start date from the work history
  const startDate = new Date(
    Math.min(...jobs.map(job => new Date(job.fields.startDate as string).getTime()))
  );
  const currentDate = new Date();
  const diff = currentDate.getTime() - startDate.getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  return years;
};

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
            <div key={job.sys.id} className="bg-background rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{job.fields.title}</h3>
                  <p className="text-muted-foreground font-medium">{job.fields.company}, {job.fields.location}</p>
                </div>
                <p className="text-muted-foreground text-sm">{job.fields.period}</p>
              </div>
              <p className="mt-4 text-muted-foreground">{job.fields.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkHistory;
