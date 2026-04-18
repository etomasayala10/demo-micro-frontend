<template>
  <div class="bg-slate-50 min-h-screen p-8 font-sans max-w-[1100px]">
    <div class="mb-8">
      <div class="inline-block bg-emerald-500 text-white text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full mb-3">Vue 3.5</div>
      <h1 class="text-3xl font-bold text-slate-900 mb-1">Catálogo de Productos</h1>
      <p class="text-slate-500 m-0">Gestión de inventario en tiempo real</p>
    </div>

    <div class="flex gap-4 items-center flex-wrap mb-6">
      <div class="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3.5 py-2 flex-1 min-w-[200px] text-slate-400">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input v-model="search" type="text" placeholder="Buscar producto..." class="border-none outline-none text-sm text-slate-900 bg-transparent w-full" />
      </div>
      <div class="flex gap-1.5 flex-wrap">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="[
            'px-3.5 py-1.5 rounded-lg border text-[13px] cursor-pointer transition-all duration-150',
            activeCategory === cat
              ? 'bg-emerald-500 text-white border-emerald-500'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500'
          ]"
          @click="activeCategory = cat"
        >{{ cat }}</button>
      </div>
    </div>

    <div class="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4 mb-7">
      <div class="bg-white border border-slate-100 rounded-[10px] px-5 py-4 flex flex-col gap-1" v-for="stat in stats" :key="stat.label">
        <span class="text-[1.4rem] font-bold text-slate-900">{{ stat.value }}</span>
        <span class="text-xs text-slate-400">{{ stat.label }}</span>
      </div>
    </div>

    <div class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        :class="[
          'bg-white border border-slate-100 rounded-xl p-5 cursor-pointer transition-all duration-200 relative flex gap-4 items-start hover:border-emerald-500 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(66,184,131,0.12)]',
          product.stock < 10 ? 'border-l-[3px] border-l-amber-400' : ''
        ]"
        @click="selectProduct(product)"
      >
        <div class="w-12 h-12 rounded-[10px] flex items-center justify-center text-2xl shrink-0" :style="{ background: product.color }">
          <span>{{ product.emoji }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-semibold text-slate-900 m-0 mb-0.5">{{ product.name }}</h3>
          <p class="text-xs text-slate-400 m-0 mb-2">{{ product.category }}</p>
          <div class="flex justify-between items-center">
            <span class="text-sm font-bold text-slate-900">S/ {{ product.price.toFixed(2) }}</span>
            <span :class="['text-xs', product.stock < 10 ? 'text-amber-400 font-semibold' : 'text-slate-500']">
              Stock: {{ product.stock }}
            </span>
          </div>
        </div>
        <div :class="[
          'absolute top-2.5 right-2.5 text-[11px] font-bold px-2 py-0.5 rounded-full',
          product.trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
        ]">
          {{ product.trend > 0 ? '↑' : '↓' }} {{ Math.abs(product.trend) }}%
        </div>
      </div>
    </div>

    <!-- Modal -->
    <transition name="fade">
      <div class="fixed inset-0 bg-black/45 flex items-center justify-center z-[1000] p-4" v-if="selected" @click.self="selected = null">
        <div class="bg-white rounded-2xl w-full max-w-[400px] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
          <div class="p-8 flex justify-between items-start" :style="{ background: selected.color }">
            <span class="text-5xl">{{ selected.emoji }}</span>
            <button class="bg-white/70 border-none rounded-full w-8 h-8 cursor-pointer text-sm flex items-center justify-center" @click="selected = null">✕</button>
          </div>
          <div class="p-6">
            <h2 class="m-0 mb-2 text-xl text-slate-900">{{ selected.name }}</h2>
            <p class="text-slate-500 text-sm m-0 mb-5 leading-relaxed">{{ selected.description }}</p>
            <div class="grid grid-cols-2 gap-3 mb-6">
              <div class="bg-slate-50 rounded-lg p-3 flex flex-col gap-0.5">
                <strong class="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">Precio</strong>
                <span class="text-sm text-slate-900 font-semibold">S/ {{ selected.price.toFixed(2) }}</span>
              </div>
              <div class="bg-slate-50 rounded-lg p-3 flex flex-col gap-0.5">
                <strong class="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">Stock</strong>
                <span class="text-sm text-slate-900 font-semibold">{{ selected.stock }} unidades</span>
              </div>
              <div class="bg-slate-50 rounded-lg p-3 flex flex-col gap-0.5">
                <strong class="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">Categoría</strong>
                <span class="text-sm text-slate-900 font-semibold">{{ selected.category }}</span>
              </div>
              <div class="bg-slate-50 rounded-lg p-3 flex flex-col gap-0.5">
                <strong class="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">Tendencia</strong>
                <span :class="['text-sm font-semibold', selected.trend > 0 ? 'text-green-700' : 'text-red-600']">{{ selected.trend > 0 ? '+' : '' }}{{ selected.trend }}%</span>
              </div>
            </div>
            <button class="w-full py-3 bg-emerald-500 text-white border-none rounded-[10px] text-[15px] font-semibold cursor-pointer transition-colors duration-150 hover:bg-emerald-600" @click="addToCart(selected)">
              Agregar al pedido
            </button>
          </div>
        </div>
      </div>
    </transition>

    <div class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-medium z-[2000] animate-[slideUp_0.3s_ease]" v-if="toast" key="toast">{{ toast }}</div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'

const sharedState = inject('sharedState', null)
const sharedBridge = inject('sharedBridge', null)

const search = ref('')
const activeCategory = ref('Todos')
const selected = ref(null)
const toast = ref('')

const categories = ['Todos', 'Tecnología', 'Oficina', 'Periféricos']

const stats = [
  { label: 'Total Productos', value: '24' },
  { label: 'Stock Bajo', value: '3' },
  { label: 'Valor Inventario', value: 'S/ 48,200' },
  { label: 'Más Vendido', value: 'Laptop Pro' },
]

const products = ref([
  { id: 1, name: 'Laptop Pro X1', category: 'Tecnología', price: 3499.90, stock: 8, trend: 12, emoji: '💻', color: '#dbeafe', description: 'Laptop de alto rendimiento con procesador i7, 16GB RAM y SSD 512GB.' },
  { id: 2, name: 'Monitor 4K Ultra', category: 'Tecnología', price: 1299.00, stock: 15, trend: -3, emoji: '🖥️', color: '#dcfce7', description: 'Monitor IPS 27" con resolución 4K y cobertura sRGB 99%.' },
  { id: 3, name: 'Teclado Mecánico', category: 'Periféricos', price: 349.90, stock: 32, trend: 8, emoji: '⌨️', color: '#fef9c3', description: 'Teclado mecánico TKL con switches Cherry MX Red y retroiluminación RGB.' },
  { id: 4, name: 'Mouse Ergonómico', category: 'Periféricos', price: 189.00, stock: 45, trend: 5, emoji: '🖱️', color: '#fce7f3', description: 'Mouse inalámbrico con diseño ergonómico y batería de 70 días.' },
  { id: 5, name: 'Silla Ejecutiva', category: 'Oficina', price: 899.00, stock: 6, trend: -1, emoji: '🪑', color: '#ede9fe', description: 'Silla ergonómica con soporte lumbar ajustable y reposabrazos 4D.' },
  { id: 6, name: 'Webcam HD Pro', category: 'Periféricos', price: 279.90, stock: 20, trend: 22, emoji: '📷', color: '#ffedd5', description: 'Webcam 1080p 60fps con micrófono integrado y enfoque automático.' },
  { id: 7, name: 'Headset Bluetooth', category: 'Periféricos', price: 459.00, stock: 18, trend: 15, emoji: '🎧', color: '#dbeafe', description: 'Auriculares con cancelación activa de ruido y 30h de batería.' },
  { id: 8, name: 'Escritorio Standing', category: 'Oficina', price: 1450.00, stock: 4, trend: 7, emoji: '🗂️', color: '#dcfce7', description: 'Escritorio eléctrico ajustable en altura con memoria de posiciones.' },
])

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchCat = activeCategory.value === 'Todos' || p.category === activeCategory.value
    const matchSearch = p.name.toLowerCase().includes(search.value.toLowerCase())
    return matchCat && matchSearch
  })
})

function selectProduct(p) {
  selected.value = p
}

function addToCart(p) {
  selected.value = null
  toast.value = `✓ "${p.name}" agregado al pedido`
  setTimeout(() => { toast.value = '' }, 2500)
}
</script>
