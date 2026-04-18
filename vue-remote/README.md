# Vue Remote (Microfrontend)

Microfrontend Vue 3.5 que expone componentes via Vite + @originjs/vite-plugin-federation. Es consumido por el Angular Shell a traves de Module Federation.

## Prerequisitos

- Node.js 18+ (recomendado 20 LTS)
- npm 9+

## Configuracion

### 1. Instalar dependencias

```bash
cd vue-remote
npm install
```

### 2. Configurar Federation

En `vite.config.js` se definen los modulos expuestos:

```javascript
federation({
  name: 'vueMfe',
  filename: 'remoteEntry.js',
  exposes: {
    './ProductsMount': './src/mount/ProductsMount.js',
    './SettingsMount': './src/mount/SettingsMount.js',
  },
  shared: [],
})
```

Para agregar un nuevo modulo, crear el mount function en `src/mount/` y agregarlo al objeto `exposes`.

### 3. Configurar puertos (opcional)

Los puertos estan definidos en `vite.config.js`:

```javascript
preview: {
  port: 3000,   // puerto en modo preview (usado por el shell)
  cors: true,
},
server: {
  port: 3000,   // puerto en modo dev
  cors: true,
},
```

### 4. Configurar Tailwind CSS (opcional)

El archivo `tailwind.config.js` ya esta configurado. Para personalizar, editar segun necesidad.

## Ejecucion

```bash
# Desarrollo (hot reload, puerto 3000)
npm run dev

# Build + preview (modo produccion local, puerto 3000)
npm run build
npm run preview
```

> **Nota:** Para que el Angular Shell consuma este remote, debe ejecutarse con `npm run build && npm run preview` (no `npm run dev`), ya que Federation requiere el build previo para generar `remoteEntry.js`.

## Docker

```bash
# Build de imagen
docker build -t vue-remote .

# Ejecutar
docker run -p 3000:80 vue-remote
```

## Estructura

```
vue-remote/
├── vite.config.js             # Vite + Federation plugin
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── Dockerfile
├── nginx.conf
└── src/
    ├── main.js
    ├── App.vue
    ├── mount/
    │   ├── ProductsMount.js   # mount(el, bridge) -> Vue app
    │   └── SettingsMount.js   # mount(el, bridge) -> Vue app
    └── pages/
        ├── ProductsPage.vue
        └── SettingsPage.vue
```
