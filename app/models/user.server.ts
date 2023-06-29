import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByName(name: User["name"]) {
  return prisma.user.findUnique({ where: { name } });
}

export async function createUser(user: {
  name: User["name"];
  gameId: User["gameId"];
}) {
  return prisma.user.create({
    data: user,
  });
}
