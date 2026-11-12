import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MenuPage from "./components/MenuPage.jsx";
import "./styles/style.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MenuPage />
  </StrictMode>
);
