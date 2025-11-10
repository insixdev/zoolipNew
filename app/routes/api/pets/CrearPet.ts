import { w } from "public/build/_shared/chunk-O7IRWV66";
import { addPetService } from "~/features/mascotas/petsService";

export async function action({request}){

  const formData = await request.formData();
  const role= formData.get("role");
  // los adoptantes podrian actualizar
  if(role !== "ADMINISTRADOR") // solo adminsitradores pueden ingresar nuevas mascotas  {}
  {
    return Response.json({
      message: "No tienes permiso para crear mascotas",
      status: "error",
    }, {status: 401});
  }

  try {

  // TODO: futuro servicio/endpoint de backend 
  const getIdInstitucionByIdUusario = 123;

  const pet = {
    size: formData.get("size"),
    adoptionState: formData.get("adoptionState"),
    healthState: formData.get("healthState"),
    age: formData.get("age"),
    race: formData.get("race"),
    species: formData.get("species"),
    id_institution: formData.get("id_institution"),
    name: formData.get("name"),
  };

  if(!pet){
    return Response.json({
      message: "Error al crear mascota, datos malformados",
      status: "error",
    }, {status: 401});
  }
  const cookie = request.headers.get("Cookie"); // la del navegador
  if(!cookie){
    return Response.json({
      message: "Error al crear mascota, no hay cookie",
      status: "error",
    }, {status: 401});
  }
  const res = await addPetService(pet, getIdInstitucionByIdUusario.toString());

  if(!res){
    return Response.json({
      message: "Error al crear mascota" ,
      status: "error",
    }, {status: 500});
  }
    return Response.json({
      message: res.message,
      status: res.status,
    },{status: res.httpCode});

  } catch(err) {
    console.error("Create pet error:", err); // internamente
    return Response.json({
      message: "Error al crear mascota",
      status: "error",
    }, {status: 500});
    
  }

}




