import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { getUserId } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  const hasUserId = !!userId;
  if (!hasUserId) return redirect("/join");
  return json({});
};

export const action = async ({ request, params }: ActionArgs) => {};

export const meta: V2_MetaFunction = () => [{ title: "Sign Up" }];

export default function Game() {
  return <>Game</>;
}
