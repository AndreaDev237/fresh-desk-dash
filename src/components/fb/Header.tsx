import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png.asset.json";
import { useCart } from "@/store/cart";
import { ThemeToggle } from "@/components/fb/ThemeToggle";

export function Header() {
  const { count } = useCart();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 mx-auto max-w-[520px] border-b border-outline-variant/30 bg-surface/85 backdrop-blur-md">
      <div className="flex h-[64px] items-center justify-between px-4">
        <Link to="/" className="flex min-w-0 items-center gap-2 press">
          <img src={logo.url} alt="Frutteria Boolean" className="h-9 w-9 shrink-0 object-contain" />
          <span className="truncate text-[20px] font-extrabold tracking-tight text-on-surface">
            Frutteria
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            to="/cart"
            aria-label="Vai al carrello"
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full press hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[26px] text-on-surface">
              shopping_cart
            </span>
            {count > 0 && (
              <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-surface bg-secondary-container px-1 text-[10px] font-bold text-on-secondary-container">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
