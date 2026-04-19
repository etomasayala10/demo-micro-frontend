# Microfrontend Demo — Angular 19 Shell + Vue 3.5 Remote

Arquitectura Microfrontend usando **Module Federation** (Webpack 5 + Vite Federation Plugin) con estado compartido entre frameworks.

## Arquitectura

```
┌──────────────────────────────────────────────────────┐
│              NAVEGADOR  (localhost:4200)               │
│                                                        │
│  ┌─────────────┐  ┌─────────────────────────────────┐ │
│  │   SIDEBAR   │  │          CONTENIDO              │ │
│  │  (Angular)  │  │                                 │ │
│  │             │  │  /dashboard  -> Angular          │ │
│  │ * Dashboard │  │  /analytics  -> Angular          │ │
│  │ * Analytics │  │  /products   -> Vue MFE (:3000)  │ │
│  │ * Productos │  │  /settings   -> Vue MFE (:3000)  │ │
│  │ * Config    │  │                                 │ │
│  └─────────────┘  └─────────────────────────────────┘ │
│                                                        │
│  SharedStateService  <──bridge──>  Vue provide/inject  │
└──────────────────────────────────────────────────────┘
         ↕ ES Module dynamic import + Vite Federation
┌──────────────────────────────────────────────────────┐
│            VUE REMOTE  (localhost:3000)                │
│                                                        │
│  Expone:                                               │
│    ./ProductsMount  -> mount(el, bridge)               │
│    ./SettingsMount  -> mount(el, bridge)               │
└──────────────────────────────────────────────────────┘
```

## Stack tecnologico

| Componente | Tecnologia | Version |
|------------|------------|---------|
| Shell (Host) | Angular | 19 |
| Remote MFE | Vue | 3.5 |
| Bundler Shell | Webpack | 5 |
| Bundler Remote | Vite | 5 |
| Federation | Module Federation + @originjs/vite-plugin-federation | - |
| Estado compartido | SharedStateService (pub/sub bridge) | - |

## Paginas

| Ruta | Framework | Descripcion |
|------|-----------|-------------|
| `/login` | Angular | Login con guard de autenticacion |
| `/dashboard` | Angular | KPIs, grafico de barras, tabla actividad |
| `/analytics` | Angular | Funnel, donut, heatmap, ranking equipo |
| `/products` | **Vue MFE** | Catalogo con filtros, modal, stock |
| `/settings` | **Vue MFE** | Perfil, notificaciones, apariencia, seguridad |

**Credenciales demo:** `admin@mfe.com` / `admin123`

---

## Configuracion por proyecto

Cada sub-proyecto tiene su propio README con instrucciones detalladas de configuracion:

- **[Angular Shell](./angular-shell/README.md)** — Configuracion de Webpack, URLs de remotos, Tailwind
- **[Vue Remote](./vue-remote/README.md)** — Configuracion de Vite, Federation plugin, modulos expuestos

---

## Inicio rapido (concurrently)

### Prerequisitos

- Node.js 18+ (recomendado 20 LTS)
- npm 9+

### Pasos

```bash
# 1. Clonar e ir al directorio raiz
cd microfrontend

# 2. Instalar dependencias raiz (incluye concurrently)
npm install

# 3. Iniciar ambos proyectos con un solo comando
npm start
```

Esto ejecuta automaticamente:
1. `npm install` en `vue-remote/` y `angular-shell/`
2. Build + preview del Vue Remote en el puerto **3000**
3. Webpack dev server del Angular Shell en el puerto **4200**

Navega a **http://localhost:4200/login**

**Credenciales demo:** `admin@mfe.com` / `admin123`

> **Nota:** Siempre accede a traves del puerto del Angular Shell (por defecto `4200`). El Vue Remote (`3000`) solo sirve los modulos remotos y no debe abrirse directamente.

### Comandos disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm start` | Instala dependencias + inicia ambos servidores |
| `npm run start:vue` | Solo el Vue Remote (build + preview) |
| `npm run start:angular` | Solo el Angular Shell (dev server) |
| `npm run build` | Build de produccion de ambos |

---

## Inicio manual (dos terminales)

### Terminal 1 — Vue Remote (puerto 3000)

```bash
cd vue-remote
npm install
npm run build
npm run preview
```

### Terminal 2 — Angular Shell (puerto 4200)

```bash
cd angular-shell
npm install
npm run dev
```

> **Importante:** Vue Remote debe estar corriendo antes de navegar a las paginas de Vue en Angular.

---

## Docker

### Build y ejecucion con Docker Compose

```bash
# Construir y levantar ambos contenedores
docker compose up --build

# En segundo plano
docker compose up --build -d

# Detener
docker compose down
```

Una vez levantados:
- Angular Shell: **http://localhost:4200**
- Vue Remote: **http://localhost:3000**

### Build de imagenes individuales

```bash
# Vue Remote
docker build -t vue-remote ./vue-remote

# Angular Shell
docker build -t angular-shell ./angular-shell

# Ejecutar individualmente
docker run -p 3000:80 vue-remote
docker run -p 4200:80 angular-shell
```

---

## Build de produccion

### 1. Build local

```bash
# Desde la raiz del proyecto
npm run build
```

Esto genera:
- `vue-remote/dist/` — archivos estaticos del Vue Remote (incluye `remoteEntry.js`)
- `angular-shell/dist/` — archivos estaticos del Angular Shell

### 2. Servir en produccion

Ambas carpetas `dist/` son archivos estaticos que se pueden servir con cualquier servidor web (Nginx, Apache, CDN, S3, etc.).

**Configuracion clave para produccion:**

1. Actualizar la URL del remote en `angular-shell/src/app/shared/mfe.config.ts`:

```typescript
export const MFE_REMOTES: Record<string, MfeRemote> = {
  vue: {
    url: 'https://tu-cdn.com/vue-remote/assets/remoteEntry.js',
    moduleSuffix: 'Mount',
  },
}
```

2. Actualizar `publicPath` en `angular-shell/webpack.config.js`:

```javascript
output: {
  publicPath: 'https://tu-cdn.com/angular-shell/',
}
```

3. Rebuild ambos proyectos despues de actualizar las URLs.

### 3. Ejemplo Nginx para produccion

```nginx
# Vue Remote - puerto 3000
server {
    listen 80;
    server_name vue-remote.tu-dominio.com;
    root /var/www/vue-remote/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
        add_header Access-Control-Allow-Origin *;
    }
}

# Angular Shell - puerto 4200
server {
    listen 80;
    server_name app.tu-dominio.com;
    root /var/www/angular-shell/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Estado compartido (Angular <-> Vue)

La comunicacion entre frameworks usa un **bridge de estado compartido**:

### Desde Angular (SharedStateService)

```typescript
// Leer estado
const state = this.sharedState.getState()

// Actualizar estado (notifica a Vue automaticamente)
this.sharedState.setState({ user: { name: 'Nuevo', email: '...', role: '...' } })

// Suscribirse a cambios
this.sharedState.subscribe(state => console.log(state))
```

### Desde Vue (inject)

```javascript
// En cualquier componente Vue montado via federation
const sharedState = inject('sharedState')  // reactive, se actualiza solo
const bridge = inject('sharedBridge')

// Leer datos del usuario (reactivo)
console.log(sharedState.user.name)

// Enviar cambios a Angular
bridge.setState({ theme: 'oscuro' })
```

---

## Estructura de archivos

```
microfrontend/
├── package.json                        # Scripts raiz (concurrently)
├── docker-compose.yml                  # Orquestacion Docker
├── README.md
│
├── vue-remote/                         # Microfrontend Vue 3.5
│   ├── Dockerfile
│   ├── vite.config.js                  # Federation: expone mount functions
│   ├── package.json
│   └── src/
│       ├── main.js
│       ├── App.vue
│       ├── mount/
│       │   ├── ProductsMount.js        # mount(el, bridge) -> Vue app
│       │   └── SettingsMount.js        # mount(el, bridge) -> Vue app
│       └── pages/
│           ├── ProductsPage.vue
│           └── SettingsPage.vue
│
└── angular-shell/                      # Host Angular 19
    ├── Dockerfile
    ├── webpack.config.js               # Webpack 5 + babel linker
    ├── tsconfig.json
    ├── package.json
    └── src/
        ├── index.html
        ├── main.ts
        └── app/
            ├── app.module.ts           # Rutas y modulos
            ├── app.component.ts
            ├── auth.guard.ts           # Functional guard
            ├── shared/
            │   ├── mfe.config.ts       # URLs de remotes (centralizado)
            │   ├── mfe-loader.service.ts   # Carga dinamica de remotes
            │   └── shared-state.service.ts # Estado compartido pub/sub
            ├── login/
            ├── shell/
            ├── dashboard/
            ├── analytics/
            └── vue-wrapper/
                └── vue-wrapper.component.ts  # Wrapper generico para MFEs
```

---

## Agregar un nuevo MFE

Para agregar una nueva pagina Vue (o un nuevo remote):

### 1. Crear el componente Vue

```bash
# vue-remote/src/pages/NuevaPage.vue
```

### 2. Crear el mount function

```javascript
// vue-remote/src/mount/NuevaMount.js
import { createApp, reactive } from 'vue'
import NuevaPage from '../pages/NuevaPage.vue'

export default function mount(el, bridge) {
  const app = createApp(NuevaPage)
  if (bridge) {
    const shared = reactive(bridge.getState())
    bridge.subscribe(state => Object.assign(shared, state))
    app.provide('sharedState', shared)
    app.provide('sharedBridge', bridge)
  }
  app.mount(el)
  return app
}
```

### 3. Exponer en vite.config.js

```javascript
exposes: {
  './ProductsMount': './src/mount/ProductsMount.js',
  './SettingsMount': './src/mount/SettingsMount.js',
  './NuevaMount': './src/mount/NuevaMount.js',  // <-- agregar
}
```

### 4. Agregar la ruta en Angular

```typescript
// app.module.ts
{ path: 'nueva', component: VueWrapperComponent, data: { remote: 'vue', page: 'Nueva' } },
```

No se necesita modificar `vue-wrapper.component.ts` — resuelve el modulo automaticamente.

---

## Troubleshooting

| Problema | Solucion |
|----------|----------|
| `remoteEntry.js` no carga | Verificar que Vue Remote esta corriendo en `:3000` |
| Error CORS | `vite.config.js` ya incluye `cors: true` en preview/server |
| Pagina en blanco | Revisar consola del navegador para errores de compilacion |
| `Cannot use import.meta` | El remote se carga como ES module, verificar el wrapper |
| Vue no recibe estado | Verificar que el mount function recibe `bridge` como 2do argumento |
