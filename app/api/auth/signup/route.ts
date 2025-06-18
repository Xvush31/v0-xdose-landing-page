import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hash } from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { email, username, password, role } = await req.json()
    if (!email || !username || !password || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // Vérifie si l'email existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    // Hash du mot de passe
    const hashedPassword = await hash(password, 10)

    // Création de l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        name: username,
        password: hashedPassword,
        role,
      },
    })

    return NextResponse.json({ message: "User created", userId: user.id }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
} 