import type { LoaderFunctionArgs } from "react-router";

/**
 * Endpoint de debug para testear comentarios
 * GET /api/debug/comentarios-test?publicationId=1
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie");
  const url = new URL(request.url);
  const publicationId = url.searchParams.get("publicationId") || "1";

  console.log("[DEBUG COMMENTS] Test endpoint called");
  console.log("[DEBUG COMMENTS] PublicationId:", publicationId);
  console.log("[DEBUG COMMENTS] Cookie present:", !!cookie);

  try {
    const { getCommentsByPublicationService } = await import(
      "~/features/post/comments/commentService"
    );
    const { parseCommentsResponse } = await import(
      "~/features/post/comments/commentResponseParse"
    );

    if (!cookie) {
      return Response.json({
        error: "No cookie",
        publicationId,
      });
    }

    console.log("[DEBUG COMMENTS] Calling getCommentsByPublicationService...");
    const commentsFromBackend = await getCommentsByPublicationService(
      parseInt(publicationId),
      cookie
    );

    console.log(
      "[DEBUG COMMENTS] Raw response from backend:",
      JSON.stringify(commentsFromBackend).substring(0, 500)
    );

    const parsed = parseCommentsResponse(commentsFromBackend);

    console.log("[DEBUG COMMENTS] Parsed comments:", parsed.length);

    return Response.json({
      success: true,
      publicationId,
      rawComments: commentsFromBackend,
      parsedComments: parsed,
      count: parsed.length,
    });
  } catch (error) {
    console.error("[DEBUG COMMENTS] Error:", error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
        publicationId,
      },
      { status: 500 }
    );
  }
}
