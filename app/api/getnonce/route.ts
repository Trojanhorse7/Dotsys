import crypto from "crypto";
import { cookies } from "next/headers";

export async function GET(req: Request, res: Response) {
  const nonce = crypto.randomUUID();

  cookies().set("nonce", nonce);

  return Response.json({ nonce })
}