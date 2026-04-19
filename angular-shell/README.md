# Angular Shell (Host)

Aplicacion host Angular 19 que actua como shell de la arquitectura microfrontend. Usa Webpack 5 con Module Federation para cargar remotos.

## Prerequisitos

- Node.js 18+ (recomendado 20 LTS)
- npm 9+

## Configuracion

### 1. Instalar dependencias

```bash
cd angular-shell
npm install
```

### 2. Configurar URLs de remotos

Editar `src/app/shared/mfe.config.ts` para apuntar a los remotos:

```typescript
export const MFE_REMOTES: Record<string, MfeRemote> = {
  vue: {
    url: 'http://localhost:3000/assets/remoteEntry.js', // desarrollo
    // url: 'https://tu-cdn.com/vue-remote/assets/remoteEntry.js', // produccion
    moduleSuffix: 'Mount',
  },
}
```

### 3. Configurar Webpack (opcional)

En `webpack.config.js`, ajustar `publicPath` segun el entorno:

```javascript
output: {
  publicPath: 'http://localhost:4200/', // desarrollo
  // publicPath: 'https://tu-cdn.com/angular-shell/', // produccion
}
```

### 4. Configurar Tailwind CSS (opcional)

El archivo `tailwind.config.js` ya esta configurado. Para personalizar, editar segun necesidad.

## Ejecucion

```bash
# Desarrollo (puerto 4200)
npm run dev

# Build de produccion
npm run build
```

Una vez iniciado, abrir **http://localhost:4200/login** en el navegador.

**Credenciales demo:** `admin@mfe.com` / `admin123`

> **Importante:** El Vue Remote debe estar corriendo en el puerto 3000 antes de navegar a las rutas `/products` o `/settings`. Siempre accede a la aplicacion a traves del puerto del Angular Shell (por defecto `4200`), no del Vue Remote directamente.

## Docker

```bash
# Build de imagen
docker build -t angular-shell .

# Ejecutar
docker run -p 4200:80 angular-shell
```

## Estructura

```
angular-shell/
├── webpack.config.js          # Webpack 5 + Module Federation + Angular Linker
├── tsconfig.json
├── tsconfig.app.json
├── tailwind.config.js
├── postcss.config.js
├── Dockerfile
├── nginx.conf
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.css
    └── app/
        ├── app.module.ts          # Rutas y modulos
        ├── app.component.ts
        ├── auth.guard.ts          # Guard de autenticacion
        ├── shared/
        │   ├── mfe.config.ts          # URLs de remotos
        │   ├── mfe-loader.service.ts  # Carga dinamica
        │   └── shared-state.service.ts
        ├── login/
        ├── shell/
        ├── dashboard/
        ├── analytics/
        └── vue-wrapper/
            └── vue-wrapper.component.ts
```
