import svgPaths from "./svg-mygyho3xsb";

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

function Frame4() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Crimson_Text:Regular',sans-serif] gap-[100px] items-start leading-[100px] left-[100px] not-italic text-[40px] top-[281px] w-[400px]">
      <p className="relative shrink-0 text-[#1823ee] w-full">Design graphique</p>
      <p className="relative shrink-0 text-black w-full">Expérience utilisateur</p>
      <p className="relative shrink-0 text-black w-full">Développement web</p>
      <p className="relative shrink-0 text-black w-full">Gestion de projets</p>
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

function Frame9() {
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
      <Frame9 />
    </div>
  );
}

function Frame6() {
  return <div className="bg-[#1823ee] h-[400px] shrink-0 w-full" />;
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Frame6 />
      <p className="font-['Crimson_Text:Italic',sans-serif] italic leading-[20px] relative shrink-0 text-[20px] text-black w-full">Elapsio - création d’un branding l’entreprise Elapsio</p>
    </div>
  );
}

function Frame10() {
  return <div className="bg-[#1823ee] h-[400px] shrink-0 w-full" />;
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Frame10 />
      <p className="font-['Crimson_Text:Italic',sans-serif] italic leading-[20px] relative shrink-0 text-[20px] text-black w-full">Elapsio - création de packagings pour leur produit phare : le kit alimentaire de randonnée</p>
    </div>
  );
}

function Frame12() {
  return <div className="bg-[#1823ee] h-[400px] shrink-0 w-full" />;
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Frame12 />
      <p className="font-['Crimson_Text:Italic',sans-serif] italic leading-[20px] relative shrink-0 text-[20px] text-black w-full">LKL - création d’un branding pour la league esport amateur LKL</p>
    </div>
  );
}

function Frame13() {
  return <div className="bg-[#1823ee] h-[400px] shrink-0 w-full" />;
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Frame13 />
      <p className="font-['Crimson_Text:Italic',sans-serif] italic leading-[20px] relative shrink-0 text-[20px] text-black w-full">Artsing - création d’un branding et d’une page web avec usage de l’intelligence artificielle à ses balbutiements.</p>
    </div>
  );
}

function DesignGraphique() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[40px] items-start left-px top-0 w-[613px]" data-name="Design graphique">
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[20px] text-black w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        J’ai forgé mon expérience dans le design graphique à travers de multiples facettes de ma vie professionnelle, veille personnelle, freelance, projets annexes.
      </p>
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[20px] text-black w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Pour moi, le design graphique doit être pensé avant tout avec l’idée du message que l’on veux fournir dans notre visuel et de savoir à qui on le fournit. La compréhension de l’autre et l’empathie sont clés.
      </p>
      <Frame5 />
      <Frame11 />
      <Frame7 />
      <Frame8 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="absolute h-[700px] left-[calc(50%+6px)] overflow-x-clip overflow-y-auto top-[146px] w-[614px]">
      <DesignGraphique />
    </div>
  );
}

export default function Desktop() {
  return (
    <div className="bg-white relative size-full" data-name="Desktop - 2">
      <Frame3 />
      <Frame4 />
      <Frame />
      <Frame14 />
    </div>
  );
}