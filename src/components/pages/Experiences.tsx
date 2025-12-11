import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { cn } from "../../lib/utils";
import { Footer } from "../layout/Footer";
import ExperienceUtilisateur from "../../imports/ExperienceUtilisateur";
import DeveloppementWeb from "../../imports/DeveloppementWeb";
import GestionDeProjets from "../../imports/GestionDeProjets";

const CATEGORIES = [
  { id: "design", label: "Design graphique" },
  { id: "ux", label: "Expérience utilisateur" },
  { id: "web", label: "Développement web" },
  { id: "project", label: "Gestion de projets" },
];

const CONTENT = {
  design: (
    <div className="flex flex-col gap-[40px] pb-20">
      <div className="space-y-6 text-[20px] font-sans text-black max-w-[600px]">
        <p>
          J'ai forgé mon expérience dans le design graphique à travers de multiples facettes de ma vie professionnelle, veille personnelle, freelance, projets annexes.
        </p>
        <p>
          Pour moi, le design graphique doit être pensé avant tout avec l'idée du message que l'on veux fournir dans notre visuel et de savoir à qui on le fournit. La compréhension de l'autre et l'empathie sont clés.
        </p>
      </div>
      
      <div className="space-y-12 w-full max-w-[600px]">
        <ProjectCard 
          title="Elapsio - création d'un branding l'entreprise Elapsio" 
          imageUrl="https://images.unsplash.com/photo-1759229874914-c1ffdb3ebd0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        />
        <ProjectCard 
          title="Elapsio - création de packagings pour leur produit phare : le kit alimentaire de randonnée" 
          imageUrl="https://images.unsplash.com/photo-1720762224315-439072aa22c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        />
        <ProjectCard 
          title="LKL - création d'un branding pour la league esport amateur LKL" 
           imageUrl="https://images.unsplash.com/photo-1759229874914-c1ffdb3ebd0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        />
        <ProjectCard 
          title="Artsing - création d'un branding et d'une page web avec usage de l'intelligence artificielle à ses balbutiements." 
           imageUrl="https://images.unsplash.com/photo-1720762224315-439072aa22c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        />
      </div>
    </div>
  ),
  ux: (
    <div className="flex flex-col gap-[40px] pb-20">
      <ExperienceUtilisateur />
    </div>
  ),
  web: (
    <div className="flex flex-col gap-[40px] pb-20">
      <DeveloppementWeb />
    </div>
  ),
  project: (
    <div className="flex flex-col gap-[40px] pb-20">
      <GestionDeProjets />
    </div>
  ),
};

export function Experiences() {
  const [activeCategory, setActiveCategory] = useState("design");

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Main content - starts below header, takes remaining height */}
      <div className="flex-1 flex flex-col md:flex-row w-full overflow-hidden pt-[120px] md:pt-[140px]">
        
        {/* Left Column: Navigation */}
        <div className="w-full md:w-1/2 flex flex-col items-start px-6 md:pl-[100px] md:pr-10 py-10 md:py-0 md:justify-center">
          <div className="flex flex-col gap-3 md:gap-[40px] items-start">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "font-serif text-[20px] md:text-[40px] leading-tight text-left transition-colors duration-300",
                  activeCategory === cat.id ? "text-primary-blue" : "text-black hover:text-black/60"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Scrollable Content */}
        <div className="w-full md:w-1/2 h-full relative">
           {/* Clip content container */}
           <div className="absolute inset-0 overflow-hidden">
             {/* Scrollable area */}
             <div 
               key={activeCategory} // Force reset scroll on change
               className="w-full h-full overflow-y-auto px-6 md:px-[100px] no-scrollbar pb-6"
             >
               {CONTENT[activeCategory as keyof typeof CONTENT]}
             </div>
           </div>
        </div>
      </div>
      
      {/* Footer - positioned at bottom with z-index */}
      <div className="fixed bottom-0 left-0 right-0 z-[1] bg-transparent pointer-events-auto">
        <Footer />
      </div>
    </div>
  );
}