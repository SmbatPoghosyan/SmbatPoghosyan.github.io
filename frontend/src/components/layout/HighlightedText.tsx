import React from 'react';

interface HighlightedTextProps {
  text: string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({ text }) => {
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
  return (
    <p
      className="text-lg text-muted-foreground max-w-3xl"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default HighlightedText;
