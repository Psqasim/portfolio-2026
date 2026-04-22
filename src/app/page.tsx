import { Hero } from "@/components/sections/Hero";
import { Systems } from "@/components/sections/Systems";
import { TechStack } from "@/components/sections/TechStack";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Systems />
      <TechStack />
      <About />
      <Contact />
    </main>
  );
}
