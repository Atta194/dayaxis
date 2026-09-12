import { createFileRoute } from "@tanstack/react-router";

import "../brand.css";
import Shell from "../components/da-shell";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <Shell />;
}