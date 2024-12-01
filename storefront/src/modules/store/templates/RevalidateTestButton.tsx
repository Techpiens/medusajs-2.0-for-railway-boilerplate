"use client"

import { Button } from "@medusajs/ui"
import { testRevalidateTags } from "../../../backend/server-actions/testRevalidateTags"

export default function RevalidateTestButton() {

  const revalidateTags = async () => {
    console.log("TESTX - revalidateTag client")
    await testRevalidateTags()
    console.log("TESTX - tag revalidated client")
  }

  return (
    <Button onClick={revalidateTags}>
      Revalidate Tags
    </Button>
  )
}