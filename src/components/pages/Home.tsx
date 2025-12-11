import imgHomePage from "@/assets/images/home-image.png";
import { Footer } from "../layout/Footer";

export function Home() {
  return (
    <div className="w-full h-screen flex flex-col">
      {/* Main content - starts below header */}
      <div className="flex-1 flex flex-col justify-end items-center pb-[80px] md:pb-[100px] pt-[120px] md:pt-[140px]">
        {/* Title positioned above image */}
        <h1 className="font-serif text-[56px] md:text-[84px] leading-tight text-black text-center mb-[-50px] md:mb-[-100px]">
          Test
        </h1>
        
        {/* Image */}
        <div className="relative w-full max-w-[400px] md:max-w-[600px] h-[400px] md:h-[600px]">
          <img 
            src={imgHomePage} 
            alt="Home" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Footer - positioned at bottom with z-index */}
      <div className="fixed bottom-0 left-0 right-0 z-[1] bg-transparent pointer-events-auto">
        <Footer />
      </div>
    </div>
  );
}