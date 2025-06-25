import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const creators = await prisma.user.findMany({
      where: { role: "CREATOR" },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
      },
    });
    return NextResponse.json({ creators });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération des creators" }, { status: 500 });
  }
} 