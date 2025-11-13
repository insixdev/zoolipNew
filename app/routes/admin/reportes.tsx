// Este archivo es temporal y será eliminado
// Redirige a dashboard
import { redirect } from "react-router";

export async function loader() {
  return redirect("/admin/dashboard");
}

export default function Reportes() {
  return null;
}
