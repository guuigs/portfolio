const SONGS = [
  { title: "Soleil pluvieux - Yvnnis" },
  { title: "All of the lights - Kanye West" },
  { title: "Une histoire étrange - Laylow" },
  { title: "20.000 - Edge & Alpha Wann" },
  { title: "Pair of wings - Frankie Rose" },
  { title: "Wake me up - The Weekend & Justice" },
  { title: "Soleil de ma vie - Zamdame" },
  { title: "I will survive - Gloria Gaynor" },
];

function SongCard({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-[10px] items-start w-full">
      <div className="bg-[#1823ee] aspect-square w-full" />
      <p className="font-serif italic leading-[20px] text-[20px] text-black w-full">{title}</p>
    </div>
  );
}

export default function Musique() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[40px] gap-y-[60px]">
      {SONGS.map((song, i) => (
        <SongCard key={i} title={song.title} />
      ))}
    </div>
  );
}