import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useRef } from "react";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { createGame, getGameById } from "~/models/game.server";

import { createUser, getUserById, getUserByName } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  const hasUserId = !!userId;
  if (hasUserId) {
    const user = await getUserById(userId);
    const hasUser = !!user;
    if (!hasUser) return json({});
    const { gameId } = user;
    return redirect(`/room/${gameId}`);
  }
  return json({});
};

const FormData = zfd.formData({
  name: z.string(),
});

export const action = async ({ request, params }: ActionArgs) => {
  const formData = await request.formData();
  const formDataParseResult = FormData.safeParse(formData);
  if (!formDataParseResult.success) {
    return json({ errors: { name: "Name is required" } }, { status: 400 });
  }
  const {
    data: { name },
  } = formDataParseResult;

  const existingUser = await getUserByName(name);
  if (existingUser) {
    return json(
      {
        errors: {
          name: "A user already exists with this name",
          password: null,
        },
      },
      { status: 400 }
    );
  }

  const { gameId: gameIdFromParams = "" } = params;
  const hasGameIdFromParams = !!gameIdFromParams;
  const game = hasGameIdFromParams
    ? (await getGameById(gameIdFromParams)) ?? (await createGame())
    : await createGame();
  const { id: gameId } = game;
  const user = await createUser({ name, gameId });

  return createUserSession({
    redirectTo: `/room/${gameId}`,
    remember: false,
    request,
    userId: user.id,
  });
};

export const meta: V2_MetaFunction = () => [{ title: "Sign Up" }];

export default function Join() {
  const actionData = useActionData<typeof action>();
  const nameRef = useRef<HTMLInputElement>(null);

  const isNameEmpty = !nameRef.current?.value;
  const isNameError = !!actionData?.errors?.name;

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <div className="mt-1">
              <input
                ref={nameRef}
                id="name"
                required
                autoFocus={isNameEmpty || isNameError}
                name="name"
                type="name"
                autoComplete="name"
                aria-invalid={actionData?.errors?.name ? true : undefined}
                aria-describedby="name-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.name ? (
                <div className="pt-1 text-red-700" id="name-error">
                  {actionData.errors.name}
                </div>
              ) : null}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Join game
          </button>
        </Form>
      </div>
    </div>
  );
}
