// pages/index.tsx
import Carousel from "@/components/Carousel";
import MultiLayerParallax from "@/components/MultiLayerParallax";
import SageIntroSection from "../components/SageChat";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={`${inter.className} flex flex-col items-center overflow-x-hidden`}>
      {/* Section 1: Parallax */}
      <section className="w-full h-screen">
        <MultiLayerParallax />
      </section>

      {/* Section 2: Carousel */}
      <section className="w-full h-screen">
        <Carousel />
      </section>

      {/* Section 3: Sage + Chat */}
      <section className="w-full h-screen">
        <SageIntroSection />
      </section>
    </main>
  );
}