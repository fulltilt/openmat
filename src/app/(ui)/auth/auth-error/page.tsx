function ExclamationTriangle() {
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
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
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
            color: "hsl(0, 100%, 50%)",
            padding: "0rem 1rem",
          }}
        >
          <ExclamationTriangle />

          <p>{"Oops, something went wrong."}</p>
        </div>
        <div>
          <p>
            {"To go back to the sign in page,"}

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
