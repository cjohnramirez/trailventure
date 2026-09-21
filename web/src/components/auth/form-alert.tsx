import { CircleAlertIcon, CircleCheckIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

/** Form-level feedback: an error the fields can't show, or a neutral/success note. */
export function FormAlert({
  message,
  tone = "error",
}: {
  message?: string | null;
  tone?: "error" | "success";
}) {
  if (!message) return null;
  return (
    <Alert variant={tone === "error" ? "destructive" : "default"}>
      {tone === "error" ? <CircleAlertIcon /> : <CircleCheckIcon className="text-success" />}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
