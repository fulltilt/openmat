function CheckedCircle() {
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
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

export default function AuthSuccessPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "hsl(0, 0%, 97.5%)" }}
    >
      <div
        className="w-80 rounded-lg bg-white p-8 text-center"
        style={{ boxShadow: "0 4px 8px hsl(0, 0%, 70%)" }}
      >
        <div
          className="mb-8 grid items-center rounded-lg"
          style={{
            gridTemplateColumns: "auto 1fr",
            color: "hsl(124, 100%, 22%)",
            padding: "0rem 1rem",
          }}
        >
          <CheckedCircle />

          <p>{"Success! Please check your email inbox for sign in link."}</p>
        </div>
        <div>
          <p>
            {
              "Didn't receive an email? To go back to the sign-in page and try again, "
            }

            <a
              href="/api/auth/signin"
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              Click Here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
