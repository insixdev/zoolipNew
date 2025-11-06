#!/usr/bin/env node

/**
 * Script para generar un JWT_SECRET seguro
 * Uso: node generate-jwt-secret.js
 */
console.log("JWT Secret generado:");
import {JWT_SECRET as secret} from "./constants";
console.log("");
console.log(`JWT_SECRET=${secret}`);
console.log("");
console.log("Copia esta línea a tu archivo .env para producción");
console.log("NUNCA compartas este secreto públicamente");
console.log("");
console.log("Para Docker en producción:");
console.log(`docker run -e JWT_SECRET="${secret}" ...`);
