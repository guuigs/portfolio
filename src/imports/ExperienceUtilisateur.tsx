function Frame() {
  return <div className="bg-[#1823ee] h-[400px] shrink-0 w-full" />;
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Frame />
      <p className="font-serif italic leading-[20px] relative shrink-0 text-[20px] text-black w-full">Mémoire - extraits de mon questionnaire de début de recherche M2 concernant les attentes des utilisateurs</p>
    </div>
  );
}

function Frame1() {
  return <div className="bg-[#1823ee] h-[400px] shrink-0 w-full" />;
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Frame1 />
      <p className="font-serif italic leading-[20px] relative shrink-0 text-[20px] text-black w-full">Wakey - Screenshots de mon application mobile</p>
    </div>
  );
}

export default function ExperienceUtilisateur() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start relative size-full" data-name="Expérience utilisateur">
      <p className="font-sans leading-[normal] relative shrink-0 text-[20px] text-black w-full">
        J'ai pu constaté par mes études et par mes expériences professionnelles d'a quel point l'étude du fonctionnement et du comportement de l'utilisateur est crucial au succès d'un produit et que paradoxalement il n'est jamais ou très peu utilisé dans le monde professionnel.
      </p>
      <p className="font-sans leading-[normal] relative shrink-0 text-[20px] text-black w-full">{`Je m'efforce donc à travers mes différents projets de toujours réfléchir au comportement potentiel de l'utilisateur final, cela se fait également par des tests, des interviews, des études. `}</p>
      <p className="font-sans leading-[normal] relative shrink-0 text-[20px] text-black w-full">
        L'exemple le plus flagrant de mon attachement à cette méthode et surement mon mémoire en cours de rédaction dans lequel je m'attache à identifier les points de frictions liés aux audioguides de musée et de proposer une solution innovante et pertinente.
      </p>
      <Frame2 />
      <p className="font-serif leading-[normal] relative shrink-0 text-[20px] text-black w-full">Mémoire DIMI - Partie 1</p>
      <p className="font-serif leading-[normal] relative shrink-0 text-[20px] text-black w-full">Mémoire DIMI - Version finale (en cours de rédaction)</p>
      <p className="font-sans leading-[normal] relative shrink-0 text-[20px] text-black w-full">
        Cette attache pour l'importance de l'expérience utilisateur se reflète également dans un projet personnel Wakey : une application agrégateur par IA de l'actualité.
      </p>
      <Frame3 />
    </div>
  );
}
