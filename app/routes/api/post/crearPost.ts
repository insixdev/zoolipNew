import { createPublicationService } from "~/features/post/postService";
import { PublicationCreateRequest } from "~/features/post/types";
import { field, getUserFieldFromCookie, getUserIdFromToken } from "~/lib/authUtil";

//action para crear post
export async function action({ request }) {
  const cookie = request.headers.get("Cookie");
  const userIdFormCookie= getUserFieldFromCookie(cookie, field.id);
  // fijarse si realetn  funca
  console.log("userIdFormCookie", userIdFormCookie);

  if(!userIdFormCookie){
    return {
      status: "error",
      message: "Unexpected error",
    }
  }
  const formData = await request.formData();
  const data= Object.fromEntries(formData);
  const postValidation = postBasicValidation(data)
  // fijarse si realetn  funca
  if(!postValidation.post){
    return {
      status: postValidation.status,
      message: postValidation.message,
    }
  }
  console.log("postValidation", postValidation);

  const postRequest= {
    topico: postValidation.post.topico,
    contenido: postValidation.post.contenido,
    likes: postValidation.post.likes,
    fecha_pregunta: Date.now().toString(),
    id_usuario: {
      id: userIdFormCookie
    } 
  } as PublicationCreateRequest
  const postRes = await createPublicationService(postRequest, cookie);
  
  console.log(data);
  return Response.json({status: "success", message: "Publicacion creada con éxito"},{status: postRes.httpCode});
}
function postBasicValidation(data ){
  if(!data){
    return {
      status: "error",
      message: "Unexpected error, no hay datos",
    }
  }
  try{
    const postData = data as PublicationCreateRequest
    if(postData.topico.length === 0 || postData.contenido.length === 0){
      if(postData.likes !== 0){
        return {
          status: "unexpected error",
          message: "Unexpected error",
        }
      }
      return {
        status: "error",
        message: "Error los datos no son correctos, tiene que tener contenido",
      }
    }
    return {
      status: "success",
      message: "Post validado con exito",
      post: postData
    }
  } catch(err){
    return {
      status: "error",
      message: "Error en procesar los datos de la publicacion, error: ${err}",
    }
  }

}

export async function loader() {
  return Response.json({ message: "Método no permitido" }, { status: 405 });
}
