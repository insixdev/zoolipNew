import { Post } from "~/components/community/indexCommunity/PostCard";
import { PublicationGetResponse } from "./types";


// parsear de publicacion response del backend prinicipal
// a los datos que se manejan en ssr/2servidor
export function postParseResponse(post: PublicationGetResponse[]) {
    try {

        //TODO: llenar de fomra smart los datos
        const newPosts: Post[] = post.map((post) => {
          
        const postFront: Post = {
            id: post.id_publicacion.toString(),
            topico: post.topico,
            content: post.contenido,
            likes: post.likes,
            fecha_creacion: post.fecha_pregunta,
            fecha_edicion: post.fecha_edicion,
            fecha_duda_resuelta: post.fecha_duda_resuelta,
            isSaved: false,
            isLiked: false,
            shares: 0,
            comments: 0, // getComentarioById 
            author: {
              username: "PERSONA", // name
              avatar: "masadelante"// cuando se hagga el gestor de imagenes
            },
            type: "text", // por ahora 

        };
        return postFront
        })
    return newPosts; 

  } catch (err) { 
    console.log("Error al parsear la publicacion", err);
    throw new Error("Error al parsear la publicacion"+ err)
  }
}

