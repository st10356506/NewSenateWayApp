/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ACCUWEATHER_API_KEY: string
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_GA_MEASUREMENT_ID: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
}

declare global {
  interface Window {
    google?: {
      maps: typeof google.maps;
    };
  }
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
