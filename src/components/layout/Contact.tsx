import React from 'react';
import { getContact } from '@/lib/contentful';
import { Github, Linkedin, Twitter, Mail, Phone } from 'lucide-react';

const socialIconMap: { [key: string]: React.ElementType } = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
};

// --- Main Component ---

const Contact = async () => {
  const contactData = await getContact();

  const email = (contactData?.fields.email as string) || '';
  const phone = (contactData?.fields.phone as string) || '';
  const socialLinks = contactData?.fields.socialLinks as
    | { [key:string]: string }
    | undefined;

  return (
    <section
      id="contact"
      className="py-24 sm:py-32 bg-muted animate-fadeInUp"
      style={{ animationDelay: '1s' }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Get in Touch</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team.
          </p>
        </div>

        <div className="mx-auto max-w-lg">
          <div className="bg-card p-8 rounded-lg border shadow-sm">
            <div className="space-y-6">
              {email && (
                <a href={`mailto:${email}`} className="flex items-center space-x-4 group">
                  <Mail className="h-6 w-6 text-primary" />
                  <span className="text-lg text-muted-foreground group-hover:text-primary transition-colors">{email}</span>
                </a>
              )}
              {phone && (
                <a href={`tel:${phone}`} className="flex items-center space-x-4 group">
                  <Phone className="h-6 w-6 text-primary" />
                  <span className="text-lg text-muted-foreground group-hover:text-primary transition-colors">{phone}</span>
                </a>
              )}
              {socialLinks && (
                <div className="flex justify-center space-x-6 pt-4">
                  {Object.entries(socialLinks).map(([name, url]) => {
                    const Icon = socialIconMap[name.toLowerCase()];
                    if (!Icon) return null;
                    return (
                      <a
                        key={name}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label={`Visit my ${name} profile`}
                      >
                        <Icon className="h-8 w-8" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
