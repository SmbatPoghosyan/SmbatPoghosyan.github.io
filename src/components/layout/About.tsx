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
    <section id="about" className="py-16 animate-fadeIn">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={128}
            height={128}
            className="rounded-full mx-auto mb-6 border-4 border-muted"
          />
          <h2 className="text-3xl font-bold mb-4">About Me</h2>
          <HighlightedText text={aboutText} />
        </div>

        <ProfessionalSkills skills={skillsData} />
      </div>
    </section>
  );
};

export default About;
