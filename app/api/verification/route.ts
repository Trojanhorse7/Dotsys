import jwt from "jsonwebtoken";
import { verifySIWS } from "@talismn/siws";
import { cookies } from "next/headers";

export async function POST(req: Request, res: Response) {
  try {
    const data = await req.json()
    const nonce = cookies().get('nonce')
    if (!nonce) return new Response(`Invalid Session`, {status: 401})

    const { signature, message, address } = data;

    const siwsMessage = await verifySIWS(message, signature, address);
    console.log(siwsMessage, nonce)
    
    if (nonce.value !== siwsMessage.nonce) {
      return new Response(`Unknown nonce`, {status: 401})
    };

    const jwtPayload = {address: siwsMessage.address};

    const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRETCODE!, {
      algorithm: "HS256",
    });

    return Response.json({jwtToken})
  } catch (e: any) {
    return new Response( JSON.stringify({error: e.message}) , {status: 401})
  }
}