import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { VideoStatus } from "@prisma/client";

const MUX_WEBHOOK_SECRET = process.env.MUX_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false, // Important : on veut le body RAW
  },
};

function verifyMuxSignature(header: string, body: string, secret: string): boolean {
  // Mux envoie souvent: v1=xxxxxxx[,v2=yyyyy]
  const match = header.match(/v1=([a-f0-9]+)/);
  if (!match) return false;
  const receivedSignature = match[1];
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  // Comparaison sécurisée
  return crypto.timingSafeEqual(Buffer.from(receivedSignature, 'utf8'), Buffer.from(expected, 'utf8'));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Webhook Mux reçu avec méthode :", req.method);
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let rawBody = "";
  req.on("data", (chunk) => {
    rawBody += chunk;
  });

  req.on("end", async () => {
    const signature = req.headers["mux-signature"] as string | undefined;

    // Logging debug
    console.log("[MUX WEBHOOK] Signature reçue:", signature);
    console.log("[MUX WEBHOOK] Body:", rawBody);
    console.log("[MUX WEBHOOK] Secret utilisé:", MUX_WEBHOOK_SECRET);

    if (!signature || !verifyMuxSignature(signature, rawBody, MUX_WEBHOOK_SECRET)) {
      console.error("[MUX WEBHOOK] Signature invalide !");
      return res.status(401).json({ error: "Invalid signature" });
    }

    let event;
    try {
      event = JSON.parse(rawBody);
    } catch (err) {
      return res.status(400).json({ error: "Invalid JSON" });
    }

    const type = event.type;
    const assetId = event.data?.id || event.data?.asset_id;

    if (!assetId) {
      return res.status(400).json({ error: "Missing asset id" });
    }

    let status: VideoStatus | undefined;
    if (type === "video.asset.created") status = VideoStatus.pending;
    if (type === "video.asset.ready") status = VideoStatus.ready;
    if (type === "video.asset.errored") status = VideoStatus.errored;

    if (status) {
      await prisma.video.updateMany({
        where: { muxAssetId: assetId },
        data: { status },
      });
    }

    return res.status(200).json({ received: true });
  });
} 