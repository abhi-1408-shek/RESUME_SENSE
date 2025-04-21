import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);
  return (
    <button
      className="rounded-full p-2 bg-white/20 dark:bg-gray-700 hover:bg-white/40 dark:hover:bg-gray-600 transition-colors shadow"
      onClick={() => setDark((d) => !d)}
      title="Toggle dark mode"
    >
      {dark ? (
        <span role="img" aria-label="Light">🌞</span>
      ) : (
        <span role="img" aria-label="Dark">🌙</span>
      )}
    </button>
  );
}
