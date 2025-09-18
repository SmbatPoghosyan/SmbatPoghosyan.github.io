import React from 'react';
import Image from 'next/image';
import { getAboutMe, getSkills } from '@/lib/contentful';
import HighlightedText from './HighlightedText';
import ProfessionalSkills from './ProfessionalSkills';

// --- Main Component ---

const About = async () => {
  const [aboutData, skillsData] = await Promise.all([getAboutMe(), getSkills()]);

  const avatarUrl = (() => {
    const asset = aboutData?.fields.avatar as { fields?: { file?: { url?: string } } } | undefined;
    const fileUrl = asset?.fields?.file?.url;
    if (fileUrl) {
      return fileUrl.startsWith('http') ? fileUrl : `https:${fileUrl}`;
    }
    const avatarText = aboutData?.fields.avatarUrl as string | undefined;
    if (avatarText) {
      return avatarText.startsWith('http') ? avatarText : `https://${avatarText}`;
    }
    return '/default-avatar.svg';
  })();
  const aboutText = aboutData?.fields.text as string || 'Dynamic content coming soon...';

  return (
    <section id="about" className="py-24 sm:py-32 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-1 flex justify-center">
            <Image
              src={avatarUrl}
              alt="Avatar"
              width={200}
              height={200}
              className="rounded-full shadow-lg border-4 border-card"
            />
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">About Me</h2>
            <div className="text-lg text-muted-foreground space-y-4">
              <HighlightedText text={aboutText} />
            </div>
          </div>
        </div>

        <div className="mt-24">
          <ProfessionalSkills skills={skillsData} />
        </div>
      </div>
    </section>
  );
};

export default About;
