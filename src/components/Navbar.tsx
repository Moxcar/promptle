import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";

function NavBar() {
  return (
    <nav className="absolute top-0 z-10 flex w-full items-center justify-between justify-self-start border-b border-black/[0.1] bg-gray-300/30 px-20 py-2 backdrop-blur-md dark:border-white/[0.1] dark:bg-gray-800/30">
      <div className="flex items-center gap-4">
        <a href="/" className="text-xl font-bold">
          Promptle
        </a>
      </div>
      <div className="flex items-center gap-4">
        {/* Github link */}
        <Button variant="outline" size="icon" role="link">
          <a
            href="https://github.com/Moxcar/promptle"
            target="_blank"
            className="rounded-md p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-black dark:text-white"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
        </Button>
        <ModeToggle />
      </div>
    </nav>
  );
}

export default NavBar;
