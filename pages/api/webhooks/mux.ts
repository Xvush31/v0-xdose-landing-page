import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { VideoStatus } from "@prisma/client";
import crypto from "crypto";
// @ts-ignore
import getRawBody from "raw-body";

const MUX_WEBHOOK_SECRET = process.env.MUX_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

function verifyMuxSignature(header: string, body: string, secret: string): boolean {
  // Mux envoie: t=<timestamp>,v1=<signature>
  const timestampMatch = header.match(/t=([^,]+)/);
  const signatureMatch = header.match(/v1=([a-f0-9]+)/);

  if (!timestampMatch || !signatureMatch) {
    return false;
  }

  const timestamp = timestampMatch[1];
  const receivedSignature = signatureMatch[1];
  const signedPayload = `${timestamp}.${body}`;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  // Comparaison sécurisée
  const receivedBuf = Buffer.from(receivedSignature, 'hex');
  const expectedBuf = Buffer.from(expectedSignature, 'hex');

  if (receivedBuf.length !== expectedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(receivedBuf, expectedBuf);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const signature = req.headers["mux-signature"] as string;
  const body = await getRawBody(req, {
    length: req.headers["content-length"],
    limit: "1mb",
    encoding: "utf-8",
  });

  if (!signature || !verifyMuxSignature(signature, body, MUX_WEBHOOK_SECRET)) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const event = JSON.parse(body.toString());
  const { type, data } = event;
  const assetId = data?.id || data?.asset_id;
  const uploadId = data?.upload_id;
  const playbackId = Array.isArray(data?.playback_ids) && data.playback_ids.length > 0 ? data.playback_ids[0].id : undefined;

  if (!assetId) {
    return res.status(400).json({ error: "Missing asset id" });
  }

  let status: VideoStatus | undefined;
  if (type === "video.asset.created") status = VideoStatus.pending;
  if (type === "video.asset.ready") status = VideoStatus.ready;
  if (type === "video.asset.errored") status = VideoStatus.errored;
  if (type === "video.upload.asset_created") status = VideoStatus.pending;

  if (status) {
    if (uploadId) {
      // Premier event : on fait le lien via l'uploadId et on renseigne muxAssetId et playbackId
      await prisma.video.updateMany({
        where: { muxUploadId: uploadId },
        data: { muxAssetId: assetId, status, ...(playbackId && { playbackId }) },
      });
      console.log(`[MUX WEBHOOK] (uploadId) Asset ${assetId} mis à jour avec le statut: ${status} et playbackId: ${playbackId}`);
    } else {
      // Events suivants : on fait le lien via muxAssetId
      await prisma.video.updateMany({
        where: { muxAssetId: assetId },
        data: { status, ...(playbackId && { playbackId }) },
      });
      console.log(`[MUX WEBHOOK] (assetId) Asset ${assetId} mis à jour avec le statut: ${status} et playbackId: ${playbackId}`);
    }
  } else {
    console.log(`[MUX WEBHOOK] Événement non géré: ${type}`);
  }

  return res.status(200).json({ received: true });
} 