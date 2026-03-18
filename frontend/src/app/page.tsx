import HeroFrameAnimation from "@/components/home/HeroFrameAnimation";
import DarkMarquee from "@/components/home/dark/DarkMarquee";
import DarkCategories from "@/components/home/dark/DarkCategories";
import DarkFeatured from "@/components/home/dark/DarkFeatured";
import DarkLookbook from "@/components/home/dark/DarkLookbook";
import DarkManifesto from "@/components/home/dark/DarkManifesto";
import DarkNewsletter from "@/components/home/dark/DarkNewsletter";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
      {/* 1. Hero: 180-frame scroll sequence */}
      <HeroFrameAnimation />

      {/* 2. Marquee separator */}
      <DarkMarquee />

      {/* 3. Shop by Category */}
      <DarkCategories />

      {/* 4. Brand Manifesto */}
      <DarkManifesto />

      {/* 5. Trending Products */}
      <DarkFeatured />

      {/* 6. Editorial Lookbook */}
      <DarkLookbook />

      {/* 7. Newsletter */}
      <DarkNewsletter />
    </div>
  );
}
