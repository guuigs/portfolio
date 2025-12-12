import { ProjectCard } from "../components/pages/ProjectCard";
import imgWakey from "@/assets/images/Experiences/Developpement web/Wakey.png";
import imgArtsing from "@/assets/images/Experiences/Developpement web/Artsing.png";

export default function DeveloppementWeb() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start relative size-full" data-name="Développement web">
      <p className="font-sans leading-[normal] relative shrink-0 text-[20px] text-black w-full">
        Avec mes études et mes projets, j'ai vite constaté la nécessité de comprendre les bases du code et du fonctionnement de nos systèmes numériques. Profitant d'un trou dans mon calendrier, en attente de mon départ en Erasmus, je me suis mis à apprendre les base du front.
      </p>
      <p className="font-sans leading-[normal] relative shrink-0 text-[20px] text-black w-full">{`Avec l'avènement des outils IA d'aide au code, j'ai pu réalisé quelques projets, dont Artsing et Wakey. `}</p>
      <div className="w-full max-w-[600px]">
        <ProjectCard
          title="Wakey - Développement et publication d'une application mobile (Perplexity API, Supabase, Expo, React, Cursor)"
          imageUrl={imgWakey}
          aspectRatio="auto"
        />
      </div>
      <p className="font-sans leading-[normal] relative shrink-0 text-[20px] text-black w-full">
        Pour Wakey, réalisé en août 2024 et qui est mon projet le plus abouti, j'ai voulu apprendre à travailler avec les api d'IA. J'ai donc appris le react, le fonctionnement de Git et Github et réalisé mon projet avec une stack complète : Perplexity API, Supabase, Expo pour react sur mobile, Cursor comme IDE, et IOS pour la publication.
      </p>
      <div className="w-full max-w-[600px]">
        <ProjectCard
          title="Artsing - Développement d'une page web (html, css, js)"
          imageUrl={imgArtsing}
          link="https://guilhemterrier.fr/artsing/index.html"
          aspectRatio="auto"
        />
      </div>
      <a
        href="https://guilhemterrier.fr/artsing/index.html"
        target="_blank"
        rel="noopener noreferrer"
        className="font-serif leading-[normal] relative shrink-0 text-[20px] text-black underline hover:text-primary-blue transition-colors w-full"
      >
        Visitez vous même le site Artsing
      </a>
    </div>
  );
}
