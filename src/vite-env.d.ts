/// <reference types="vite/client" />

// GLSL shader imports
declare module '*.glsl' {
  const value: string;
  export default value;
}

declare module '*.vert.glsl' {
  const value: string;
  export default value;
}

declare module '*.frag.glsl' {
  const value: string;
  export default value;
}

// GLSL with ?raw suffix
declare module '*.glsl?raw' {
  const value: string;
  export default value;
}

declare module '*.vert.glsl?raw' {
  const value: string;
  export default value;
}

declare module '*.frag.glsl?raw' {
  const value: string;
  export default value;
}
