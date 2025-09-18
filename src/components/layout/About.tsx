import React from 'react';
import Image from 'next/image';
import { contentfulClient } from '@/lib/contentful';
import { type Entry, type EntryFieldTypes, type EntrySkeletonType } from 'contentful';

// --- Data Fetching and Types ---

interface AboutMeSkeleton extends EntrySkeletonType {
  fields: {
    text: EntryFieldTypes.Text;
    avatar?: EntryFieldTypes.AssetLink;
  };
  contentTypeId: 'aboutMe';
}

interface SkillSkeleton extends EntrySkeletonType {
  fields: {
    name: EntryFieldTypes.Text;
    category: EntryFieldTypes.Text;
    strength: EntryFieldTypes.Integer;
  };
  contentTypeId: 'professionalSkill';
}

type Skill = Entry<SkillSkeleton>;

const getAboutMe = async (): Promise<Entry<AboutMeSkeleton> | null> => {
  const entries = await contentfulClient.getEntries<AboutMeSkeleton>({
    content_type: 'aboutMe',
    limit: 1,
    include: 2,
  });
  return entries.items[0] || null;
};

const getSkills = async (): Promise<Skill[]> => {
  const entries = await contentfulClient.getEntries<SkillSkeleton>({
    content_type: 'professionalSkill',
    order: ['fields.category', 'fields.strength'],
  });
  return entries.items;
};

// --- Helper Components ---

const HighlightedText = ({ text }: { text: string }) => {
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
  return <p className="text-lg text-muted-foreground max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: html }} />;
};

const SkillRating = ({ level }: { level: number }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={`h-2 w-4 rounded-full mr-1 ${i < level ? 'bg-primary' : 'bg-muted'}`} />
    ))}
  </div>
);

// --- Main Component ---

const About = async () => {
  const [aboutData, skillsData] = await Promise.all([getAboutMe(), getSkills()]);

  const skillsByCategory = skillsData.reduce((acc, skill) => {
    const category = skill.fields.category as string;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const avatarUrl = aboutData?.fields.avatar ? `https:${aboutData.fields.avatar.fields.file.url}` : '/default-avatar.svg';
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

        <div>
          <h3 className="text-2xl font-bold text-center mb-8">Professional Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category} className="bg-muted rounded-lg p-6">
                <h4 className="text-xl font-bold mb-4">{category}</h4>
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.sys.id} className="flex justify-between items-center">
                      <p className="font-medium">{skill.fields.name as string}</p>
                      <SkillRating level={skill.fields.strength as number} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
