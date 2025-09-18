import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type WorkHistoryEntry } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getExperience = (jobs: WorkHistoryEntry[]) => {
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

export const toAbsoluteUrl = (url: string) => {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};
