import React from 'react';
import { getAboutMe, getSkills } from '@/lib/api';
import EditableProfessionalSkills from './EditableProfessionalSkills';
import DynamicAvatar from './DynamicAvatar';
import EditableAbout from './EditableAbout';

// --- Main Component ---

const About = async () => {
  const [aboutData, skillsCategories] = await Promise.all([
    getAboutMe(),
    getSkills(),
  ]);

  const avatarUrl = aboutData?.avatar_url || '/default-avatar.svg';
  const aboutText = aboutData?.text || 'Dynamic content coming soon...';

  return (
    <section id="about" className="py-24 sm:py-32 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 items-center md:grid-cols-3">
          <div className="flex justify-center items-center">
            <DynamicAvatar
              src={avatarUrl}
              alt="Avatar"
              width={200}
              height={200}
            />
          </div>
          <div className="md:col-span-2">
            <EditableAbout initialAboutText={aboutText} />
          </div>
        </div>

        <div className="mt-24">
          <EditableProfessionalSkills categories={skillsCategories} />
        </div>
      </div>
    </section>
  );
};

export default About;
