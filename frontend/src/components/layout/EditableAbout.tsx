import HighlightedText from './HighlightedText';

type AboutProps = {
  initialAboutText: string;
};

export default function About({ initialAboutText }: AboutProps) {
  return (
    <>
      <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
        About Me
      </h2>
      <div className="text-lg text-muted-foreground space-y-4">
        <HighlightedText text={initialAboutText} />
      </div>
    </>
  );
}
