import {NextRequest, NextResponse} from 'next/server';
import {revalidatePath, revalidateTag} from "next/cache";

type Payload = {
  tag?: string | undefined;
  path?: string | undefined;
}

export const POST = async (req: NextRequest) => {

  // get api key from header
  const apiKey = req.headers.get('x-api-key');
  const API_KEY = process.env.STORE_API_KEY || '';
  if (apiKey !== API_KEY) {
    return NextResponse.json({status: 'error', message: 'Invalid API key'}, {status: 401});
  }

  const params = await req.json() as Payload;
  console.log("TESTX - params:", JSON.stringify(params));

  const revalidateTagKey = params.tag;
  const revalidatePathKey = params.path;

  if (revalidateTagKey) {
    console.log("TESTX - Revalidating tag", revalidateTagKey);
    revalidateTag(revalidateTagKey);
  }
  if (revalidatePathKey) {
    console.log("TESTX - Revalidating path", revalidatePathKey);
    revalidatePath(revalidatePathKey, "layout");
  }
  revalidatePath('/', 'layout')

  return NextResponse.json({status: 'ok'});
};