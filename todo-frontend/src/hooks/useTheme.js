import { useEffect } from "react";

export default function useTheme() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "dark";
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, []);
}
