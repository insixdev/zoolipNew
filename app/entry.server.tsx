
import { renderToString } from "react-dom/server";
import { RemixServer } from "@remix-run/react";
import type { EntryContext } from "@remix-run/node";

export default function handleRequest(
  request: Request,
  statusCode: number,
  headers: Headers,
  remixContext: EntryContext
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  headers.set("Content-Type", "text/html");

  // Usamos la Response global
  return new Response("<!DOCTYPE html>" + markup, {
    status: statusCode,
    headers,
  });
}

