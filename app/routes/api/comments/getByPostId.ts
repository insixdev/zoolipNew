import { getCommentByIdService } from "../../../features/post/comments/commentService";
import { CommentGetResponse } from "../../../features/post/comments/types";
// cuando se haga click cargar comentarios de esa publicaicon
export async function action(
  {request}
){

  const formData = await request.formData();
  try {

  const postId= formData.get("id_publicacion")
  const cookie = request.headers.get("Cookie");
  // se hara esto cuando elback ponga postId
  const comments = await getCommentByIdService(postId, cookie);
  return Response.json(comments, {status: 200});

  } catch (err) {
    console.error("Get all comments error:", err);
    return Response.json({message: "Error al obtener comentario", status: "error"}, {status: 400})
  }

}
