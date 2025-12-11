import { Footer } from "../layout/Footer";

export function Mentality() {
  return (
    <div className="w-full h-screen flex flex-col">
      {/* Main content - starts below header, scrollable */}
      <div className="flex-1 overflow-y-auto px-6 md:px-[100px] pt-[120px] md:pt-[140px]">
        <h1 className="font-serif text-[60px] md:text-[120px] leading-[100px] text-black mb-[60px] md:mb-[100px]">
          Créer et être heureux
        </h1>

        {/* First section with text and image */}
        <div className="flex flex-col md:flex-row gap-[40px] md:gap-[100px] items-start mb-[60px] md:mb-[100px]">
          <div className="font-sans text-[18px] md:text-[20px] leading-normal text-black max-w-full md:w-[840px] space-y-6">
            <p>
              Il peux sembler bien prétentieux de tirer seulement dans sa vingtaine de grandes conclusions sur la vie et sur ma carrière. Je ne vous ferais pas cet affront. Je pense cependant pouvoir déjà initier une refléction sur le chemin que je veux donner à ma vie.
            </p>
            <p>
              "Créer et être heureux", voila donc les deux élements qui semblent aujourd'hui former l'objectif que je souhaite atteindre. Reprenant le texte de Baden Powell à ses scouts, il indique qu'il n'y a de sens à la vie que de jouir de celle-ci. Je souhaite donc me construire une vie qui tend vers la création de ma joie et de mon bonheur, et je pense qu'une bonne partie de cet objectif peut être atteint par la création.
            </p>
            <p>
              La création aujourd'hui porte bien des difficultés, menacé par l'intelligence artificielle, par la concurrence, la chute des prix et la mondialisation qui menace l'artisanat. Je suis porté et inspiré par William Morris, porteur du mouvement Arts and Crafts, qui prone le retour du beau et de l'utile dans nos foyers. C'est bien cette idée que je porte tout au long de mon parcours de création : réaliser un produit utile et beau, au service de la communanuté.
            </p>
          </div>
          <div className="bg-[#d9d9d9] h-[250px] md:h-[350px] w-full md:w-[300px] shrink-0" />
        </div>

        {/* William Morris quote */}
        <div className="flex flex-col gap-[20px] md:gap-[30px] mb-[60px] md:mb-[100px] max-w-full">
          <p className="font-serif italic text-[36px] md:text-[60px] leading-[1.2] text-black">
            "N'aie rien chez toi que tu ne saches utile ou que tu croies beau."
          </p>
          <p className="font-serif text-[24px] md:text-[30px] text-black">
            William Morris
          </p>
        </div>

        {/* Second section with image and text */}
        <div className="flex flex-col md:flex-row gap-[40px] md:gap-[100px] items-start mb-[60px] md:mb-[100px]">
          <div className="bg-[#d9d9d9] h-[250px] md:h-[326px] w-full md:w-[300px] shrink-0" />
          <div className="font-sans text-[18px] md:text-[20px] leading-normal text-black max-w-full md:w-[839px] space-y-6">
            <p>
              En parallèle de cette philosophie, je me conforte aussi à l'idée que le capitalisme moderne entraine une accumulation des pouvoirs. Cette accumulation est porté par une centralisation des médias, mais encore et surtout par nos données.
            </p>
            <p>
              Je suis intimement convaincus que la population ne se rend pas compte du pouvoir de leurs données et de ce qu'elles permettent de faire dans une société de contrôle. Je travail donc à titre personnel à un usage réfléchi des plateformes, des modes de fonctionnement, de mon workflow, etc.
            </p>
            <p>
              Il est bien sûr évident qu'il faut faire un travail sur soi et être vigilant à ne pas tomber dans un complotisme malsain et stupide. Nos dirigeants sont bien aussi stupides que nous, mais la machine qu'ils alimentent risque bien de poser problème dans les années à venir.
            </p>
            <p>
              Pas d'alarmisme, de la prévention, de la responsabilité et du contrôle de ses propres biens.
            </p>
          </div>
        </div>

        {/* Baden Powell quote */}
        <div className="flex flex-col gap-[20px] md:gap-[30px] mb-[120px] max-w-full">
          <p className="font-serif italic text-[36px] md:text-[60px] leading-[1.2] text-black">
            "Je crois que Dieu nous a placés dans ce monde pour y être heureux et pour y jouir de la vie."
          </p>
          <p className="font-serif text-[24px] md:text-[30px] text-black">
            Baden Powell
          </p>
        </div>
      </div>

      {/* Footer - positioned at bottom with z-index */}
      <div className="fixed bottom-0 left-0 right-0 z-[1] bg-transparent pointer-events-auto">
        <Footer />
      </div>
    </div>
  );
}