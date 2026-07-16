# Cala Sublim — Gestión

App propia (fuera de Claude) para cargar gastos, ventas y stock, con tu propio link.

## Paso 1: crear la base de datos en Supabase

1. Entrá a https://supabase.com y creá una cuenta gratis.
2. Creá un proyecto nuevo (elegí una contraseña de base de datos y guardala).
3. Andá a **SQL Editor** > **New query**, pegá todo el contenido del archivo
   `supabase-schema.sql` de esta carpeta, y tocá **Run**. Esto crea las tablas
   de gastos, ventas y stock, con seguridad para que solo vos veas tus datos.
4. Andá a **Project Settings > API**. Ahí vas a ver:
   - **Project URL** → lo vas a usar como `VITE_SUPABASE_URL`
   - **anon public key** → lo vas a usar como `VITE_SUPABASE_ANON_KEY`

## Paso 2: configurar el proyecto

1. Copiá el archivo `.env.example` y renombralo a `.env`
2. Completá las dos variables con los datos del Paso 1

## Paso 3: probarlo en tu computadora (opcional)

Si tenés Node.js instalado:

```bash
npm install
npm run dev
```

Se abre en `http://localhost:5173`. La primera vez que entres, creá tu cuenta
con tu mail y una contraseña (botón "¿Primera vez? Creá tu cuenta").

## Paso 4: subir la web a internet (Vercel, gratis)

1. Subí esta carpeta a un repositorio de GitHub (podés arrastrar los archivos
   desde github.com/new sin usar la terminal).
2. Entrá a https://vercel.com, iniciá sesión con GitHub.
3. **Add New > Project**, elegí el repositorio.
4. En **Environment Variables**, agregá `VITE_SUPABASE_URL` y
   `VITE_SUPABASE_ANON_KEY` con los mismos valores de tu `.env`.
5. Tocá **Deploy**. En un par de minutos te da un link
   (ej: `cala-sublim.vercel.app`) que anda desde el celu o la compu.
6. Si querés tu propio dominio (ej: gestion.calasublim.com), en Vercel andá
   a **Settings > Domains** y seguí los pasos para conectarlo.

## Uso diario

Entrás al link, iniciás sesión con tu mail y contraseña, y cargás ventas,
gastos y stock igual que en la versión de Claude. Los datos ahora viven en
Supabase, no en esta conversación, así que están disponibles desde
cualquier dispositivo.
