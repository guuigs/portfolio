function Frame() {
  return <div className="bg-[#1823ee] h-[400px] shrink-0 w-full" />;
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Frame />
      <p className="font-serif italic leading-[20px] relative shrink-0 text-[20px] text-black w-full">Wakey - Développement et publication d'une application mobile (Perplexity API, Supabase, Expo, React, Cursor)</p>
    </div>
  );
}

function Frame1() {
  return <div className="bg-[#1823ee] h-[400px] shrink-0 w-full" />;
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Frame1 />
      <p className="font-serif italic leading-[20px] relative shrink-0 text-[20px] text-black w-full">Artsing - Développement d'une page web (html, css, js)</p>
    </div>
  );
}

export default function DeveloppementWeb() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start relative size-full" data-name="Développement web">
      <p className="font-sans leading-[normal] relative shrink-0 text-[20px] text-black w-full">
        Avec mes études et mes projets, j'ai vite constaté la nécessité de comprendre les bases du code et du fonctionnement de nos systèmes numériques. Profitant d'un trou dans mon calendrier, en attente de mon départ en Erasmus, je me suis mis à apprendre les base du front.
      </p>
      <p className="font-sans leading-[normal] relative shrink-0 text-[20px] text-black w-full">{`Avec l'avènement des outils IA d'aide au code, j'ai pu réalisé quelques projets, dont Artsing et Wakey. `}</p>
      <Frame3 />
      <p className="font-sans leading-[normal] relative shrink-0 text-[20px] text-black w-full">
        Pour Wakey, réalisé en août 2024 et qui est mon projet le plus abouti, j'ai voulu apprendre à travailler avec les api d'IA. J'ai donc appris le react, le fonctionnement de Git et Github et réalisé mon projet avec une stack complète : Perplexity API, Supabase, Expo pour react sur mobile, Cursor comme IDE, et IOS pour la publication.
      </p>
      <Frame2 />
      <p className="font-serif leading-[normal] relative shrink-0 text-[20px] text-black w-full">Visitez vous même le site Artsing</p>
    </div>
  );
}
