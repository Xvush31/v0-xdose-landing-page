import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID!;
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET!;

export async function POST(req: NextRequest) {
  // Authentification et rôle
  const session = await getServerSession(authOptions);
  const user = session?.user as { id: string; role?: string } | undefined;
  if (!user || user.role !== "CREATOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { title } = await req.json();
  if (!title) {
    return NextResponse.json({ error: "Missing title" }, { status: 400 });
  }

  // Création de l'asset Mux
  const muxRes = await fetch("https://api.mux.com/video/v1/uploads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString("base64"),
    },
    body: JSON.stringify({
      new_asset_settings: { playback_policy: ["public"] },
      cors_origin: "*",
    }),
  });

  if (!muxRes.ok) {
    const error = await muxRes.text();
    return NextResponse.json({ error: "Mux error", details: error }, { status: 500 });
  }

  const muxData = await muxRes.json();
  const muxUploadId = muxData.data.id;
  const muxUrl = muxData.data.url;

  // Enregistrement en base
  const video = await prisma.video.create({
    data: {
      userId: user.id,
      muxUploadId,
      title,
      status: "pending",
    },
  });

  return NextResponse.json({ uploadUrl: muxUrl, videoId: video.id });
} 