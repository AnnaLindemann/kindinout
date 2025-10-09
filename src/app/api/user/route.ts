import { Role, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

import prisma from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// role обязателен, приводим к lowercase и валидируем по enum из Prisma
const CreateUserSchema = z.object({
  email: z.string().email(),
  role: z.preprocess((v) => (typeof v === "string" ? v.toLowerCase() : v), z.nativeEnum(Role)),
});

// ── GET: список пользователей ───────────────────────────────
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ users }, { status: 200 });
  } catch (err: unknown) {
    console.error("[GET /api/user]", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// ── POST: создать пользователя ───────────────────────────────
export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = CreateUserSchema.parse(json);

    // В схеме role обязателен → формируем полный объект под UserCreateInput
    const createData: Prisma.UserCreateInput = {
      email: data.email,
      role: data.role as Role,
    };

    const user = await prisma.user.create({
      data: createData,
      select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "Invalid payload", issues: err.issues }, { status: 400 });
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    console.error("[POST /api/user]", err);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
