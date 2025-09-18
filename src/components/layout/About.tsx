import React from 'react';

const skills = [
  'JavaScript (ES6+)',
  'TypeScript',
  'Node.js (Express, Nest)',
  'React (Next.js)',
  'Angular 2+',
  'HTML5 & CSS3 (SASS, LESS)',
  'SQL (MySQL, PostgreSQL)',
  'NoSQL (MongoDB, Redis)',
  'RESTful & GraphQL APIs',
  'Git & GitHub/Bitbucket',
  'AWS (S3, EC2, Lambda, RDS)',
  'Firebase',
  'Jira, Trello, Azure Boards',
];

const About = () => {
  return (
    <section id="about" className="py-16 animate-fadeIn">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">About Me</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            As a Full Stack Software Engineer, I possess a strong understanding of both front-end and back-end development. I am well-versed in Web Application Architecture and have had the privilege of working with highly successful development teams.
          </p>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold text-center mb-8">Professional Skills</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {skills.map((skill, index) => (
              <div key={index} className="bg-muted text-muted-foreground rounded-full px-4 py-2 text-sm font-medium">
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
