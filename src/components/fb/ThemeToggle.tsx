import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Attiva tema chiaro" : "Attiva tema scuro"}
      aria-pressed={isDark}
      className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full press hover:bg-surface-container"
    >
      <span className="material-symbols-outlined text-[24px] text-on-surface">
        {isDark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
