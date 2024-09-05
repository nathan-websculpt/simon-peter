import { createClient } from "./supabase/client";

export async function handleRPC(
  funtionToCall: string,
  queryParams: object
): object {
  const supabase = createClient();
  const { data, error } = await supabase.rpc(funtionToCall, queryParams);

  if (error) {
    console.error("Error calling stored procedure:", error);
    return null;
  }
  console.log("data from", funtionToCall, " was:", data[0]);

  return data[0];
}
