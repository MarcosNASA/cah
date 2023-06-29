import { User } from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { getGameById } from "~/models/game.server";
import { getUserById } from "~/models/user.server";

import { getUserId, logout } from "~/session.server";

const Params = z.object({
  gameId: z.string(),
});

type LoaderData = {
  users: User[];
};
export const loader = async ({ request, params }: LoaderArgs) => {
  const parsedParamsResult = Params.safeParse(params);
  const { success } = parsedParamsResult;
  if (!success) {
    return redirect(`/`);
  }
  const {
    data: { gameId: gameIdFromParams },
  } = parsedParamsResult;
  const userId = await getUserId(request);
  const hasUserIdFromSession = !!userId;
  if (!hasUserIdFromSession) return redirect(`/join/${gameIdFromParams}`);
  const user = await getUserById(userId);
  const hasUser = !!user;
  if (!hasUser) {
    logout(request);
    return redirect(`/join/${gameIdFromParams}`);
  }
  const { gameId } = user;
  const game = await getGameById(gameId);
  const hasGame = !!game;
  if (!hasGame) {
    logout(request);
    return redirect(`/join/${gameId}`);
  }
  const { users } = game;
  return json({ users });
};

export const action = async ({ request, params }: ActionArgs) => {
  const parsedParamsResult = Params.safeParse(params);
  const { success } = parsedParamsResult;
  if (!success) {
    return redirect(`/`);
  }
  const {
    data: { gameId: gameIdFromParams },
  } = parsedParamsResult;
  return redirect(`/game/${gameIdFromParams}`);
};

export const meta: V2_MetaFunction = () => [{ title: "CAH - Room" }];

export default function Join() {
  const { users } = useLoaderData<LoaderData>();
  return (
    <div>
      <h2>Room</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <div>Waiting for other players...</div>

      <form>
        <button>Start game</button>
      </form>
    </div>
  );
}
