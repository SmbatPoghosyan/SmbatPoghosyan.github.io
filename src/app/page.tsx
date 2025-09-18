import About from "@/components/layout/About";
import Contact from "@/components/layout/Contact";
import Education from "@/components/layout/Education";
import Projects from "@/components/layout/Projects";
import WorkHistory from "@/components/layout/WorkHistory";

export default function Home() {
  return (
    <main>
      <About />
      <WorkHistory />
      <Projects />
      <Education />
      <Contact />
    </main>
  );
}
