import { createFileRoute } from "@tanstack/react-router";
import { ManualApp } from "@/components/manual-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <ManualApp />;
}
