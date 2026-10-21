import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@fontsource-variable/geist"
import "@fontsource-variable/geist-mono"
import "./index.css"
import App from "./App.tsx"
import { captureAttribution } from "@/lib/attribution"

// Guarda as UTMs/gclid da primeira página para irem com o lead até o CRM.
captureAttribution()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
