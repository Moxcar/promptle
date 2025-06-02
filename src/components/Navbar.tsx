import { ModeToggle } from "./ModeToggle";

function NavBar() {
  return (
    <nav className="absolute top-0 z-10 flex w-full items-center justify-between justify-self-start border-b border-black/[0.1] bg-gray-300/30 px-20 py-2 backdrop-blur-md dark:border-white/[0.1] dark:bg-gray-800/30">
      <div className="flex items-center gap-4">
        <a href="/" className="text-xl font-bold">
          Promptle
        </a>
      </div>
      <ModeToggle />
    </nav>
  );
}

export default NavBar;
