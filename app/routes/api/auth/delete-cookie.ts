
import { createCookie, redirect } from "react-router";
// definís tu cookie (debe tener el mismo nombre que la original)
export const authCookie = createCookie("AUTH_COOKIE", {
  secure: true,
  sameSite: "lax",
  path: "/",
  httpOnly: true,
});

export async function action({request}) {
  try{
  // Devolvés un redirect con la cabecera para eliminar cookie
  return redirect("/login", {
    headers: {
      "Set-Cookie": await authCookie.serialize("", { maxAge: 0 }),
    },
  });

  }catch(err){
    console.error("Delete cookie error:", err);
    return redirect("/login");
  }
}

