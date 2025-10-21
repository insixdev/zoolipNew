
// app/routes/api/auth/login.ts
import { ActionFunction, json, redirect } from "@remix-run/node";
import { loginService, type UserRequest } from "~/features/auth/authService.js";
import { getAuthToken } from "~/server/cookies.js";
import { handleLogin } from "~/server/loginServer.js";
// 
export const action: ActionFunction = async ( { request  }) => {
  const {username, password} = await request.json();
  try {
    const user = await handleLogin({ username, password }); 
    return json({ user })
  }
  catch(err){
    return json({ error: err.message }, { status: 401 });
  }
};
