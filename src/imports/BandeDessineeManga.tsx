const BOOKS = [
  { title: "One Piece - Eiichirō Oda" },
  { title: "Révolution - Florent Grouazel, Younn Locard" },
  { title: "Asterix et Obélix - René Goscinny, Albert Uderzo" },
  { title: "Kingdom - Yasuhisa Hara" },
  { title: "Les maitres de l'orge - Jean Van Hamme, Francis Vallès" },
  { title: "La horde du contrevent - Éric Henninot" },
];

function BookCard({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-[10px] items-start w-full">
      <div className="bg-[#1823ee] aspect-[2/3] w-full" />
      <p className="font-serif italic leading-[20px] text-[20px] text-black w-full">{title}</p>
    </div>
  );
}

export default function BandeDessineeManga() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[40px] gap-y-[60px]">
      {BOOKS.map((book, i) => (
        <BookCard key={i} title={book.title} />
      ))}
    </div>
  );
}