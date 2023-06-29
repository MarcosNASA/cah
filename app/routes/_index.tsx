import type { V2_MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: V2_MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative mx-auto max-w-7xl shadow-xl sm:overflow-hidden sm:rounded-2xl sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-white mix-blend-multiply" />
        </div>
        <div className="relative px-4 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-32">
          <h1 className="text-center text-4xl font-extrabold tracking-tight text-gray-500 drop-shadow-md sm:text-5xl lg:text-6xl">
            CARDS AGAINST HUMANITY
          </h1>
          <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
            <Link
              to="/join"
              className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:px-8"
            >
              New game
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
