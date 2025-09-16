import About from "@/components/layout/About";
import Contact from "@/components/layout/Contact";
import Education from "@/components/layout/Education";
import Work from "@/components/layout/Work";

export default function Home() {
  return (
    <main>
      <About />
      <Work />
      <Education />
      <Contact />
    </main>
  );
}
