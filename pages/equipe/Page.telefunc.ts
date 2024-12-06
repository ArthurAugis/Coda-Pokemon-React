import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const onSaveSlot = async (slot: number, pokemon: string | null, isShiny: boolean) => {
  const teamSlot = await prisma.teamSlot.upsert({
    where: { slot },
    update: { pokemon, isShiny },
    create: { slot, pokemon, isShiny },
  });
  return teamSlot;
};

export const getTeam = async () => {
  const team = await prisma.teamSlot.findMany();
  return team;
};

export const onDeleteSlot = async (slot: number) => {
  await prisma.teamSlot.delete({
    where: { slot },
  });
  return { slot };
};
