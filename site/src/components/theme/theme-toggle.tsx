"use client";

import {useTheme} from "next-themes";

function ThemeIcon() {
  return (
    <span className="relative block size-[22px]" aria-hidden="true">
      <svg
        className="absolute inset-0 size-[22px] fill-none stroke-current [stroke-width:1.7] opacity-100 transition-[opacity,transform] duration-250 [stroke-linecap:round] [stroke-linejoin:round] motion-reduce:transition-none dark:scale-70 dark:rotate-30 dark:opacity-0"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
      </svg>
      <svg
        className="absolute inset-0 size-[22px] scale-70 -rotate-30 fill-none stroke-current [stroke-width:1.7] opacity-0 transition-[opacity,transform] duration-250 [stroke-linecap:round] [stroke-linejoin:round] motion-reduce:transition-none dark:scale-100 dark:rotate-0 dark:opacity-100"
        viewBox="0 0 24 24"
      >
        <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8a8.5 8.5 0 1 0 11.3 11.3Z" />
      </svg>
    </span>
  );
}

export function ThemeToggle() {
  const {resolvedTheme, setTheme} = useTheme();

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <button
      className="grid size-6.5 cursor-pointer place-items-center border-0 bg-transparent p-0 text-[var(--text-soft)]"
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
    >
      <ThemeIcon />
    </button>
  );
}
