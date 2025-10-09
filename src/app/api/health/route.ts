import prisma from "@/lib/db";

export async function GET() {
  const [row] = await prisma.$queryRaw<{ "?column?": number }[]>`SELECT 1`;

  const isOk = row && Object.values(row)[0] === 1;

  return Response.json({ ok: isOk }, { status: isOk ? 200 : 500 });
}
