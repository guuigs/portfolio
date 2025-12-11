import { useState } from "react";
import { Header } from "./components/layout/Header";
import { TransitionOverlay } from "./components/layout/TransitionOverlay";
import { Home } from "./components/pages/Home";
import { Experiences } from "./components/pages/Experiences";
import { Likes } from "./components/pages/Likes";
import { Mentality } from "./components/pages/Mentality";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [targetPage, setTargetPage] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNavigate = (page: string) => {
    if (page === currentPage || isTransitioning) return;
    setTargetPage(page);
    setIsTransitioning(true);
  };

  const handleCovered = () => {
    if (targetPage) {
      setCurrentPage(targetPage);
      setTargetPage(null);
      // Wait a small moment or immediately trigger exit
      // To ensure React renders the new page behind the curtain before lifting it
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }
  };

  return (
    <div className="relative w-full min-h-screen font-sans bg-white selection:bg-primary-blue selection:text-white">
      <Header activePage={currentPage} onNavigate={handleNavigate} />
      
      <TransitionOverlay isVisible={isTransitioning} onCovered={handleCovered} />

      <main className="w-full h-full">
        {currentPage === "home" && <Home />}
        {currentPage === "experiences" && <Experiences />}
        {currentPage === "likes" && <Likes />}
        {currentPage === "mentality" && <Mentality />}
      </main>
    </div>
  );
}
