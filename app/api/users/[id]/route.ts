import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  if (!userId) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        createdAt: true,
        bio: true,
        cover: true,
        location: true,
        website: true,
        twitter: true,
        instagram: true,
        birthdate: true,
        isVerified: true,
        customLinks: true,
        videos: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            playbackId: true,
            thumbnail: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération du profil utilisateur" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  if (!userId) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as { id: string; role?: string } | undefined;
  if (!sessionUser || sessionUser.id !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const data = await req.json();
  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        bio: data.bio,
        image: data.image,
        cover: data.cover,
        location: data.location,
        website: data.website,
        twitter: data.twitter,
        instagram: data.instagram,
        birthdate: data.birthdate ? new Date(data.birthdate) : undefined,
        customLinks: data.customLinks,
      },
    });
    return NextResponse.json({ user: updated });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour du profil" }, { status: 500 });
  }
} 