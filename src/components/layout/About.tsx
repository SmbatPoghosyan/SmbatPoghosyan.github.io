import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-16 animate-fadeIn">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">About Me</h2>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 text-lg text-muted-foreground">
            <p className="mb-4">
              At university I studied programming language C ++. My teacher was not so good, and I decided to go to study with a private teacher. Later I became interested in the development of Unity3D(C#) games. And me and my friends even tried to create a team. After the army I began to learn a programming language for web development JavaScript (HTML, CSS) in Armenian Code Academy, snd I'm still studying there.
            </p>
            <p>
              At this moment I know the basic part of JS, HTML and CSS, OOP. I have knowledge of Armenian, Russian and English languages. I am a conscientious person who works hard and pays attention to detail. I'm flexible, quick to pick up new skills and eager to learn from others.
            </p>
          </div>
          <div className="md:w-1/2">
            {/* TODO: Add skills with progress bars or other visual representation */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Javascript</h3>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">HTML</h3>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">CSS</h3>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">React JS</h3>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
