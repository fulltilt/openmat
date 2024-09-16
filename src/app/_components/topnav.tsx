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
import { MapPin } from "lucide-react";

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
  const session = await auth();

  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between bg-black p-2 pl-4 pr-4 text-xl font-semibold text-white">
      <div className="flex items-center gap-8">
        <div className="flex">
          <MapPin className="mr-2 h-6 w-6 text-blue-600" />
          <Link href="/home">OpenMat</Link>
        </div>
        <div className="hidden gap-8 sm:flex">
          {/* <Link href="/about" className="text-sm">
            About
          </Link> */}
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
            {/* <DropdownMenuItem>
              <Link href="/about" className="text-sm">
                About
              </Link>
            </DropdownMenuItem> */}
            <DropdownMenuItem>
              <Link
                href="https://www.paypal.com/donate/?hosted_button_id=ZCDZKZW4JE5LG"
                className="text-sm"
              >
                Donate
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="mt-4 sm:mt-0">
                {session?.user ? <SignOutButton /> : <SignInButton />}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="hidden sm:block">
        <div className="mt-4 sm:mt-0">
          {session?.user ? <SignOutButton /> : <SignInButton />}
        </div>
      </div>
    </nav>
  );
}
