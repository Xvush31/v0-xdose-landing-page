import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        playbackId: true,
        thumbnail: true, // ce champ doit exister ou être null
        status: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    return NextResponse.json({ videos });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération des vidéos" }, { status: 500 });
  }
} 