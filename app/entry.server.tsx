import type { RenderToPipeableStreamOptions } from "react-dom/server";
import { renderToPipeableStream } from "react-dom/server";
import { ServerRouter } from "react-router";

import type { Route } from "./+types/root";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: Route.LoaderArgs["context"],
  options?: RenderToPipeableStreamOptions
) {
  return new Promise((resolve, reject) => {
    let didError = false;
    
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        ...options,
        onShellReady() {
          responseHeaders.set("Content-Type", "text/html");
          
          const body = new ReadableStream({
            start(controller) {
              import("stream").then(({ Writable }) => {
                const writable = new Writable({
                  write(chunk: any, _encoding: string, callback: () => void) {
                    controller.enqueue(chunk);
                    callback();
                  },
                  final(callback: () => void) {
                    controller.close();
                    callback();
                  },
                });
                
                writable.on("error", (error: Error) => {
                  didError = true;
                  console.error("Stream error:", error);
                  controller.error(error);
                });
                
                pipe(writable);
              }).catch((error) => {
                console.error("Import error:", error);
                controller.error(error);
              });
            },
          });

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          );
        },
        onShellError(error: unknown) {
          console.error("Shell error:", error);
          reject(error);
        },
        onError(error: unknown) {
          didError = true;
          console.error("Render error:", error);
        },
      }
    );

    setTimeout(abort, 10000);
  });
}