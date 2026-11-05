# Sprint: Gran Salon Ferretero

## Objetivo

Adaptar la experiencia de la feria de madera para usarla en el Gran Salon Ferretero, dejando disponible el registro de contactos sin ruleta ni accesos publicos al catalogo o al folleto digital.

## Cambios realizados

- La pantalla inicial muestra la feria y una unica accion publica: registrar datos.
- El formulario conserva datos de contacto y autorizaciones, cambia los tipos de negocio a opciones relevantes para el publico ferretero y permite escribir productos de interes como texto libre opcional.
- Cada registro de esta feria se guarda con `modulo: 'registro'` y la etiqueta `gran_salon_ferretero`.
- Los registros se cuentan por separado en el panel administrativo. El campo de productos de interes se muestra en la tabla y se exporta con los otros datos del lead.
- Siete toques rapidos al logo abren el panel administrativo. Cuando el backend es la API, el panel solicita el PIN configurado.
- El titulo del navegador identifica el Gran Salon Ferretero.

## Persistencia y Supabase

La aplicacion contempla tres backends, seleccionados en `src/hooks/useLeads.js`:

- `local`: guarda registros en `localStorage` como respaldo/desarrollo local.
- `supabase`: inserta desde el navegador usando `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
- `api`: usa `/api/leads`; en produccion es el backend predeterminado. La funcion `api/leads.js` usa `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en el servidor. La consulta y el borrado del panel requieren `SUPABASE_ADMIN_PIN`.

El mapeo de `productoInteres` a la columna `producto_interes` y de regreso esta en `src/services/leadMapping.js`. La tabla `public.leads` contiene esa columna.

### SQL para crear o recuperar el esquema

El archivo SQL del repositorio es `supabase/schema.sql`; no existe actualmente una carpeta de migraciones versionadas. El archivo crea `public.leads` si no existe, actualiza el constraint para aceptar `registro`, habilita RLS y recrea las dos politicas de insercion de forma repetible.

Para recuperar la tabla cuando el proyecto Supabase aun existe, ejecutar `supabase/schema.sql` en el SQL Editor del proyecto. Si se elimino el proyecto Supabase completo, primero crear un proyecto nuevo desde la cuenta de Supabase y ejecutar el mismo archivo en su SQL Editor. Crear un proyecto nuevo no recupera los registros de la base eliminada; se necesita un backup para restaurarlos.

El SQL solo configura el esquema de base de datos. No conecta la app automaticamente: configurar las variables de entorno documentadas abajo y desplegar/reiniciar la app. No asumir que actualizar el archivo local modifica el proyecto remoto.

## Configuracion pendiente

- No hay `.env` local con credenciales en este workspace; solo existe `.env.example`.
- Por esa razon no se ha confirmado una insercion real en Supabase ni la consulta remota del panel. La vista local puede usar `localStorage` y mostrar un registro sin que este haya llegado a la base remota.
- Para Vercel, configurar `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` y `SUPABASE_ADMIN_PIN`; en produccion la app usa `/api/leads`.
- Para desarrollo con Supabase directo, configurar `VITE_LEADS_BACKEND=supabase`, `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
- Despues de configurar el backend y actualizar el constraint remoto, enviar un registro de prueba y verificar que aparece en el panel/exportacion antes de la feria.

## Verificacion realizada

- `npm run build` finaliza correctamente.
- Se comprobo en navegador que el formulario muestra el campo libre de productos de interes y que siete toques al logo abren el panel.
- No se envio un registro de prueba a una base remota porque no hay credenciales locales disponibles.
