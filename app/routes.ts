import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Home page
  index("routes/home.tsx"),
  
  // Auth routes
  route("login", "routes/auth/login.tsx"),
  route("register", "routes/auth/register.tsx"),
  
  // Main app routes
  /* route("adopt", "routes/adopt.tsx"),
  route("community", "routes/community.tsx"),
  route("about", "routes/about.tsx"), */
  
  // Legal routes
 /*  route("terms", "routes/terms.tsx"),
  route("privacy", "routes/privacy.tsx"), */
  
  // Future routes (commented for now)
  // route("forgot-password", "routes/auth/forgot-password.tsx"),
  // route("dashboard", "routes/dashboard.tsx"),
  // route("profile", "routes/profile.tsx"),
] satisfies RouteConfig;
