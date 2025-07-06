"use client"

import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default function TermsPage() {
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
              <h1 className="text-4xl font-bold mb-6 text-center">Terms of Service</h1>
              
              <div className="prose prose-invert max-w-none space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground">
                    By accessing and using Xdose, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                  <p className="text-muted-foreground">
                    Xdose is a premium crypto payment platform that connects creators with their fans through exclusive content, 
                    subscriptions, and direct payments using cryptocurrency.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                  <p className="text-muted-foreground">
                    You are responsible for maintaining the confidentiality of your account credentials and for all activities 
                    that occur under your account. You must be at least 18 years old to use this service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">4. Content Guidelines</h2>
                  <p className="text-muted-foreground">
                    All content must comply with our community guidelines. Prohibited content includes but is not limited to:
                    illegal activities, harassment, explicit content without proper age verification, and copyright infringement.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">5. Crypto Payments</h2>
                  <p className="text-muted-foreground">
                    All transactions are conducted in cryptocurrency. We are not responsible for fluctuations in crypto values 
                    or network fees. Users are responsible for their own wallet security.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">6. Platform Fees</h2>
                  <p className="text-muted-foreground">
                    Xdose charges a small percentage fee on all transactions to maintain the platform. These fees are clearly 
                    displayed before each transaction.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">7. Privacy</h2>
                  <p className="text-muted-foreground">
                    Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, 
                    and protect your information.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
                  <p className="text-muted-foreground">
                    We reserve the right to terminate or suspend your account at any time for violations of these terms 
                    or for any other reason at our sole discretion.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
                  <p className="text-muted-foreground">
                    We may update these terms from time to time. We will notify users of any material changes via email 
                    or through the platform.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about these Terms of Service, please contact us at support@xdose.com
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