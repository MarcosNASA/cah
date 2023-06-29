import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";

import { CardType, Language, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CardSet = z.object({
  name: z.string(),
  white: z.array(
    z.object({
      text: z.string(),
    })
  ),
  black: z.array(
    z.object({
      text: z.string(),
      pick: z.number(),
    })
  ),
});
type CardSet = z.infer<typeof CardSet>;

const CardSets = z.array(CardSet);
type CardSets = z.infer<typeof CardSets>;

const rootPath = process.cwd();

async function seed() {
  await prisma.cardSet.deleteMany().catch(() => {});

  const cardSetsDirectory = path.resolve(
    path.join(rootPath, `/prisma/data/card-sets`)
  );
  const cardSetsDirectories = await fs.readdir(cardSetsDirectory);
  const cardSetsContent = await Promise.all(
    cardSetsDirectories.map((cardSetFile) =>
      fs.readFile(
        path.resolve(
          path.join(rootPath, `/prisma/data/card-sets/${cardSetFile}`)
        ),
        "utf-8"
      )
    )
  );
  const cardSets = CardSets.parse(
    cardSetsContent.map((cardSetContent) => JSON.parse(cardSetContent))
  );

  await Promise.all(
    cardSets.map((cardSet) =>
      prisma.cardSet.create({
        data: {
          name: cardSet.name,
          cards: {
            create: [
              ...cardSet.white.map((white) => ({
                type: CardType.WHITE,
                cardContent: {
                  create: [
                    {
                      content: white.text,
                      language: Language.ENGLISH,
                    },
                  ],
                },
              })),
              ...cardSet.black.map((black) => ({
                type: CardType.BLACK,
                pick: black.pick,
                cardContent: {
                  create: [
                    {
                      content: black.text,
                      language: Language.ENGLISH,
                    },
                  ],
                },
              })),
            ],
          },
        },
      })
    )
  );

  // await prisma.cards.createMany(cardSets);

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
