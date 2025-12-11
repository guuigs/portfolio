const FILMS = [
  { title: "Lalaland - Damien Chazelle" },
  { title: "Porco Rosso - Hayao Miyazaki" },
  { title: "Cowboy Bebop - Ikuro Sato" },
  { title: "Babylon - Damien Chazelle" },
  { title: "The Grand Budapest Hotel - Wes Anderson" },
  { title: "Pulp Fiction - Quentin Tarantino" },
];

function FilmCard({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-[10px] items-start w-full">
      <div className="bg-[#1823ee] aspect-[2/3] w-full" />
      <p className="font-serif italic leading-[20px] text-[20px] text-black w-full">{title}</p>
    </div>
  );
}

export default function Cinema() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[40px] gap-y-[60px]">
      {FILMS.map((film, i) => (
        <FilmCard key={i} title={film.title} />
      ))}
    </div>
  );
}