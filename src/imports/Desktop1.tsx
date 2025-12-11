import svgPaths from "./svg-fx9airdihp";
import imgAdobeExpressFile1 from "@/assets/images/home-image.png";

function Image() {
  return (
    <div className="absolute contents left-[344px] top-[273px]" data-name="Image">
      <div className="absolute left-[344px] size-[751px] top-[273px]" data-name="Adobe Express - file 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgAdobeExpressFile1} />
      </div>
      <div className="absolute h-[135.099px] left-[calc(25%+58.5px)] top-[661.9px] w-[121.092px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 122 136">
          <path d={svgPaths.p392ac500} fill="var(--fill-0, white)" id="Vector 1" />
        </svg>
      </div>
    </div>
  );
}

function Fond() {
  return (
    <div className="absolute contents left-1/2 top-[234px] translate-x-[-50%]" data-name="Fond">
      <p className="absolute font-['Crimson_Text:Regular',sans-serif] leading-[100px] left-1/2 not-italic text-[120px] text-black text-center top-[234px] translate-x-[-50%] w-[1060px]">Test</p>
      <Image />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[20px] items-center relative shrink-0">
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[100px] relative shrink-0 text-[#1823ee] text-[20px] text-center text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        mon cv
      </p>
      <div className="h-0 relative shrink-0 w-[60px]">
        <div className="absolute bottom-0 left-0 right-0 top-[-2px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60 2">
            <line id="Line 1" stroke="var(--stroke-0, #1823EE)" strokeWidth="2" x2="60" y1="1" y2="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex font-['SF_Pro:Regular',sans-serif] font-normal gap-[20px] items-center leading-[100px] relative shrink-0 text-[#1823ee] text-[20px] text-center text-nowrap whitespace-pre">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        linkedin
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        mail
      </p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[100px] top-[913px] w-[1240px]">
      <Frame2 />
      <Frame1 />
    </div>
  );
}

function Group() {
  return (
    <div className="[grid-area:1_/_1] h-[16.177px] ml-0 mt-[23.82px] relative w-[41.331px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 17">
        <g id="Group 4">
          <path clipRule="evenodd" d={svgPaths.p26db3600} fill="var(--fill-0, #1823EE)" fillRule="evenodd" id="Subtract" />
          <ellipse cx="30.0513" cy="7.16815" fill="var(--fill-0, #1823EE)" id="Ellipse 2" rx="2.54079" ry="1.94296" transform="rotate(-11.0047 30.0513 7.16815)" />
          <ellipse cx="15.7234" cy="7.90286" fill="var(--fill-0, #1823EE)" id="Ellipse 3" rx="2.54079" ry="1.94296" transform="rotate(-11.0047 15.7234 7.90286)" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <p className="[grid-area:1_/_1] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[normal] ml-0 mt-0 relative text-[#1823ee] text-[26.47px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        guilhem
      </p>
      <p className="[grid-area:1_/_1] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[normal] ml-[43.94px] mt-[20.12px] relative text-[#1823ee] text-[26.47px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        terrier
      </p>
      <Group />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex font-['SF_Pro:Regular',sans-serif] font-normal gap-[60px] items-center leading-[normal] relative shrink-0 text-[#1823ee] text-[20px] text-nowrap whitespace-pre">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        mes expériences
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        ce que j‘aime
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        ma mentalité
      </p>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[100px] top-[39px] w-[1240px]">
      <Group1 />
      <Frame4 />
    </div>
  );
}

export default function Desktop() {
  return (
    <div className="bg-white relative size-full" data-name="Desktop - 1">
      <Frame />
      <Fond />
      <Frame3 />
    </div>
  );
}