import {Button, toast} from "@medusajs/ui"
import {defineWidgetConfig} from "@medusajs/admin-sdk";
import {sdk} from "../lib/sdk";

const SaveProductChanges = () => {


  const sendRevalidateRequest = async () => {
    console.log("TESTX - SaveProductChanges request")
    toast.loading("Changes are being saved...")
    const backendUrl = process.env.NODE_ENV === 'development' ? "http://localhost:9000" : "https://backend-production-218c.up.railway.app";
    console.log("TESTX - backendUrl", backendUrl);
    await sdk.client.fetch(
      "/admin/revalidate",
      {method: "POST", body: {tag: "products"}},
    )
      .then(() => {
        console.log("TESTX - SaveProductChanges request success")
        toast.dismiss()
        toast.success("Changes applied to the storefront")
      })
      .catch((error) => {
        console.log("TESTX - SaveProductChanges request error", error)
        toast.dismiss()
        toast.error("Failed to apply changes to the storefront, if the issue persists please contact support")
      })
  }

  return (
    <div className={"flex w-full items-center justify-end"}>
      <Button onClick={sendRevalidateRequest}>
        Save Product Changes
      </Button>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "product.list.after",
})

export default SaveProductChanges
