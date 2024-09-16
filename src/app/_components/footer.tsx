"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex w-full items-center justify-center bg-black p-4 text-center text-[10px] font-semibold text-white">
      <div className="container flex flex-col items-center justify-between px-4 md:flex-row md:px-6">
        <p className="mb-4 text-sm text-gray-600 md:mb-0">
          © 2023 BJJ Open Mat Finder. All rights reserved.
        </p>
        <nav className="flex gap-4">
          {/* <Link className="text-sm text-gray-600 hover:text-blue-600 transition-colors" href="#">
              Terms of Service
            </Link> */}
          <Link
            className="text-sm text-gray-600 transition-colors hover:text-blue-600"
            href="privacy"
          >
            Privacy Policy
          </Link>
          {/* <Link className="text-sm text-gray-600 hover:text-blue-600 transition-colors" href="#">
              Contact Us
            </Link> */}
        </nav>
      </div>
    </footer>
  );
}
