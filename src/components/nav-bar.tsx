import { ModeToggle } from "./mode-toggle";

function NavBar() {
  return (
    <nav className="absolute top-0 z-10 flex w-full items-center justify-between justify-self-start border-b border-black/[0.1] px-20 py-2 dark:border-white/[0.1]">
      <div className="flex items-center gap-4">
        <a href="/" className="text-xl font-bold">
          Promptle
        </a>
        <a href="/test" className="text-xl font-bold">
          Test
        </a>
      </div>

      <ModeToggle />
    </nav>
  );
}

export default NavBar;
