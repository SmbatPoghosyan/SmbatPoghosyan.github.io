import React from 'react';
import { getContact } from '@/lib/contentful';

// --- Main Component ---

const Contact = async () => {
  const contactData = await getContact();

  const email = (contactData?.fields.email as string) || '';
  const phone = (contactData?.fields.phone as string) || '';
  const socialLinks = contactData?.fields.socialLinks as
    | { [key: string]: string }
    | undefined;

  return (
    <section
      id="contact"
      className="py-16 animate-fadeIn"
      style={{ animationDelay: '0.6s' }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Contact</h2>
        <div className="text-center text-lg text-muted-foreground">
          <p className="mb-4">Feel free to reach out to me.</p>
          {email && (
            <p>
              <a
                href={`mailto:${email}`}
                className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
              >
                {email}
              </a>
            </p>
          )}
          {phone && (
            <p>
              <a
                href={`tel:${phone}`}
                className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
              >
                {phone}
              </a>
            </p>
          )}
          {socialLinks && (
            <div className="flex justify-center gap-4 mt-6">
              {Object.entries(socialLinks).map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {/* Basic icon logic, can be improved with an icon library */}
                  <span className="capitalize">{name}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
