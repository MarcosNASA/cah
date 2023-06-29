import type { Game } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getGameById(id: Game["id"]) {
  return prisma.game.findUnique({ where: { id }, include: { users: true } });
}

export async function createGame() {
  return prisma.game.create({ data: {} });
}
