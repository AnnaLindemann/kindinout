// src/app/api/user/route.ts
import { Role, Prisma } from "@prisma/client"; // [CHANGED] добавил Prisma для типобезопасной проверки P2002
import { NextResponse } from "next/server";
import { z, ZodError } from "zod"; // [CHANGED] добавил ZodError для корректной проверки

import prisma from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ✅ Принимаем строку в любом регистре, нормализуем в lowercase и проверяем по enum
// [CHANGED] используем preprocess + nativeEnum(Role) вместо ручной refine по массиву
const CreateUserSchema = z.object({
  email: z.string().email(),
  role: z
    .preprocess((v) => (typeof v === "string" ? v.toLowerCase() : v), z.nativeEnum(Role))
    .optional(), // если role обязателен в модели — убери optional()
});

// ── GET: список пользователей ────────────────────────────────────────────────
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ users }, { status: 200 });
  } catch (err: unknown) {
    // [CHANGED] any → unknown (линтер доволен)
    console.error("[GET /api/user]", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// ── POST: создать пользователя с устойчивой нормализацией роли ───────────────
export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = CreateUserSchema.parse(json);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        ...(data.role ? { role: data.role as Role } : {}), // приведение к enum типа
      },
      select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err: unknown) {
    // [CHANGED] any → unknown, ниже — типобезопасные проверки
    // сначала — ошибки валидации входных данных
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "Invalid payload", issues: err.issues }, { status: 400 });
    }
    // затем — известные ошибки Prisma (например, уникальный индекс email)
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    // прочие ошибки — 500
    console.error("[POST /api/user]", err);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
