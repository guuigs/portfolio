interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`flex justify-between items-end w-full px-6 py-[20px] md:px-[100px] ${className}`}>
      {/* Left: CV */}
      <div className="flex items-center gap-5 group cursor-pointer">
        <span className="text-primary-blue text-[20px] font-sans">mon cv</span>
        <div className="w-[60px] h-[2px] bg-primary-blue transition-all group-hover:w-[80px]" />
      </div>

      {/* Right: Socials */}
      <div className="flex items-center gap-5">
        <a href="#" className="text-primary-blue text-[20px] font-sans hover:opacity-70 transition-opacity">linkedin</a>
        <a href="#" className="text-primary-blue text-[20px] font-sans hover:opacity-70 transition-opacity">mail</a>
      </div>
    </footer>
  );
}