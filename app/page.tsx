import { Base } from "@/components/bible-viewer/Base";
import dynamic from "next/dynamic";

//This prevents 'window' from throwing error on a server build
const DynamicScrollTo = dynamic(() => import("@/components/helpers/ScrollTo"), {
  ssr: false,
});

export default async function Index() {
  return (
    <>
      <DynamicScrollTo />
      <div className="flex-1 w-full flex flex-col gap-20 items-center mb-28">
        {/* <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          {isSupabaseConnected && <AuthButton />}
        </div>
      </nav> */}

        <div className="flex flex-row mt-6">
          <Base />
        </div>

        {/* <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p></p>
      </footer> */}
      </div>
    </>
  );
}
