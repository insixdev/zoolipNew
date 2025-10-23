import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
//example
// route("about", routes/about"),
  // nested routes
  // route("about", "routes/about.tsx", [route("adoptar", "routes/adoptar.tsx")])
] satisfies RouteConfig;
