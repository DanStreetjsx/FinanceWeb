# Dokploy deployment

Este frontend es una SPA de Vite/React servida con Nginx.

## Application

Configura el servicio como **Application** usando el repositorio del frontend.

- Repository: `FinanceWeb`
- Branch: `master`
- Build Path: `.`
- Dockerfile Path: `Dockerfile`
- Internal Port / Exposed Port: `80`

No uses `dist` como Build Path. `dist` se genera dentro del build de Docker.

## Environment

Vite inyecta variables en tiempo de build. Si cambias estas variables en Dokploy, ejecuta **Rebuild** con **Clean Cache**.

```env
VITE_API_URL=https://tu-backend.com/api
VITE_ENABLE_ADS=false
```

Si no configuras `VITE_API_URL`, el frontend usara el default de produccion definido en `src/config/api-config.ts`.

## Domains

Para abrir la app necesitas asignar un dominio o subdominio en la pestaña **Domains** de Dokploy.

Mientras no tengas dominio propio, usa una de estas opciones:

- Un subdominio temporal que apunte al servidor de Dokploy.
- Un dominio gratuito de pruebas.
- Un dominio real cuando lo compres/configures.

El Webhook URL de la pestaña **Deployments** no es la URL de la app. Ese endpoint solo sirve para disparar despliegues desde Git o Docker.

## SPA fallback

`nginx.conf` usa:

```nginx
try_files $uri $uri/ /index.html;
```

Esto evita errores 404 al entrar directamente a rutas como `/dashboard` o `/sign-in`.
