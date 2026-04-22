import { Hero } from "@/components/sections/Hero";
import { Systems } from "@/components/sections/Systems";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      {/* TODO: US4 — Preloader mounted in T064 */}
      {/* TODO: US2 — Navbar mounted in T049 */}

      <main>
        <Hero />
        <Systems />

        {/* TODO: US3 — <Skills /> mounted in T056 */}
        <section id="skills" className="min-h-[30vh]" aria-label="Skills (coming)" />

        {/* TODO: US3 — <About /> mounted in T060 */}
        <section id="about" className="min-h-[30vh]" aria-label="About (coming)" />

        <Contact />

        {/* TODO: US4 — <Footer /> mounted in T069 */}
      </main>
    </>
  );
}
