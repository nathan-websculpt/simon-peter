// import { createClient } from "@/utils/supabase/server";
// import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //TODO: Bring back when allowing sign-ups, look for // REMOVAL TAG::
  // const supabase = createClient();

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // if (!user) {
  //   return redirect("/login");
  // }

  return <>{children}</>;
}
