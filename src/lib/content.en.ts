/* ============================================================
   English fallback copy — never authoritative.

   The real English text lives on the content itself (`titleEn`,
   `descriptionEn`, …), edited from the CMS exactly like the French
   fields and published to Supabase the same way. Whatever is actually
   published ALWAYS wins over what's declared here.

   This file only fills the gap before that happens: a bundled English
   translation of the copy this repo ships, keyed by id, shown only when
   the live content has no `*En` value of its own (empty, missing, or —
   for a case/skill this build doesn't know about — no entry at all, in
   which case the French text itself is the last resort). It exists so
   the site doesn't read half-translated the moment English is turned on,
   not so this file's wording can quietly outlive an edit made in Supabase.
   ============================================================ */

import type { Content } from "./content";
import type { Locale } from "./i18n";

interface ProfileTranslation {
  role: string;
  heroTitle: string;
  heroIntro: string;
  footerName: string;
  footerLine: string;
  footerBody: string;
}

interface SkillTranslation {
  title: string;
  description: string;
  stack: string[];
}

interface CaseTranslation {
  title: string;
  shortTitle?: string;
  summary: string;
  role: string;
  client: string;
  deliverables: string[];
  context: string;
  problem: string;
  approach: string[];
  result: string;
  figures?: { label: string }[];
  images?: { caption: string }[];
  links?: { label: string }[];
}

const EN_PROFILE: ProfileTranslation = {
  role: "design · ux · development",
  heroTitle: "Create, and be happy",
  heroIntro:
    "I design brands, interfaces and experiences. A visual is first thought through its message, and through the person it speaks to.",
  footerName: "I’m Guilhem",
  footerLine: "and I make yummy experiments.",
  footerBody:
    "Designer and developer, I work on brand, interface and code at the same bench. I like " +
    "projects where everything is still up for grabs: the message, the form, and how it holds " +
    "together on screen. If something here speaks to you, " +
    "[write to me](mailto:guilhemterrier58@gmail.com) — I always reply.",
};

const EN_SKILLS: Record<string, SkillTranslation> = {
  ux: {
    title: "User experience & product design",
    description:
      "My studies and my work have shown me how crucial studying real behaviour is to a product’s success — and, paradoxically, how rarely it’s actually practised. So I start from usage: interviews, questionnaires, corpora, in-situ testing. My master’s thesis went as far as challenging my own discipline, staying open to the idea that design wasn’t the answer.",
    stack: [
      "User research",
      "Semi-structured interviews",
      "Questionnaires",
      "Corpus analysis",
      "Personas",
      "Wireframes",
      "Figma prototyping",
      "Design system",
      "In-situ testing",
      "Accessibility",
    ],
  },
  design: {
    title: "Graphic design & identity",
    description:
      "A visual is first thought through the message it carries and the person it speaks to. I forged this practice freelancing and on side projects, down to the physical constraint: an identity system is only worth what survives screen-printing on a pouch, video compression, or the imposition of an A5 booklet.",
    stack: [
      "Visual identity",
      "Typography",
      "Art direction",
      "Packaging",
      "CMYK prepress",
      "Illustrator",
      "Photoshop",
      "InDesign",
      "Figma",
      "Editorial layout",
    ],
  },
  web: {
    title: "Product development",
    description:
      "I code my own designs, from mockup to deployment. I present it for what it is: a self-taught product-developer skill, heavily assisted by AI, without peer code review or formal engineering training. It’s an asset for handoff and design QA — I speak developers’ language and I ship what I draw — rather than team front-end experience.",
    stack: [
      "TypeScript",
      "React",
      "React Native",
      "Next.js",
      "Tailwind CSS",
      "Zustand",
      "IndexedDB",
      "Expo",
      "p5.js",
      "Git",
      "Claude Code",
    ],
  },
  infra: {
    title: "Back-end, infrastructure & compliance",
    description:
      "Modelling a database, setting the right access rules, and never exposing what shouldn’t be. On Megacarte, GDPR and French accessibility rules were treated as design constraints from day one rather than a patch: explicit consent for the rights transfer, a hashed IP fingerprint as legal proof instead of a plain address, European hosting as a matter of principle.",
    stack: [
      "Supabase",
      "PostgreSQL",
      "Row Level Security",
      "REST API",
      "Mistral",
      "Perplexity",
      "Linux VPS",
      "GitHub Actions",
      "Bunny.net",
      "GDPR",
      "RGAA",
    ],
  },
  ia: {
    title: "AI & agentic architecture",
    description:
      "Designing workflows where AI has a written scope, not a vague role. For my thesis: six sub-agents with distinct permissions — only one allowed to write the final prose, another tasked with challenging my own arguments — and a log of AI contributions folded into the methodology. It’s a workflow-architecture skill, and I demonstrate it through the public repository rather than a keyword on a résumé.",
    stack: [
      "Claude Code",
      "Sub-agents",
      "Skills & hooks",
      "MCP",
      "Prompt engineering",
      "Anthropic API",
      "Mistral OCR",
      "MiniMax TTS",
      "ElevenLabs Music",
      "Contribution logs",
    ],
  },
  project: {
    title: "Project management & editorial",
    description:
      "Three years on a work-study track at the C2RMF, then at Inrap, bridging departments that don’t speak the same language: scientific, technical, vendors. In an institution, a website rarely suffers from a technical problem — it suffers from a production problem, and that’s where the real work happens.",
    stack: [
      "Vendor management",
      "Co-design workshops",
      "Requirements gathering",
      "Drupal",
      "Institutional SEO",
      "Analytics",
      "Web writing",
      "Obsidian",
      "Zotero",
    ],
  },
};

const EN_CASES: Record<string, CaseTranslation> = {
  frenchbook: {
    title: "FrenchBook Scan — checking a box of books on arrival",
    summary:
      "A web app that photographs the paper packing slip, runs it through two OCR engines in parallel, arbitrates the doubtful cases, then has the books scanned one by one. Designed for one hand, standing up, in a warehouse.",
    role: "Product design, UX and development, solo",
    client: "FrenchBook Distribution — freelance engagement, in production",
    deliverables: [
      "Deployed Next.js web app",
      "Cross-checked dual OCR reading and arbitration",
      "Continuous barcode scanning",
      "PDF export of the check",
    ],
    context:
      "On export, every box arrives with its paper purchase order — a SODIS/Gallimard or CDL Hachette packing slip. Before shipping, the physical contents have to be confirmed line by line against that slip. It’s the link that gates everything downstream: until a box is checked, it doesn’t leave.",
    problem:
      "The check is done on paper, by eye, reference after reference. It’s slow, and attention drops exactly where an error costs the most: a misread ISBN doesn’t stay a typo, it becomes a supplier dispute. The setting doesn’t help — you hold the phone in one hand and handle the books with the other, standing, in a warehouse.",
    approach: [
      "Observe the step on the ground to model the packing slips’ real errors rather than a textbook case: a two-line block shifted out of place, title add-ons mistaken for separate items, subheadings falling outside the count, duplicate ISBNs.",
      "Have each page read by two Mistral engines in parallel — the document endpoint and the vision model — with a strict JSON schema imposed on both, so their outputs are comparable field by field.",
      "Settle disagreements with the ISBN’s own check digit: an EAN-13 validates itself, so the machine arbitrates without asking anyone to recompute a checksum by hand.",
      "Strictly separate what blocks the operator — a broken ISBN, two competing valid ISBNs, an inconsistent quantity — from what stays a simple on-screen note that never interrupts the flow.",
      "Scan continuously with ZXing, since Safari doesn’t implement BarcodeDetector, with a debounce built in: a 900ms pause after each validation, and a double read required for anything that isn’t a Bookland code.",
      "Make up in design for what iOS doesn’t allow — no vibration, no flashlight control: confirmation is a full-screen colour flash, visible without having to look closely.",
      "Keep API keys server-side, protect access with an HMAC-signed cookie, and store nothing: once a box is closed, everything is erased.",
    ],
    result:
      "The operator no longer transcribes anything. They confirm a scan, arbitrate the few flagged cases, then pass the books in front of the camera; the line-by-line check gives way to a list of discrepancies, far shorter to work through. The app is in real use by the receiving team, and the step gains 35% efficiency. The deliberate trade-off: better to wrongly block, rarely, than to let a silent error through.",
    figures: [
      { label: "efficiency gained on the check step" },
      { label: "cross-checked OCR engines, arbitrated by the ISBN check digit" },
    ],
  },

  memoire: {
    title: "Master’s thesis — why smartphone audio guides don’t catch on",
    shortTitle: "Master’s Thesis",
    summary:
      "117 pages, four interviews, 70 survey respondents, six audio guides analysed, and a prototype tested in-gallery. I was looking for a design problem; the fieldwork answered something else.",
    role: "Research, fieldwork, prototype",
    client:
      "Master’s in Multimedia and Internet Interface Design, Université Sorbonne Paris Nord — supervised by Benoît Berthou",
    deliverables: [
      "117-page thesis",
      "Visitor and institution interviews",
      "Corpus of six analysed audio guides",
      "Prototype tested at the Cité de l’Architecture et du Patrimoine",
    ],
    context:
      "Over ten years, the number of museum apps has doubled in France: 398 in 2015, 530 in 2021. Meanwhile, the dedicated audio-guide device is still used by 75% of visitors, while the personal-smartphone app plateaus around 50% (Gece barometer, 2025). More and more is produced of a tool that gets used less and less.",
    problem:
      "Between the promise of accessible mediation and the reality of a marginally-adopted tool, what stops the mobile audio guide from doing its job? The corpus analysis gives a first clue: almost every interface forces the eye onto the screen — maps, menus, route lists — at the expense of what the visitor came to see. And in a museum, the eye is the scarce resource.",
    approach: [
      "Lay out five hypotheses — design, economic, organisational, contextual, and the device itself — then put them to the test with a qualitative study.",
      "Run four semi-structured interviews: two with visitors, two with institutions — one museum with an audio guide, one without.",
      "Run a questionnaire, 70 respondents.",
      "Analyse a corpus of six audio guides against a common framework.",
      "Design the opposite of what the corpus does: a simple trigger, audio at the centre, the screen at the periphery, with the ideal being that the phone can stay in your pocket.",
      "Test two mockups with five visitors in the Galerie des moulages — same playback interface, only the entry point changes: typing in a number versus scanning a QR code.",
    ],
    result:
      "Four visitors out of five preferred the QR code: fewer steps, a more familiar gesture. But the preference came with a caveat that says the essential thing — “When I’m in a museum, I don’t necessarily want to be on my phone.” I set out looking for a design flaw, and found a production chain instead: between the curators who approve, the mediation staff writing under supervision, and the vendor who standardises, the audio guide ends up with no identifiable author. You can design the best interface in the world and it will still run into a question of governance, not design: who pays to build it, and who guarantees it gets maintained? This thesis is also where I had to own up to my own bias — I was thinking in terms of the tool, not the visitor, exactly the reproach I was levelling at institutions. Defended June 2026, top of the cohort, best thesis grade in the class.",
    figures: [
      { label: "visitors preferred the QR code over typing a number" },
      { label: "survey respondents, 6 audio guides analysed" },
    ],
    images: [
      { caption: "Mockup 1 — the number-entry logic, inherited from the physical device." },
      {
        caption:
          "Mockup 2 — the QR-code logic, preceded by a four-screen welcome module.",
      },
    ],
    links: [
      { label: "Read the thesis (Master’s 2, 117 pages)" },
      { label: "Read the literature review (Master’s 1, 34 pages)" },
    ],
  },

  megacarte: {
    title: "Megacarte — mapping megalithic heritage with the people who live around it",
    summary:
      "A contributive mapping platform in a public-sector context, where GDPR and accessibility were treated as design constraints from the very first mockup.",
    role: "Research, design and development",
    client: "Inrap — the French national institute for preventive archaeology",
    deliverables: [
      "User research and personas",
      "Mobile-first Figma prototyping",
      "Deployed Next.js platform",
      "Moderation back-office",
    ],
    context:
      "Megalithic heritage is scattered, often off the marked trails, and the people who know it best are rarely institutions: they’re locals, hikers, enthusiasts. A contributive platform was the right move — it still had to hold up within a public-sector framework demanding on security, data sovereignty and compliance.",
    problem:
      "Open contribution raises two problems usually addressed too late. The first is human: pre-approval blocks everything and discourages contributors, while free publishing exposes the institution. The second is legal — collecting a contribution means collecting personal data and a rights transfer, and a GDPR fix bolted on afterwards always shows.",
    approach: [
      "Start from user research: personas, functional scoping, then mobile-first Figma prototyping — people contribute out in the field, not at a desk.",
      "Choose post-moderation: direct publishing paired with a report flag, rather than pre-approval, which would have smothered contributions.",
      "Model the database on Supabase with Row Level Security policies, rather than filtering on the application side.",
      "Ask for explicit consent to the rights transfer, and store a hashed IP/user-agent fingerprint as legal proof instead of the plain address.",
      "Store no personal data that doesn’t serve a purpose, and aim for RGAA accessibility compliance across every flow.",
      "Host in Europe as a matter of sovereignty — Bunny.net for storage and delivery.",
    ],
    result:
      "A platform where compliance isn’t a layer added on top: it shaped the data model and the contribution flow. It’s also the project where I had to defend technical choices in front of a public institution, which is as much about posture as it is about technique.",
  },

  capa: {
    title: "Audio-guide bot — writing for a voice that doesn’t exist",
    shortTitle: "CAPa Audio-Guide Bot",
    summary:
      "A pipeline that turns a topic into a narrative script tuned for speech synthesis, along with its ambient music. Tested under real conditions at the Cité de l’Architecture et du Patrimoine.",
    role: "Pipeline design, prompt engineering, field testing",
    client: "Cité de l’Architecture et du Patrimoine — tied to the work-study placement and the thesis",
    deliverables: [
      "Script-generation pipeline",
      "Ambient-music prompts",
      "Automated mixing chain",
      "Prototype tested at the CAPa",
    ],
    context:
      "My thesis had established that production cost is one of the real barriers to audio guides: writing, getting sign-off, recording and mixing a tour engages an entire chain, and that’s what decides whether content exists at all. What remained was whether that cost could be shifted without sacrificing the quality of mediation.",
    problem:
      "A generic AI writes to be read, not to be heard: long sentences, decorative punctuation, no room to breathe. And above all, it spontaneously produces the deficit model — knowledge handed down to a supposedly ignorant public — when contemporary museum mediation argues for the opposite, a dialogic model. So the problem wasn’t technical, it was translating a theoretical framework into operational rules.",
    approach: [
      "Translate the theoretical framework of mediation — dialogic versus deficit models, after Bensaude-Vincent and Jacobi — into automatable writing constraints.",
      "Calibrate the text for the synthetic voice: pacing, punctuation, inline pause tags specific to MiniMax TTS.",
      "Produce, in parallel, a music prompt in English, capped at 15-25 words and constrained to be “background-friendly”, for ElevenLabs Music.",
      "Choose two separate engines rather than one all-in-one tool, each doing what it does best.",
      "Mix in post-production with ffmpeg and pydub, applying ducking on the vocal channel.",
      "Test under real conditions at the CAPa and iterate on the feedback.",
    ],
    result:
      "A direct bridge between the thesis’s research side and a working prototype: the theoretical framework didn’t stay a chapter, it became a generation constraint. The field test remains at prototype scale, not deployment scale.",
  },

  thebookclub: {
    title: "TheBookClub.cafe — a Letterboxd for books",
    summary:
      "Personal library, reviews, following other readers. A complete social platform built solo, with its database assembled book by book and a self-hosted distribution pipeline.",
    role: "Design, development and operation",
    client: "Personal project",
    deliverables: [
      "Next.js platform in production",
      "Relational database of works / editions / reviews",
      "Self-hosted distribution pipeline",
      "Successive security audits",
    ],
    context:
      "There’s a Letterboxd for films and nothing equivalent for books: a personal library, ratings, reviews, and above all readers you follow because you like what they read. I wanted to build that thing, and run it, not just mock it up.",
    problem:
      "A book platform’s first stumbling block is its catalogue. Importing a whole database gives you millions of dead entries, duplicates and bad metadata; importing nothing leaves an empty service for the first user. My first idea — scraping data from a Google Books URL — turned out to be fragile the moment you stepped outside the happy path.",
    approach: [
      "Build the database organically: a missing book enters the catalogue when a reader searches for it and fills it in.",
      "Settle the URL-entry-versus-ISBN-entry debate in favour of the ISBN, for its universality and because it validates itself.",
      "Properly model the relationship between works / editions / users / reviews / lists, rather than flattening a book into a single row.",
      "Self-host the distribution pipeline — a content-generation bot feeding into Postiz, on a Swiss VPS.",
      "Run dated security and production audits, and write the cleanup and migration scripts the database needed.",
    ],
    result:
      "A complete social platform in service — authentication, user content, moderation, distribution — built and operated solo. Choosing the ISBN over my own first idea is the decision I’m proudest of: it made generic what would otherwise have been a hack.",
    links: [{ label: "Open TheBookClub" }],
  },

  wakey: {
    title: "Wakey — a news app that knows when to stop",
    summary:
      "An AI-driven news aggregator, built solo from the first line of code to publication on the App Store. What it does best is what it doesn’t show you.",
    role: "Design, UX, development, release",
    client: "Personal project",
    deliverables: [
      "iOS app published on the App Store",
      "Complete mobile design system",
      "Collection and summarisation pipeline",
      "Wakey+ subscription",
    ],
    context:
      "Wakey is my most finished project. I wanted to learn to work with AI APIs, and I didn’t want to learn it on a toy exercise: so I picked up React, Git and GitHub along the way, and saw it through to the end — App Store review included.",
    problem:
      "An aggregator is only as good as what it leaves out, and that’s exactly what none of them do: they all add one more feed. So the difficulty wasn’t collecting, it was deciding what not to show — and holding that decision screen after screen, when the temptation to add “and also” comes back every time.",
    approach: [
      "Set a dose rather than a feed: three news items a day, two topics of interest, a summary that actually ends. When the stack is empty, the app says so and stops there.",
      "Hold the same rule on the article screen — one piece of context, one fact, nothing else. Every screen does exactly one thing.",
      "Build a dedicated mobile design system — components, variants, states — without a third-party UI framework.",
      "Base the Wakey+ subscription on volume, not features: six news items instead of three, as many categories as you want, three euros a month — a freemium model with tiered access, not a crippled demo.",
      "Plug in the Perplexity API for collection and summarisation, and Supabase for the database, authentication and the daily refresh.",
      "Add Stripe to verify subscription status, build in React mobile via Expo, and work in Cursor.",
      "See it through to publication on the App Store, review included.",
    ],
    result:
      "The message “you’ve just finished” is a feature, not an error message. It’s the design decision I’m proudest of, and also the hardest one to stick to — but it’s the one that sets Wakey apart from just one more feed.",
    images: [
      {
        caption:
          "An article, the end of the day’s summary, the profile. The message “you’ve just finished” is a feature, not an error message.",
      },
      { caption: "The full pipeline, from collection to download." },
    ],
  },

  artsing: {
    title: "ArtSing — making paintings sing",
    summary:
      "Three AI-animated paintings that sing, and a karaoke mode to sing along. A 2023 project, entirely rewritten two years later, and back online today.",
    role: "Concept, identity, development",
    client: "Personal project",
    deliverables: [
      "Three song pages",
      "Hand-synced karaoke",
      "Identity and interface",
      "Relaunched in 2025",
    ],
    context:
      "In 2023, AI video generation had just left the lab and everyone was trying to figure out what it was actually good for. I wanted to use it for something silly and joyful: making paintings sing. Three canvases, three songs — Van Gogh’s self-portrait singing Tainted Love, the Mona Lisa singing Sunny, Chopin’s portrait singing Un peu de haine. The title says it all: “the art of singing together”.",
    problem:
      "The painting opens its mouth, the lyrics scroll by, and at that moment the visitor has a choice — watch, or sing along. Nothing should force it, or the effect falls flat. The first version, though, did too much: a cursor replaced with a trail, two waveforms listening to the mic. The idea was good, the execution far less so — the lyrics drifted out of sync, and half the pages didn’t hold up.",
    approach: [
      "Carry the contrast between the painter and the song through typography rather than a set: powder pink and burnt orange, Instrument Serif italic for proper nouns, Inter for everything else.",
      "Line up the three canvases like record sleeves on the homepage, with a slight 3D tilt that follows the cursor — just enough to make you want to click.",
      "Reduce a song page to four things: the singing canvas, the current line, the next one below it in a paler tone, a progress bar. One play button, one mute button.",
      "Write the karaoke timecodes by hand, song by song — it’s handmade, and that’s what makes it land right.",
      "Build it by hand in HTML, CSS and JavaScript, with no framework or build step, and p5.js for the homepage’s animated background.",
      "Rewrite the whole thing in 2025, stripping everything but the essentials, then put the project back online: the p5 library bundled instead of served from a CDN, a fixed image path, added media queries.",
    ],
    result:
      "The version online today is the 2025 one. The code had been sitting in a folder for two years; I only fixed what kept it from being viewable, everything else is as it was. The paintings were animated with video models, the code written with ChatGPT and Cursor as companions.",
    images: [
      { caption: "The Chopin page, as it is online today." },
      {
        caption:
          "The production chain: AI to bring the paintings to life, Cursor for the code, O2switch for hosting.",
      },
    ],
    links: [{ label: "Open ArtSing" }],
  },

  elapsio: {
    title: "Elapsio — the identity and packaging of a hiking-food brand",
    summary:
      "A brand of hiking food kits, from the logotype to the pouches. One single system had to hold up on a banner and on ten centimetres of packaging.",
    role: "Identity, art direction, packaging",
    client: "Freelance engagement",
    deliverables: ["Logotype and variations", "Packaging range", "Usage guidelines"],
    context:
      "Elapsio designs hiking food kits. I supported them from the creation of the identity through to its variations, packaging included.",
    problem:
      "The brand had to hold up in two worlds that look nothing alike: a shop shelf, where it’s compared against ten others, and the bottom of a backpack, where it’s alone and crumpled. On top of that, a manufacturing constraint decided everything — embroidery, stamping, screen-printing on a pouch: nothing survives a gradient.",
    approach: [
      "Look for a warm, legible brand, reducible to a single shape.",
      "Draw a symbol that reads as a scallop shell as much as a mountain summit, with rays curving back down — the walk, and what you look at while walking.",
      "Keep it as a flat, single-colour mark, since that was the real constraint.",
      "On the pouch, commit to a blunt hierarchy: the recipe name first, everything else after.",
      "Draw the palette from the terrain rather than the brand: forest greens, the orange of a low sun.",
    ],
    result:
      "A system that goes from banner to pouch without falling apart, and survives even the poorest print processes. The format forgives nothing — ten centimetres tall, a gloved hand, late-afternoon light — and that’s where it’s judged.",
    images: [
      { caption: "The flat logotype: a shell, a summit, and rays curving back down." },
      {
        caption:
          "An Essentielle Boost pouch at camp, between the stove and the boots. The only test that matters.",
      },
    ],
  },

  c2rmf: {
    title: "C2RMF, then Inrap — running institutional websites",
    summary:
      "Three years on a work-study track across two public cultural institutions, keeping websites alive, running redesigns and negotiating with vendors. Traffic doubled in two years.",
    role: "Web and editorial project manager",
    client: "Work-study placement — C2RMF (French Ministry of Culture), then Inrap",
    deliverables: [
      "Editorial and technical management",
      "Site-structure redesign",
      "Oversight of two redesigns at Inrap",
      "CMS workshops with the vendor",
    ],
    context:
      "The Centre for Research and Restoration of the Museums of France produces a considerable amount of knowledge and publishes little of it. Then, at the national institute for preventive archaeology, the role shifted toward management: two redesigns run in parallel, leadership on one side, the vendor on the other.",
    problem:
      "In an institution, a website rarely suffers from a technical problem: it suffers from a production problem. The material exists, scattered across departments, but nothing surfaces it — and the approval chain is longer than the writing itself. So my work was less about writing than about unblocking.",
    approach: [
      "Go fetch the material department by department, and shorten the approval chain.",
      "Rework the content-creation process with each department, to raise the publishing frequency.",
      "Analyse traffic and user behaviour, then redesign the site structure on that basis.",
      "Optimise pages’ SEO and accessibility.",
      "Run Drupal CMS improvement workshops with the institution and the vendor.",
      "At Inrap: oversee the redesign of the portal site, then the image library — advising leadership, workshops, back-office.",
      "At Inrap: manage the institution’s participation in the bicentenary of photography.",
    ],
    result:
      "Web traffic more than doubled in two years, with no acquisition campaign: purely by putting the structure, SEO and publishing rhythm back in order. The site stopped being a bottleneck.",
    figures: [{ label: "increase in web traffic in two years" }],
    images: [{ caption: "The centre’s showcase website." }],
  },

  lkl: {
    title: "LKL — the identity of an amateur esports league",
    summary:
      "A brand that has to pop on stream and stay usable by volunteers, with no art direction behind them to catch the mistakes.",
    role: "Identity, art direction",
    client: "LKL — amateur esports league",
    deliverables: ["Logotype", "Broadcast variations", "Reusable templates"],
    context:
      "LKL is an amateur esports league. The real client isn’t a marketing team: it’s volunteers who will produce their own match graphics themselves, every week, with whatever tools they have on hand.",
    problem:
      "Two constraints play off each other. A stream image gets compressed, resized, keyed over game footage: anything fine disappears. And a forty-page brand guide wouldn’t have served anyone — too delicate a system degrades the moment the first variation is made without me.",
    approach: [
      "Reduce the brand to three elements: a shape, a word, a background.",
      "Draw a burst star that reads like an impact, massive detail-free lettering, and push the contrast to the max.",
      "Add grain to the flat colour, which without it would have banded apart under compression.",
      "Deliver templates rather than files, so volunteers could produce variations without getting it wrong.",
    ],
    result:
      "An identity the league produces itself, week after week, without the system falling apart. What’s solid survives broadcast — it’s as much an answer to the technical constraint as an aesthetic choice.",
    images: [{ caption: "The main lockup on its grained flat colour." }],
  },
};

const EN_LIKE_KIND: Record<string, string> = {
  "littérature": "literature",
  "bd / manga": "comics / manga",
  "cinéma": "film",
  "musique": "music",
};

/** A live `*En` value wins whenever it's actually been set; otherwise the
 *  bundled seed, then the French text — never the reverse. */
function pick(live: string | undefined, seed: string | undefined, fr: string): string {
  if (live && live.trim()) return live;
  if (seed && seed.trim()) return seed;
  return fr;
}

function pickList(live: string[] | undefined, seed: string[] | undefined, fr: string[]): string[] {
  if (live && live.length > 0) return live;
  if (seed && seed.length > 0) return seed;
  return fr;
}

/**
 * Resolves the English content actually shown, field by field, in strict
 * priority order: what's published in Supabase (`content.*En`), then the
 * bundled fallback above, then the French text itself. The admin layer
 * always edits the French object regardless of the locale on screen, so
 * this function is never in the write path — it only decides what a
 * visitor reads.
 */
export function localizeContent(content: Content, locale: Locale): Content {
  if (locale === "fr") return content;

  return {
    ...content,
    profile: {
      ...content.profile,
      heroTitle: pick(content.profile.heroTitleEn, EN_PROFILE.heroTitle, content.profile.heroTitle),
      heroIntro: pick(content.profile.heroIntroEn, EN_PROFILE.heroIntro, content.profile.heroIntro),
      footerName: pick(content.profile.footerNameEn, EN_PROFILE.footerName, content.profile.footerName),
      footerLine: pick(content.profile.footerLineEn, EN_PROFILE.footerLine, content.profile.footerLine),
      footerBody: pick(content.profile.footerBodyEn, EN_PROFILE.footerBody, content.profile.footerBody),
    },
    skills: content.skills.map((skill) => {
      const seed = EN_SKILLS[skill.id];
      return {
        ...skill,
        title: pick(skill.titleEn, seed?.title, skill.title),
        description: pick(skill.descriptionEn, seed?.description, skill.description),
        stack: pickList(skill.stackEn, seed?.stack, skill.stack),
      };
    }),
    cases: content.cases.map((study) => {
      const seed = EN_CASES[study.id];
      return {
        ...study,
        title: pick(study.titleEn, seed?.title, study.title),
        shortTitle: pick(study.shortTitleEn, seed?.shortTitle, study.shortTitle),
        summary: pick(study.summaryEn, seed?.summary, study.summary),
        role: pick(study.roleEn, seed?.role, study.role),
        client: pick(study.clientEn, seed?.client, study.client),
        deliverables: pickList(study.deliverablesEn, seed?.deliverables, study.deliverables),
        context: pick(study.contextEn, seed?.context, study.context),
        problem: pick(study.problemEn, seed?.problem, study.problem),
        approach: pickList(study.approachEn, seed?.approach, study.approach),
        result: pick(study.resultEn, seed?.result, study.result),
        figures: study.figures?.map((figure, i) => ({
          ...figure,
          label: pick(figure.labelEn, seed?.figures?.[i]?.label, figure.label),
        })),
        images: study.images.map((image, i) => ({
          ...image,
          caption: pick(image.captionEn, seed?.images?.[i]?.caption, image.caption),
        })),
        links: study.links?.map((link, i) => ({
          ...link,
          label: pick(link.labelEn, seed?.links?.[i]?.label, link.label),
        })),
      };
    }),
    likes: content.likes.map((like) => ({
      ...like,
      kind: pick(like.kindEn, EN_LIKE_KIND[like.kind], like.kind),
    })),
  };
}
