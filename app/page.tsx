import { Base } from "@/components/bible-viewer/Base";
import { Toaster } from "@/components/ui/toaster";
import dynamic from "next/dynamic";

//This prevents 'window' from throwing error on a server build
const DynamicScrollTo = dynamic(() => import("@/components/helpers/ScrollTo"), {
  ssr: false,
});

export default async function Index() {
  console.log("Index rendered", Date.now());
  return (
    <>
      <DynamicScrollTo />
      <div className="flex-1 w-full flex flex-col gap-2 items-center mb-28">
        <Base />
      </div>
      <Toaster />
    </>
  );
}
