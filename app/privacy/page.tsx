"use client"

import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="backdrop-blur-lg bg-card/90 border-border/50 shadow-2xl">
            <CardContent className="p-8">
              <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
              
              <div className="prose prose-invert max-w-none space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                  <p className="text-muted-foreground">
                    Your privacy is important to us. This Privacy Policy explains how Xdose collects, uses, and protects your personal information.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                  <p className="text-muted-foreground">
                    We collect information you provide when you register, use our services, or contact support. This may include your email, username, wallet address, and any content you upload.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">3. Use of Information</h2>
                  <p className="text-muted-foreground">
                    We use your information to provide and improve our services, process payments, communicate with you, and ensure platform security.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">4. Data Sharing</h2>
                  <p className="text-muted-foreground">
                    We do not sell your personal information. We may share data with trusted third parties for payment processing, analytics, or legal compliance.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">5. Cookies & Tracking</h2>
                  <p className="text-muted-foreground">
                    We use cookies and similar technologies to enhance your experience and analyze usage. You can control cookies through your browser settings.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">6. Security</h2>
                  <p className="text-muted-foreground">
                    We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
                  <p className="text-muted-foreground">
                    You may access, update, or delete your personal information at any time by contacting support or using your account settings.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
                  <p className="text-muted-foreground">
                    We may update this Privacy Policy from time to time. We will notify you of any material changes via email or through the platform.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about this Privacy Policy, please contact us at support@xdose.com
                  </p>
                </section>

                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 