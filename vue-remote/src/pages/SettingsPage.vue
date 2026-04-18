<template>
  <div class="bg-slate-50 min-h-screen p-8 font-sans">
    <div class="mb-8">
      <div class="inline-block bg-emerald-500 text-white text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full mb-3">Vue 3.5</div>
      <h1 class="text-3xl font-bold text-slate-900 mb-1">Configuración</h1>
      <p class="text-slate-500 m-0">Personaliza tu experiencia de trabajo</p>
    </div>

    <div class="grid grid-cols-[200px_1fr] gap-6 items-start max-md:grid-cols-1">
      <!-- Left: Nav -->
      <nav class="bg-white border border-slate-100 rounded-xl p-2 flex flex-col gap-0.5">
        <button
          v-for="section in sections"
          :key="section.id"
          :class="[
            'flex items-center gap-2.5 px-3 py-2.5 rounded-lg border-none text-sm cursor-pointer text-left transition-all duration-150 w-full',
            activeSection === section.id
              ? 'bg-green-50 text-emerald-500 font-semibold'
              : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'
          ]"
          @click="activeSection = section.id"
        >
          <span class="text-base">{{ section.icon }}</span>
          <span>{{ section.label }}</span>
        </button>
      </nav>

      <!-- Right: Content -->
      <div class="bg-white border border-slate-100 rounded-xl p-8 min-h-[400px]">

        <!-- Perfil -->
        <div v-if="activeSection === 'perfil'">
          <h2 class="text-xl font-bold text-slate-900 m-0 mb-6">Perfil de Usuario</h2>
          <div class="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-[10px]">
            <div class="w-[60px] h-[60px] rounded-full bg-emerald-500 text-white font-bold text-xl flex items-center justify-center shrink-0">{{ profile.initials }}</div>
            <div>
              <p class="font-semibold text-slate-900 m-0">{{ profile.name }}</p>
              <p class="text-[13px] text-slate-500 mt-0.5 mb-2">{{ profile.role }}</p>
              <button class="px-3.5 py-1.5 bg-white text-slate-500 border border-slate-200 rounded-lg text-[13px] cursor-pointer">Cambiar foto</button>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 mb-6 max-md:grid-cols-1">
            <div class="flex flex-col gap-1.5 mb-4">
              <label class="text-[13px] font-semibold text-gray-700">Nombre completo</label>
              <input v-model="profile.name" type="text" class="px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-colors duration-150 w-full box-border bg-white focus:border-emerald-500" />
            </div>
            <div class="flex flex-col gap-1.5 mb-4">
              <label class="text-[13px] font-semibold text-gray-700">Correo electrónico</label>
              <input v-model="profile.email" type="email" class="px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-colors duration-150 w-full box-border bg-white focus:border-emerald-500" />
            </div>
            <div class="flex flex-col gap-1.5 mb-4">
              <label class="text-[13px] font-semibold text-gray-700">Cargo</label>
              <input v-model="profile.role" type="text" class="px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-colors duration-150 w-full box-border bg-white focus:border-emerald-500" />
            </div>
            <div class="flex flex-col gap-1.5 mb-4">
              <label class="text-[13px] font-semibold text-gray-700">Empresa</label>
              <input v-model="profile.company" type="text" class="px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-colors duration-150 w-full box-border bg-white focus:border-emerald-500" />
            </div>
          </div>
          <button class="py-2.5 px-6 bg-emerald-500 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-150 hover:bg-emerald-600" @click="save('perfil')">Guardar cambios</button>
        </div>

        <!-- Notificaciones -->
        <div v-if="activeSection === 'notificaciones'">
          <h2 class="text-xl font-bold text-slate-900 m-0 mb-6">Notificaciones</h2>
          <p class="text-slate-500 text-sm -mt-4 mb-6">Controla qué notificaciones recibes y cómo.</p>
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-[10px] gap-4" v-for="notif in notifications" :key="notif.id">
              <div>
                <p class="text-sm font-semibold text-slate-900 m-0 mb-0.5">{{ notif.label }}</p>
                <p class="text-xs text-slate-400 m-0">{{ notif.desc }}</p>
              </div>
              <button
                :class="[
                  'w-11 h-6 rounded-xl border-none cursor-pointer relative shrink-0 transition-colors duration-200',
                  notif.active ? 'bg-emerald-500' : 'bg-slate-200'
                ]"
                @click="notif.active = !notif.active"
              >
                <span :class="[
                  'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200',
                  notif.active ? 'translate-x-5' : 'translate-x-0'
                ]"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Apariencia -->
        <div v-if="activeSection === 'apariencia'">
          <h2 class="text-xl font-bold text-slate-900 m-0 mb-6">Apariencia</h2>
          <p class="text-slate-500 text-sm -mt-4 mb-6">Adapta la interfaz a tu gusto.</p>

          <div class="flex flex-col gap-1.5 mb-4">
            <label class="text-[13px] font-semibold text-gray-700">Tema</label>
            <div class="flex gap-3 flex-wrap mt-2">
              <div
                v-for="theme in themes"
                :key="theme.id"
                :class="[
                  'w-[100px] border-2 rounded-[10px] overflow-hidden cursor-pointer text-center relative transition-colors duration-150',
                  selectedTheme === theme.id ? 'border-emerald-500' : 'border-slate-200'
                ]"
                @click="selectedTheme = theme.id"
              >
                <div class="h-[60px] p-1.5 flex flex-col gap-1" :style="{ background: theme.bg }">
                  <div class="h-2 rounded" :style="{ background: theme.bar }"></div>
                  <div class="flex-1 rounded" :style="{ background: theme.content }"></div>
                </div>
                <span class="block text-xs p-1.5 text-slate-500">{{ theme.label }}</span>
                <div v-if="selectedTheme === theme.id" class="absolute top-1 right-1 w-[18px] h-[18px] bg-emerald-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">✓</div>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-1.5 mb-4">
            <label class="text-[13px] font-semibold text-gray-700">Tamaño de fuente</label>
            <div class="flex items-center gap-3">
              <span class="text-xs text-slate-400">Aa</span>
              <input type="range" min="12" max="18" v-model="fontSize" class="flex-1 accent-emerald-500" />
              <span class="text-lg text-slate-400">Aa</span>
            </div>
            <p class="text-xs text-slate-400 mt-1 mb-0">{{ fontSize }}px</p>
          </div>

          <div class="flex flex-col gap-1.5 mb-4">
            <label class="text-[13px] font-semibold text-gray-700">Color de acento</label>
            <div class="flex gap-2 flex-wrap mt-2">
              <div
                v-for="c in accentColors"
                :key="c"
                class="w-7 h-7 rounded-full cursor-pointer transition-transform duration-150 hover:scale-110"
                :style="{ background: c, outline: selectedAccent === c ? `3px solid ${c}` : 'none', outlineOffset: '2px' }"
                @click="selectedAccent = c"
              ></div>
            </div>
          </div>

          <button class="py-2.5 px-6 bg-emerald-500 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-150 hover:bg-emerald-600" @click="save('apariencia')">Aplicar</button>
        </div>

        <!-- Seguridad -->
        <div v-if="activeSection === 'seguridad'">
          <h2 class="text-xl font-bold text-slate-900 m-0 mb-6">Seguridad</h2>
          <p class="text-slate-500 text-sm -mt-4 mb-6">Mantén tu cuenta protegida.</p>

          <div class="flex items-center gap-4 p-5 border border-slate-100 rounded-[10px]">
            <div class="text-3xl">🔐</div>
            <div>
              <p class="text-sm font-semibold text-slate-900 m-0 mb-0.5">Autenticación en dos pasos</p>
              <p class="text-[13px] text-slate-400 m-0">Agrega una capa adicional de seguridad a tu cuenta.</p>
            </div>
            <button
              :class="[
                'w-11 h-6 rounded-xl border-none cursor-pointer relative shrink-0 transition-colors duration-200',
                twoFactor ? 'bg-emerald-500' : 'bg-slate-200'
              ]"
              @click="twoFactor = !twoFactor"
            >
              <span :class="[
                'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200',
                twoFactor ? 'translate-x-5' : 'translate-x-0'
              ]"></span>
            </button>
          </div>

          <div class="flex flex-col gap-1.5 mt-6 mb-4">
            <label class="text-[13px] font-semibold text-gray-700">Cambiar contraseña</label>
            <input type="password" placeholder="Contraseña actual" class="px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-colors duration-150 w-full box-border bg-white focus:border-emerald-500 mb-2" />
            <input type="password" placeholder="Nueva contraseña" class="px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-colors duration-150 w-full box-border bg-white focus:border-emerald-500 mb-2" />
            <input type="password" placeholder="Confirmar nueva contraseña" class="px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-colors duration-150 w-full box-border bg-white focus:border-emerald-500" />
          </div>

          <button class="py-2.5 px-6 bg-emerald-500 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-150 hover:bg-emerald-600" @click="save('seguridad')">Actualizar contraseña</button>
        </div>

      </div>
    </div>

    <div class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-medium z-[2000]" v-if="toast">{{ toast }}</div>
  </div>
</template>

<script setup>
import { ref, inject, watchEffect } from 'vue'

const sharedState = inject('sharedState', null)
const sharedBridge = inject('sharedBridge', null)

const activeSection = ref('perfil')
const twoFactor = ref(true)
const fontSize = ref(14)
const selectedTheme = ref('claro')
const selectedAccent = ref('#42b883')
const toast = ref('')

const sections = [
  { id: 'perfil', label: 'Perfil', icon: '👤' },
  { id: 'notificaciones', label: 'Notificaciones', icon: '🔔' },
  { id: 'apariencia', label: 'Apariencia', icon: '🎨' },
  { id: 'seguridad', label: 'Seguridad', icon: '🔒' },
]

const profile = ref({
  name: sharedState?.user?.name || 'Edson García',
  email: sharedState?.user?.email || 'edson@empresa.com',
  role: sharedState?.user?.role || 'Gerente General',
  company: 'Acme Inc',
  initials: '',
})

// Sync profile from shared state
watchEffect(() => {
  if (sharedState?.user) {
    profile.value.name = sharedState.user.name
    profile.value.email = sharedState.user.email
    profile.value.role = sharedState.user.role
  }
  profile.value.initials = profile.value.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
})

const notifications = ref([
  { id: 1, label: 'Alertas de stock bajo', desc: 'Notificación cuando el stock baje del mínimo.', active: true },
  { id: 2, label: 'Nuevos pedidos', desc: 'Al recibir un pedido nuevo en el sistema.', active: true },
  { id: 3, label: 'Reportes semanales', desc: 'Resumen de actividad cada lunes a las 8am.', active: false },
  { id: 4, label: 'Actualizaciones del sistema', desc: 'Notificaciones de mantenimiento y versiones.', active: true },
  { id: 5, label: 'Mensajes del equipo', desc: 'Cuando un colaborador te mencione.', active: false },
])

const themes = [
  { id: 'claro', label: 'Claro', bg: '#f8fafc', bar: '#e2e8f0', content: 'white' },
  { id: 'oscuro', label: 'Oscuro', bg: '#0f172a', bar: '#1e293b', content: '#1e293b' },
  { id: 'sepia', label: 'Sepia', bg: '#fdf6e3', bar: '#e8d9b5', content: 'white' },
]

const accentColors = ['#42b883', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6']

function save(section) {
  if (section === 'perfil' && sharedBridge) {
    const { name, email, role } = profile.value
    sharedBridge.setState({ user: { name, email, role } })
    localStorage.setItem('mfe_user', JSON.stringify({ name, email, role }))
  }
  if (section === 'apariencia' && sharedBridge) {
    sharedBridge.setState({ theme: selectedTheme.value })
  }
  toast.value = `✓ Configuración de ${section} guardada`
  setTimeout(() => { toast.value = '' }, 2500)
}
</script>
