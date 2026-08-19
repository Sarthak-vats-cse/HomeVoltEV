import Navbar from "@/components/navbar";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <Navbar />
      <Hero />
    </main>
  );
}