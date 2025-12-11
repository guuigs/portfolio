function Frame() {
  return <div className="bg-[#1823ee] h-[400px] shrink-0 w-full" />;
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Frame />
      <p className="font-serif italic leading-[20px] relative shrink-0 text-[20px] text-black w-full">C2RMF - Gestion technique et éditoriale du site vitrine du centre</p>
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
      <p className="font-serif italic leading-[20px] relative shrink-0 text-[20px] text-black w-full">Inrap - Accompagnement sur les refontes de 3 sites de l'Inrap</p>
    </div>
  );
}

function Frame5() {
  return <div className="bg-[#1823ee] h-[400px] shrink-0 w-full" />;
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Frame5 />
      <p className="font-serif italic leading-[20px] relative shrink-0 text-[20px] text-black w-full">Inrap - Direction et gestion du projet Megalithe à l'occasion du bicentenaire de la photographie</p>
    </div>
  );
}

export default function GestionDeProjets() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start relative size-full" data-name="Gestion de projets">
      <p className="font-sans leading-[normal] relative shrink-0 text-[20px] text-black w-full">
        J'ai eu l'occasion de mettre à profit cette compétence et de la développer au cours de mes 3 années d'alternance (actuellement dans la troisième). J'ai travaillé respectivement pour le Centre de Recherche et de Restauration des Musées de France (C2RMF) et pour l'Institut national de recherches en archéologie préventive (Inrap).
      </p>
      <div className="font-sans leading-[0] relative shrink-0 text-[20px] text-black w-full">
        <p className="leading-[normal] mb-0">{`Mes actions au C2RMF : `}</p>
        <ul className="list-disc">
          <li className="mb-0 ms-[30px]">
            <span className="leading-[normal]">Augmentation du trafic web de plus de 100% en 2 ans.</span>
          </li>
          <li className="mb-0 ms-[30px] whitespace-pre-wrap">
            <span className="leading-[normal]">
              {`Optimisation des processus de création des contenus sur le site web, en lien avec les différents départements du centre afin d'augmenter la  fréquence de publication.`}
              <br aria-hidden="true" />
              Analyse du trafic et du comportement des utilisateurs afin de modifier l'arborescence du site internet.
            </span>
          </li>
          <li className="mb-0 ms-[30px]">
            <span className="leading-[normal]">Optimisation du référencement et de l'accessibilité des pages.</span>
          </li>
          <li className="ms-[30px] whitespace-pre-wrap">
            <span className="leading-[normal]">{`Echanges et participation aux différents ateliers visant à améliorer le CMS (sur Drupal) avec l'institution responsable du site et le  prestataire privé.`}</span>
          </li>
        </ul>
      </div>
      <Frame2 />
      <div className="font-sans leading-[0] relative shrink-0 text-[20px] text-black w-full">
        <p className="leading-[normal] mb-0">{`Mes actions à l'Inrap : `}</p>
        <ul className="list-disc">
          <li className="mb-0 ms-[30px]">
            <span className="leading-[normal]">Suivi de la refonte du site portail : accompagnement et conseil auprès de la direction et du prestataire, participation aux ateliers et au backend du site.</span>
          </li>
          <li className="mb-0 ms-[30px]">
            <span className="leading-[normal]">Suivi de la refonte de l'iconothèque : accompagnement et conseil auprès de la direction et du prestataire, participation aux ateliers et au backend du site.</span>
          </li>
          <li className="ms-[30px]">
            <span className="leading-[normal]">Chargé de projet sur la participation de l'Inrap au bicentenaire de la photographie.</span>
          </li>
        </ul>
      </div>
      <Frame3 />
      <Frame4 />
    </div>
  );
}
