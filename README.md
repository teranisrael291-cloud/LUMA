# LUMA — Vercel-ready static site

Sitio estático en HTML/CSS/JS. No requiere build.

## Despliegue en Vercel

1. Sube esta carpeta a un repositorio de GitHub, GitLab o Bitbucket.
2. En Vercel selecciona **Add New → Project** e importa el repositorio.
3. Framework Preset: **Other**.
4. Build Command: dejar vacío.
5. Output Directory: dejar vacío.
6. Deploy.

También puedes usar Vercel CLI desde esta carpeta:

```bash
npx vercel
```

## Personalización rápida

- Cambia textos en `index.html`.
- Ajusta colores y espaciado en `styles.css`.
- Las imágenes usan URLs de Unsplash para mantener el proyecto ligero. Para producción, conviene descargar y optimizar las imágenes en `/assets`.
- Cambia `hello@luma.agency` por el correo real.
