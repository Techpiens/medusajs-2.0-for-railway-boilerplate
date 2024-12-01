"use server"

import { revalidateTag } from "next/cache"

export async function testRevalidateTags() {
  console.log("TESTX - revalidateTag")
  revalidateTag("products")
  console.log("TESTX - tag revalidated")
}
