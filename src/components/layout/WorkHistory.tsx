import React from 'react';

const workHistory = [
  {
    company: 'ZEMA',
    location: 'Yerevan, Armenia',
    period: '2023-05 - current',
    title: 'LEAD SOFTWARE ENGINEER',
    description:
      'Leading a team of 3 developers, 2 QA engineers, and 1 UI developer. Working on an insurance project for a large client in the USA. Making architectural decisions on implementing new features, database design, and technology selection.',
  },
  {
    company: 'DataArt',
    location: 'Yerevan, Armenia',
    period: '2022-01 - 2023-04',
    title: 'SOFTWARE ENGINEER',
    description:
      'Contributed to the development of a media platform, using Node.js, React, Express, PostgreSql to deliver an intuitive and user-friendly experience for users to manage, share, and interact with media content.',
  },
  {
    company: 'EPAM',
    location: 'Yerevan, Armenia',
    period: '2021-04 - 2022-01',
    title: 'SOFTWARE ENGINEER',
    description:
      'Developed and maintained robust, scalable and secure full-stack applications using a combination of technologies such as Node.js, React, Express, Nest, MongoDB, and RESTful services, delivering high-quality solutions that meet the needs of clients. Implemented microservices architecture to improve the efficiency and scalability of applications, ensuring a seamless user experience for end-users. Worked closely with cross-functional teams, including designers and project managers, to analyze requirements, design solutions, and deploy applications to production, continuously optimizing and improving the overall performance and functionality of the applications.',
  },
  {
    company: 'NOORLOGIC',
    location: 'Yerevan, Armenia',
    period: '2020-10 - 2021-04',
    title: 'Javascript developer',
    description:
      'Designed and implemented efficient APIs for various applications, leveraging technologies such as React, Node.js, and AWS, to meet the needs of clients and enhance the overall functionality of the applications. Utilized PostgreSql to develop and maintain databases, while also contributing to the creation of visually appealing and user-friendly designs, improving the overall user experience.',
  },
  {
    company: 'SunnySchool',
    location: 'Yerevan, Armenia',
    period: '2020-09 - 2021-02',
    title: 'Javascript Tutor',
    description:
      "Guided and instructed students on JavaScript programming concepts and techniques, utilizing hands-on lessons and real-world examples to enhance their understanding and skills in the language. Assessed students' progress and provided personalized feedback and support, encouraging them to apply their newfound knowledge in practical projects, and fostering a collaborative and engaged learning environment.",
  },
  {
    company: 'Polymorphic',
    location: 'Yerevan, Armenia',
    period: '2019-02 - 2020-10',
    title: 'Javascript developer',
    description:
      'Successfully executed full redesigns of websites with a focus on enhancing navigation and visual elements. Demonstrated expertise in transforming concepts into robust design mockups and prototypes that bolster design, improve user experience, and streamline site interactions. Utilized extensive programming skills in JavaScript (ReactJs, Angular, Node.js), HTML, CSS (SASS, LESS), PHP (Laravel) and additional libraries as necessary.',
  },
];

const getExperience = () => {
  const startDate = new Date('2019-02-01');
  const currentDate = new Date();
  const diff = currentDate.getTime() - startDate.getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  return years;
}

const WorkHistory = () => {
  return (
    <section id="work-history" className="py-16 bg-muted animate-fadeIn" style={{ animationDelay: '0.2s' }}>
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Work History</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            With over {getExperience()}+ years of hands-on experience, I have had the opportunity to work with some amazing companies and on some challenging projects.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {workHistory.map((job, index) => (
            <div key={index} className="bg-background rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <p className="text-muted-foreground font-medium">{job.company}, {job.location}</p>
                </div>
                <p className="text-muted-foreground text-sm">{job.period}</p>
              </div>
              <p className="mt-4 text-muted-foreground">{job.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkHistory;
