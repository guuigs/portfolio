import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { cn } from "../../lib/utils";
import { Footer } from "../layout/Footer";

// Import des images - Littérature
import imgNotreDame from "@/assets/images/likes/Notre dame de paris.jpg";
import imgPiliers from "@/assets/images/likes/Les piliers de la terre.jpg";
import imgSorceleur from "@/assets/images/likes/le sorceleur.jpg";
import imgBelAmi from "@/assets/images/likes/bel ami.jpg";
import imgMoonfleet from "@/assets/images/likes/moonfleet.jpg";
import imgSeigneur from "@/assets/images/likes/le seigneur des anneaux.jpg";

// Import des images - Bande dessinée / Manga
import imgOnePiece from "@/assets/images/likes/one piece.jpg";
import imgRevolution from "@/assets/images/likes/révolution.jpg";
import imgAsterix from "@/assets/images/likes/astérix le gaulois.jpg";
import imgKingdom from "@/assets/images/likes/kingdom.jpg";
import imgMaitres from "@/assets/images/likes/les maitres de l'orge.jpg";
import imgHorde from "@/assets/images/likes/la horde de contrevent.jpg";

// Import des images - Cinéma
import imgLaLaLand from "@/assets/images/likes/la la land.jpg";
import imgPorco from "@/assets/images/likes/porco rosso.jpg";
import imgBabylon from "@/assets/images/likes/babylon.jpg";
import imgCowboy from "@/assets/images/likes/cowboy bebop.jpg";
import imgBudapest from "@/assets/images/likes/the grand budapest hotel.jpg";
import imgPulp from "@/assets/images/likes/pulp fiction.jpg";

// Import des images - Musique
import imgSoleilPluvieux from "@/assets/images/likes/soleil pluvieux.jpg";
import imgAllLights from "@/assets/images/likes/all of the lights.jpg";
import imgIWillSurvive from "@/assets/images/likes/i will survive.jpg";
import img20000 from "@/assets/images/likes/20.000.jpg";
import imgWakeMeUp from "@/assets/images/likes/wake me up.jpg";
import imgPairWings from "@/assets/images/likes/pair of wings.jpg";
import imgHistoireEtrange from "@/assets/images/likes/Une histoire étrange.jpg";
import imgSoleilVie from "@/assets/images/likes/Soleil de ma vie.jpg";

const CATEGORIES = [
  { id: "literature", label: "Littérature" },
  { id: "manga", label: "Bande dessinée / manga" },
  { id: "cinema", label: "Cinéma" },
  { id: "music", label: "Musique" },
];

const BOOKS = [
  {
    title: "Notre-Dame de Paris - Victor Hugo",
    img: imgNotreDame,
    link: "https://www.amazon.fr/NOTRE-DAME-PARIS-VERSION-ABREGEE-Victor/dp/2070663892"
  },
  {
    title: "Les piliers de la terre - Ken Follett",
    img: imgPiliers,
    link: "https://www.amazon.fr/Piliers-Terre-Ken-Follett/dp/2253059536"
  },
  {
    title: "Le sorceleur - Andrzej Sapkowski",
    img: imgSorceleur,
    link: "https://www.amazon.fr/Sorceleur-Livre-dernier-livre-providence/dp/2298151911"
  },
  {
    title: "Bel-Ami - Guy De Maupassant",
    img: imgBelAmi,
    link: "https://www.amazon.fr/Bel-Ami-Guy-Maupassant/dp/207040935X"
  },
  {
    title: "Moonfleet - John Meade Falkner",
    img: imgMoonfleet,
    link: "https://www.amazon.fr/Moonfleet-John-Meade-Falkner/dp/2369147334"
  },
  {
    title: "Le seigneur des anneaux - J. R. R. Tolkien",
    img: imgSeigneur,
    link: "https://www.amazon.fr/Seigneur-Anneaux-%C3%A9dition-illustr%C3%A9e-Fraternit%C3%A9/dp/226705485X"
  },
];

const MANGAS = [
  {
    title: "One piece - Eiichiro Oda",
    img: imgOnePiece,
    link: "https://www.amazon.fr/One-Piece-originale-Eiichiro-Oda/dp/2344065660"
  },
  {
    title: "Révolution - Florent Grouazel",
    img: imgRevolution,
    link: "https://www.amazon.fr/R%C3%A9volution-1-Libert%C3%A9-Florent-Grouazel/dp/233011737X"
  },
  {
    title: "Astérix le gaulois - René Goscinny",
    img: imgAsterix,
    link: "https://www.amazon.fr/Ast%C3%A9rix-gaulois-n%C2%B01-Ren%C3%A9-Goscinny/dp/201210133X"
  },
  {
    title: "Kingdom - Yasuhisa Hara",
    img: imgKingdom,
    link: "https://www.amazon.fr/Kingdom-1-Fran%C3%A7ais-Yasuhisa-Hara/dp/2368778055"
  },
  {
    title: "Les maîtres de l'orge - Charles 1854",
    img: imgMaitres,
    link: "https://www.amazon.fr/Ma%C3%AEtres-lorge-01-Charles-1854/dp/234400453X"
  },
  {
    title: "La horde de contrevent - Alain Damasio",
    img: imgHorde,
    link: "https://www.amazon.fr/Horde-Contrevent-T01-cosmos-campement/dp/2756067261"
  },
];

const MOVIES = [
  {
    title: "La La Land - Damien Chazelle",
    img: imgLaLaLand,
    link: "https://letterboxd.com/film/la-la-land/"
  },
  {
    title: "Porco Rosso - Hayao Miyazaki",
    img: imgPorco,
    link: "https://letterboxd.com/film/porco-rosso/"
  },
  {
    title: "Babylon - Damien Chazelle",
    img: imgBabylon,
    link: "https://letterboxd.com/film/babylon-2022/"
  },
  {
    title: "Cowboy Bebop - Shinichirō Watanabe",
    img: imgCowboy,
    link: "https://letterboxd.com/film/cowboy-bebop/"
  },
  {
    title: "The Grand Budapest Hotel - Wes Anderson",
    img: imgBudapest,
    link: "https://letterboxd.com/film/the-grand-budapest-hotel/"
  },
  {
    title: "Pulp Fiction - Quentin Tarantino",
    img: imgPulp,
    link: "https://letterboxd.com/film/pulp-fiction/"
  },
];

const MUSIC = [
  {
    title: "Soleil Pluvieux - Soso Maness",
    img: imgSoleilPluvieux,
    link: "https://link.deezer.com/s/31QSjEd1nchhywfUDzaFs"
  },
  {
    title: "All of the Lights - Kanye West",
    img: imgAllLights,
    link: "https://link.deezer.com/s/31QSiQiC1lKD0bJ5E6chJ"
  },
  {
    title: "I will survive - Gloria Gaynor",
    img: imgIWillSurvive,
    link: "https://link.deezer.com/s/31QSht5ukDwlikFrkyfzM"
  },
  {
    title: "20.000 - Soprano",
    img: img20000,
    link: "https://link.deezer.com/s/31QSg1lIgwIwnzT0IYsN7"
  },
  {
    title: "Wake me up - Avicii",
    img: imgWakeMeUp,
    link: "https://link.deezer.com/s/31QSgqKH6R2X4fnAPKnY4"
  },
  {
    title: "Pair of wings - Frankie Stew and Harvey Gunn",
    img: imgPairWings,
    link: "https://link.deezer.com/s/31QSitu594i1usLuHCw2F"
  },
  {
    title: "Une histoire étrange - Columbine",
    img: imgHistoireEtrange,
    link: "https://link.deezer.com/s/31QSf0hoEcltTt0SN8vCS"
  },
  {
    title: "Soleil de ma vie - IAM",
    img: imgSoleilVie,
    link: "https://link.deezer.com/s/31QSenS9oQVE1er3ZUjCT"
  },
];

export function Likes() {
  const [activeCategory, setActiveCategory] = useState("literature");

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
           <div className="absolute inset-0 overflow-hidden">
             <div
               key={activeCategory}
               className="w-full h-full overflow-y-auto px-6 md:px-[100px] no-scrollbar pb-6"
             >
               {activeCategory === "literature" && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[40px] gap-y-[60px] pb-20">
                   {BOOKS.map((book, i) => (
                     <ProjectCard
                       key={i}
                       title={book.title}
                       imageUrl={book.img}
                       link={book.link}
                     />
                   ))}
                 </div>
               )}
               {activeCategory === "manga" && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[40px] gap-y-[60px] pb-20">
                   {MANGAS.map((manga, i) => (
                     <ProjectCard
                       key={i}
                       title={manga.title}
                       imageUrl={manga.img}
                       link={manga.link}
                     />
                   ))}
                 </div>
               )}
               {activeCategory === "cinema" && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[40px] gap-y-[60px] pb-20">
                   {MOVIES.map((movie, i) => (
                     <ProjectCard
                       key={i}
                       title={movie.title}
                       imageUrl={movie.img}
                       link={movie.link}
                     />
                   ))}
                 </div>
               )}
               {activeCategory === "music" && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[40px] gap-y-[60px] pb-20">
                   {MUSIC.map((song, i) => (
                     <ProjectCard
                       key={i}
                       title={song.title}
                       imageUrl={song.img}
                       link={song.link}
                       aspectRatio="1/1"
                     />
                   ))}
                 </div>
               )}
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
