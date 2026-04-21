export default function HomePage() {
  return (
    <>
      {/* TODO: US4 — Preloader mounted in T064 */}
      {/* TODO: US2 — Navbar mounted in T049 */}

      <main>
        {/* TODO: US1 — <Hero /> mounted in T041 */}
        <section id="home" className="min-h-[50vh] flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Muhammad Qasim</h1>
            <p className="mt-2 text-lg opacity-70">Agentic AI Engineer</p>
          </div>
        </section>

        {/* TODO: US1 — <Systems /> mounted in T041 */}
        <section id="systems" className="min-h-[30vh]" aria-label="Systems (coming)" />

        {/* TODO: US3 — <Skills /> mounted in T056 */}
        <section id="skills" className="min-h-[30vh]" aria-label="Skills (coming)" />

        {/* TODO: US3 — <About /> mounted in T060 */}
        <section id="about" className="min-h-[30vh]" aria-label="About (coming)" />

        {/* TODO: US2 — <Contact /> mounted in T049 */}
        <section id="contact" className="min-h-[30vh]" aria-label="Contact (coming)" />

        {/* TODO: US4 — <Footer /> mounted in T069 */}
      </main>
    </>
  );
}
