import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  template: `
    <div class="p-8 font-['Plus_Jakarta_Sans',system-ui,sans-serif] bg-slate-50 min-h-full">
      <!-- Page header -->
      <div class="mb-7">
        <div class="badge-angular inline-block mb-3">Angular 19</div>
        <h1 class="text-[2rem] font-extrabold text-[#0a0f1e] m-0 mb-1">Dashboard</h1>
        <p class="text-slate-500 m-0">Resumen ejecutivo del sistema</p>
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-6">
        <div
          class="bg-white rounded-[14px] p-5 border border-slate-100 animate-[slideIn_0.4s_ease_both]"
          *ngFor="let kpi of kpis; let i = index"
          [style.animation-delay]="(i * 80) + 'ms'"
        >
          <div class="flex justify-between items-center mb-3">
            <div
              class="w-10 h-10 rounded-[10px] flex items-center justify-center text-xl"
              [style.background]="kpi.iconBg"
            >{{ kpi.icon }}</div>
            <div
              class="text-xs font-bold px-2 py-[3px] rounded-full"
              [ngClass]="{
                'bg-green-100 text-green-700': kpi.change > 0,
                'bg-red-100 text-red-600': kpi.change < 0
              }"
            >
              {{ kpi.change > 0 ? '↑' : '↓' }} {{ kpi.changeLabel }}
            </div>
          </div>
          <div class="text-[1.8rem] font-extrabold text-[#0a0f1e] leading-none mb-1">{{ kpi.value }}</div>
          <div class="text-[13px] text-slate-500 mb-3">{{ kpi.label }}</div>
          <div class="h-1 bg-slate-100 rounded-sm overflow-hidden">
            <div class="h-full rounded-sm transition-[width] duration-[600ms] ease-in-out" [style.width]="kpi.progress + '%'" [style.background]="kpi.color"></div>
          </div>
        </div>
      </div>

      <!-- Charts row -->
      <div class="grid grid-cols-[1fr_340px] gap-4 mb-6 max-lg:grid-cols-1">
        <!-- Activity chart -->
        <div class="bg-white rounded-[14px] p-6 border border-slate-100">
          <div class="flex justify-between items-start mb-5">
            <div>
              <h3 class="text-[15px] font-bold text-[#0a0f1e] m-0 mb-0.5">Actividad mensual</h3>
              <p class="text-xs text-slate-400 m-0">Pedidos vs Devoluciones — últimos 7 meses</p>
            </div>
            <select class="border border-slate-200 rounded-lg px-2.5 py-[5px] text-[13px] text-gray-700 outline-none bg-white">
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>
          <div class="flex items-end gap-4 h-[200px] pb-2">
            <div class="flex flex-col items-center gap-1 flex-1" *ngFor="let item of chartData">
              <div class="flex items-end gap-1">
                <div
                  class="w-3.5 rounded-t transition-[height] duration-[400ms] ease-in-out relative cursor-pointer bg-violet-600 group"
                  [style.height]="(item.orders / maxVal * 180) + 'px'"
                >
                  <span class="absolute bottom-[105%] left-1/2 -translate-x-1/2 translate-y-1 bg-[#0a0f1e] text-white text-[11px] px-1.5 py-[3px] rounded whitespace-nowrap opacity-0 transition-all duration-150 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0">{{ item.orders }}</span>
                </div>
                <div
                  class="w-3.5 rounded-t transition-[height] duration-[400ms] ease-in-out relative cursor-pointer bg-slate-200 group"
                  [style.height]="(item.returns / maxVal * 180) + 'px'"
                >
                  <span class="absolute bottom-[105%] left-1/2 -translate-x-1/2 translate-y-1 bg-[#0a0f1e] text-white text-[11px] px-1.5 py-[3px] rounded whitespace-nowrap opacity-0 transition-all duration-150 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0">{{ item.returns }}</span>
                </div>
              </div>
              <span class="text-[11px] text-slate-400">{{ item.month }}</span>
            </div>
          </div>
          <div class="flex gap-4 mt-3">
            <div class="flex items-center gap-1.5 text-xs text-slate-500"><div class="w-2.5 h-2.5 rounded-[3px] bg-violet-600"></div>Pedidos</div>
            <div class="flex items-center gap-1.5 text-xs text-slate-500"><div class="w-2.5 h-2.5 rounded-[3px] bg-slate-200"></div>Devoluciones</div>
          </div>
        </div>

        <!-- Top products -->
        <div class="bg-white rounded-[14px] p-6 border border-slate-100">
          <div class="flex justify-between items-start mb-5">
            <div>
              <h3 class="text-[15px] font-bold text-[#0a0f1e] m-0 mb-0.5">Top Productos</h3>
              <p class="text-xs text-slate-400 m-0">Por volumen de ventas</p>
            </div>
          </div>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3" *ngFor="let p of topProducts; let i = index">
              <div class="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">{{ i + 1 }}</div>
              <div class="flex-1">
                <span class="text-[13px] font-semibold text-[#0a0f1e] block mb-1">{{ p.name }}</span>
                <div class="h-1 bg-slate-100 rounded-sm overflow-hidden">
                  <div class="h-full bg-violet-600 rounded-sm" [style.width]="p.pct + '%'"></div>
                </div>
              </div>
              <span class="text-[13px] font-bold text-[#0a0f1e] whitespace-nowrap">{{ p.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent activity -->
      <div class="bg-white rounded-[14px] p-6 border border-slate-100">
        <div class="flex justify-between items-start mb-5">
          <div>
            <h3 class="text-[15px] font-bold text-[#0a0f1e] m-0 mb-0.5">Actividad reciente</h3>
            <p class="text-xs text-slate-400 m-0">Últimas transacciones del sistema</p>
          </div>
          <div class="flex gap-1">
            <button
              *ngFor="let f of filters"
              class="px-3 py-[5px] rounded-lg border text-xs cursor-pointer font-[inherit]"
              [ngClass]="{
                'bg-violet-600 text-white border-violet-600': activeFilter === f,
                'bg-white text-slate-500 border-slate-200': activeFilter !== f
              }"
              (click)="activeFilter = f"
            >{{ f }}</button>
          </div>
        </div>
        <table class="w-full border-collapse mt-4">
          <thead>
            <tr>
              <th class="text-[11px] font-bold uppercase tracking-wide text-slate-400 px-3 py-2 text-left border-b border-slate-100">ID</th>
              <th class="text-[11px] font-bold uppercase tracking-wide text-slate-400 px-3 py-2 text-left border-b border-slate-100">Descripción</th>
              <th class="text-[11px] font-bold uppercase tracking-wide text-slate-400 px-3 py-2 text-left border-b border-slate-100">Usuario</th>
              <th class="text-[11px] font-bold uppercase tracking-wide text-slate-400 px-3 py-2 text-left border-b border-slate-100">Monto</th>
              <th class="text-[11px] font-bold uppercase tracking-wide text-slate-400 px-3 py-2 text-left border-b border-slate-100">Estado</th>
              <th class="text-[11px] font-bold uppercase tracking-wide text-slate-400 px-3 py-2 text-left border-b border-slate-100">Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let act of filteredActivities">
              <td class="px-3 py-3 text-[13px] text-gray-700 border-b border-slate-50 font-mono text-slate-400 text-xs">#{{ act.id }}</td>
              <td class="px-3 py-3 text-[13px] text-gray-700 border-b border-slate-50">{{ act.desc }}</td>
              <td class="px-3 py-3 text-[13px] text-gray-700 border-b border-slate-50">
                <div class="flex items-center gap-2">
                  <div class="w-[26px] h-[26px] rounded-full bg-violet-600 text-white text-[11px] font-bold flex items-center justify-center">{{ act.user[0] }}</div>
                  {{ act.user }}
                </div>
              </td>
              <td class="px-3 py-3 border-b border-slate-50 font-mono text-[#0a0f1e] font-semibold text-xs">{{ act.amount }}</td>
              <td class="px-3 py-3 text-[13px] text-gray-700 border-b border-slate-50">
                <span
                  class="px-2.5 py-[3px] rounded-full text-[11px] font-bold"
                  [ngClass]="{
                    'bg-green-100 text-green-700': act.status === 'completado',
                    'bg-yellow-100 text-amber-700': act.status === 'pendiente',
                    'bg-red-100 text-red-600': act.status === 'cancelado'
                  }"
                >{{ act.statusLabel }}</span>
              </td>
              <td class="px-3 py-3 border-b border-slate-50 text-slate-400 text-xs">{{ act.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  activeFilter = 'Todos'
  filters = ['Todos', 'Completado', 'Pendiente', 'Cancelado']

  kpis = [
    { label: 'Ventas del mes', value: 'S/ 48,200', change: 12, changeLabel: '12% vs mes anterior', icon: '💰', iconBg: '#f0fdf4', color: '#22c55e', progress: 72 },
    { label: 'Pedidos activos', value: '134', change: 8, changeLabel: '8 nuevos hoy', icon: '📦', iconBg: '#eff6ff', color: '#3b82f6', progress: 55 },
    { label: 'Clientes nuevos', value: '28', change: -3, changeLabel: '3% menos', icon: '👥', iconBg: '#fdf4ff', color: '#a855f7', progress: 40 },
    { label: 'Tasa conversión', value: '64%', change: 5, changeLabel: '5pts mejor', icon: '🎯', iconBg: '#fff7ed', color: '#f97316', progress: 64 },
  ]

  chartData = [
    { month: 'Jun', orders: 120, returns: 18 },
    { month: 'Jul', orders: 98, returns: 12 },
    { month: 'Ago', orders: 145, returns: 22 },
    { month: 'Sep', orders: 132, returns: 16 },
    { month: 'Oct', orders: 167, returns: 20 },
    { month: 'Nov', orders: 155, returns: 14 },
    { month: 'Dic', orders: 189, returns: 25 },
  ]

  maxVal = 0

  topProducts = [
    { name: 'Laptop Pro X1', value: 'S/ 14,000', pct: 90 },
    { name: 'Monitor 4K', value: 'S/ 9,100', pct: 58 },
    { name: 'Headset BT', value: 'S/ 6,885', pct: 44 },
    { name: 'Teclado Mec.', value: 'S/ 5,249', pct: 34 },
    { name: 'Mouse Erg.', value: 'S/ 3,780', pct: 24 },
  ]

  activities = [
    { id: '10045', desc: 'Pedido corporativo', user: 'Ana Torres', amount: 'S/ 3,499', status: 'completado', statusLabel: 'Completado', date: 'Hoy 14:32' },
    { id: '10044', desc: 'Compra individual', user: 'Luis Ríos', amount: 'S/ 189', status: 'completado', statusLabel: 'Completado', date: 'Hoy 11:15' },
    { id: '10043', desc: 'Pedido empresarial', user: 'María Chan', amount: 'S/ 12,500', status: 'pendiente', statusLabel: 'Pendiente', date: 'Ayer 16:00' },
    { id: '10042', desc: 'Reposición stock', user: 'Pedro Lima', amount: 'S/ 8,900', status: 'pendiente', statusLabel: 'Pendiente', date: 'Ayer 10:20' },
    { id: '10041', desc: 'Pedido cancelado', user: 'Sofia Vega', amount: 'S/ 450', status: 'cancelado', statusLabel: 'Cancelado', date: '23 Dic' },
    { id: '10040', desc: 'Venta outlet', user: 'Carlos Paz', amount: 'S/ 2,800', status: 'completado', statusLabel: 'Completado', date: '22 Dic' },
  ]

  get filteredActivities() {
    if (this.activeFilter === 'Todos') return this.activities
    return this.activities.filter(a => a.statusLabel === this.activeFilter)
  }

  ngOnInit() {
    this.maxVal = Math.max(...this.chartData.map(d => d.orders))
  }
}
