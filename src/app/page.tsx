import About from "@/components/layout/About";
import Contact from "@/components/layout/Contact";
import Education from "@/components/layout/Education";
import Projects from "@/components/layout/Projects";
import Fun from "@/components/layout/Fun";
import WorkHistory from "@/components/layout/WorkHistory";

export default function Home() {
  return (
    <main>
      <About />
      <WorkHistory />
      <Projects />
      <Fun />
      <Education />
      <Contact />
    </main>
  );
}
