/// <reference types="vite/client" />

// Image assets
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

// PDF files
declare module '*.pdf' {
  const src: string;
  export default src;
}

// Figma assets (legacy support)
declare module 'figma:asset/*' {
  const src: string;
  export default src;
}
