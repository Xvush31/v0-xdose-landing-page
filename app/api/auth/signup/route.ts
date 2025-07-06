import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hash } from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { 
      email, 
      username, 
      password, 
      role, 
      bio, 
      avatar, 
      twitter, 
      instagram, 
      wallet 
    } = await req.json()
    
    if (!email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Vérifie si l'email existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    // Si un username est fourni, vérifie qu'il est unique
    if (username) {
      const existingUsername = await prisma.user.findFirst({ where: { name: username } })
      if (existingUsername) {
        return NextResponse.json({ error: "Username already taken" }, { status: 409 })
      }
    }

    // Hash du mot de passe
    const hashedPassword = await hash(password, 10)

    // Création de l'utilisateur avec les champs de profil optionnels
    const user = await prisma.user.create({
      data: {
        email,
        name: username || `user_${Date.now()}`, // Username par défaut si non fourni
        password: hashedPassword,
        role,
        // Champs de profil optionnels
        bio: bio || null,
        image: avatar || null, // Utilise le champ 'image' pour l'avatar
        twitter: twitter || null,
        instagram: instagram || null,
        wallet: wallet || null, // Adresse wallet pour les paiements crypto
      }
    })

    return NextResponse.json({ 
      message: "User created successfully", 
      userId: user.id,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        bio: user.bio,
        image: user.image,
        twitter: user.twitter,
        instagram: user.instagram,
        wallet: user.wallet,
      }
    }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
} 