import Link from "next/link";
import { SignInButton } from "./signInButton";
import { SignOutButton } from "./signOutButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { auth } from "../api/auth/authConfig";

export function Hamburger() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
}

export async function TopNav() {
  // const session = await auth();

  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between bg-black p-2 pl-4 pr-4 text-xl font-semibold text-white">
      <div className="flex items-center gap-8">
        <Link href="/dashboard">OpenMat</Link>
        <div className="hidden gap-8 sm:flex">
          <Link href="/dashboard" className="text-sm">
            Dashboard
          </Link>
          <Link href="/trade" className="text-sm">
            Trades
          </Link>
          <Link href="/sets" className="text-sm">
            Sets
          </Link>
          <Link
            href="/cardlist?page=1&pageSize=30&orderBy=number"
            className="text-sm"
          >
            Cards
          </Link>
          <Link href="/about" className="text-sm">
            About
          </Link>
          <Link
            href="https://www.paypal.com/donate/?hosted_button_id=ZCDZKZW4JE5LG"
            className="text-sm"
          >
            Donate
          </Link>
        </div>
      </div>
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Hamburger />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href="/dashboard" className="text-sm">
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/trade" className="text-sm">
                Trades
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/sets" className="text-sm">
                Sets
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/cardlist" className="text-sm">
                Cards
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/about" className="text-sm">
                About
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href="https://www.paypal.com/donate/?hosted_button_id=ZCDZKZW4JE5LG"
                className="text-sm"
              >
                Donate
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
              <div className="mt-4 sm:mt-0">
                {session.userId ? <SignOutButton /> : <SignInButton />}
              </div>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="hidden sm:block">
        {/* <div className="mt-4 sm:mt-0">
          {session.userId ? <SignOutButton /> : <SignInButton />}
        </div> */}
      </div>
    </nav>
  );
}
