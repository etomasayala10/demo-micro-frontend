import { Component, ViewEncapsulation } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-analytics',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 font-['Plus_Jakarta_Sans',system-ui,sans-serif] bg-slate-50 min-h-full">
      <div class="mb-7">
        <div class="inline-block bg-red-600 text-white text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full mb-3">Angular 19</div>
        <h1 class="text-[2rem] font-extrabold text-[#0a0f1e] m-0 mb-1">Analytics</h1>
        <p class="text-slate-500 m-0 text-[13px]">Métricas avanzadas y reportes de rendimiento</p>
      </div>

      <!-- Period selector -->
      <div class="flex gap-1 items-center mb-6 flex-wrap">
        <button *ngFor="let p of periods"
          [class]="activePeriod === p
            ? 'py-[7px] px-4 rounded-lg border border-[#0a0f1e] bg-[#0a0f1e] text-white text-[13px] cursor-pointer font-[inherit]'
            : 'py-[7px] px-4 rounded-lg border border-slate-200 bg-white text-slate-500 text-[13px] cursor-pointer font-[inherit]'"
          (click)="activePeriod = p">{{ p }}</button>
        <div class="flex-1"></div>
        <button class="py-[7px] px-4 rounded-lg border border-violet-600 bg-slate-50 text-violet-600 text-[13px] cursor-pointer font-[inherit] font-semibold">↓ Exportar CSV</button>
      </div>

      <!-- Funnel + Donut row -->
      <div class="grid grid-cols-3 gap-4 mb-6 max-lg:grid-cols-2 max-[700px]:grid-cols-1">

        <!-- Conversion funnel -->
        <div class="bg-white rounded-[14px] p-6 border border-slate-100">
          <h3 class="text-[15px] font-bold text-[#0a0f1e] m-0 mb-0.5">Embudo de conversión</h3>
          <p class="text-slate-500 m-0 text-[13px]">Visitantes → Compra</p>
          <div class="flex flex-col gap-2 mt-4">
            <div class="flex flex-col gap-1" *ngFor="let step of funnel; let i = index">
              <div class="bg-slate-50 rounded-md overflow-hidden h-8">
                <div class="h-full rounded-md flex items-center px-2.5 text-xs font-semibold text-white whitespace-nowrap transition-[width] duration-500 ease-in-out"
                  [style.width]="step.pct + '%'" [style.background]="step.color">
                  <span>{{ step.label }}</span>
                </div>
              </div>
              <div class="flex gap-2 items-center text-xs text-slate-500">
                <span class="font-bold text-[#0a0f1e]">{{ step.value }}</span>
                <span class="text-slate-400">{{ step.pct }}%</span>
                <span class="text-red-500 font-semibold ml-auto" *ngIf="i > 0">-{{ step.drop }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Donut chart (SVG) -->
        <div class="bg-white rounded-[14px] p-6 border border-slate-100">
          <h3 class="text-[15px] font-bold text-[#0a0f1e] m-0 mb-0.5">Canales de venta</h3>
          <p class="text-slate-500 m-0 text-[13px]">Distribución por canal</p>
          <div class="flex items-center gap-6 mt-4">
            <svg viewBox="0 0 160 160" width="160" height="160">
              <circle cx="80" cy="80" r="60" fill="none" stroke="#f1f5f9" stroke-width="28"/>
              <circle cx="80" cy="80" r="60" fill="none" stroke="#7c3aed" stroke-width="28"
                stroke-dasharray="150.8 226.2" stroke-dashoffset="0" transform="rotate(-90 80 80)"/>
              <circle cx="80" cy="80" r="60" fill="none" stroke="#3b82f6" stroke-width="28"
                stroke-dasharray="90.5 285.5" stroke-dashoffset="-150.8" transform="rotate(-90 80 80)"/>
              <circle cx="80" cy="80" r="60" fill="none" stroke="#22c55e" stroke-width="28"
                stroke-dasharray="56.5 320.5" stroke-dashoffset="-241.3" transform="rotate(-90 80 80)"/>
              <circle cx="80" cy="80" r="60" fill="none" stroke="#f97316" stroke-width="28"
                stroke-dasharray="34.2 342.8" stroke-dashoffset="-297.8" transform="rotate(-90 80 80)"/>
              <text x="80" y="76" text-anchor="middle" font-size="18" font-weight="800" fill="#0a0f1e">67%</text>
              <text x="80" y="92" text-anchor="middle" font-size="10" fill="#94a3b8">digital</text>
            </svg>
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2 text-xs" *ngFor="let ch of channels">
                <div class="w-2.5 h-2.5 rounded-[3px] shrink-0" [style.background]="ch.color"></div>
                <span class="flex-1 text-slate-500">{{ ch.name }}</span>
                <span class="font-bold text-[#0a0f1e]">{{ ch.pct }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Heatmap hours -->
        <div class="bg-white rounded-[14px] p-6 border border-slate-100">
          <h3 class="text-[15px] font-bold text-[#0a0f1e] m-0 mb-0.5">Actividad por hora</h3>
          <p class="text-slate-500 m-0 text-[13px]">Pico de transacciones (esta semana)</p>
          <div class="mt-4">
            <div class="flex flex-col gap-[3px] float-left mr-1.5">
              <span *ngFor="let d of days" class="h-3.5 text-[10px] text-slate-400 leading-[14px]">{{ d }}</span>
            </div>
            <div class="grid grid-cols-8 gap-[3px]">
              <div
                *ngFor="let cell of heatmapData"
                class="h-3.5 rounded-sm cursor-pointer transition-opacity duration-150 hover:opacity-70"
                [style.background]="cellColor(cell.value)"
                [title]="cell.label">
              </div>
            </div>
            <div class="flex justify-between mt-1 pl-0">
              <span *ngFor="let h of hours" class="text-[9px] text-slate-400">{{ h }}</span>
            </div>
            <div class="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400">
              <span>Menos</span>
              <div class="flex gap-0.5">
                <div *ngFor="let s of scaleSteps" class="w-3.5 h-2.5 rounded-sm" [style.background]="cellColor(s)"></div>
              </div>
              <span>Más</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Table: Top users -->
      <div class="bg-white rounded-[14px] p-6 border border-slate-100">
        <div class="flex justify-between items-start mb-5">
          <div>
            <h3 class="text-[15px] font-bold text-[#0a0f1e] m-0 mb-0.5">Rendimiento por ejecutivo</h3>
            <p class="text-xs text-slate-400 m-0">Comparativa del equipo de ventas — {{ activePeriod }}</p>
          </div>
          <div>
            <input type="text" placeholder="Buscar ejecutivo..."
              class="border border-slate-200 rounded-lg py-[7px] px-3 text-[13px] outline-none font-[inherit]"
              [(ngModel)]="search" />
          </div>
        </div>
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="text-[11px] font-bold uppercase tracking-wide text-slate-400 py-2 px-3 text-left border-b border-slate-100">#</th>
              <th class="text-[11px] font-bold uppercase tracking-wide text-slate-400 py-2 px-3 text-left border-b border-slate-100">Ejecutivo</th>
              <th class="text-[11px] font-bold uppercase tracking-wide text-slate-400 py-2 px-3 text-left border-b border-slate-100">Ventas</th>
              <th class="text-[11px] font-bold uppercase tracking-wide text-slate-400 py-2 px-3 text-left border-b border-slate-100">Pedidos</th>
              <th class="text-[11px] font-bold uppercase tracking-wide text-slate-400 py-2 px-3 text-left border-b border-slate-100">Conversión</th>
              <th class="text-[11px] font-bold uppercase tracking-wide text-slate-400 py-2 px-3 text-left border-b border-slate-100">Ticket promedio</th>
              <th class="text-[11px] font-bold uppercase tracking-wide text-slate-400 py-2 px-3 text-left border-b border-slate-100">Tendencia</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let rep of filteredReps; let i = index">
              <td class="py-3 px-3 text-[13px] text-gray-700 border-b border-slate-50">
                <span [class]="'inline-flex w-6 h-6 items-center justify-center rounded-md text-xs font-extrabold '
                  + (i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-slate-100 text-slate-500' : i === 2 ? 'bg-orange-50 text-orange-700' : 'bg-slate-50 text-slate-400')">{{ i + 1 }}</span>
              </td>
              <td class="py-3 px-3 text-[13px] text-gray-700 border-b border-slate-50">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-full text-white font-bold text-[13px] flex items-center justify-center" [style.background]="rep.color">{{ rep.name[0] }}</div>
                  <div>
                    <span class="block font-semibold text-[#0a0f1e] text-[13px]">{{ rep.name }}</span>
                    <span class="block text-[11px] text-slate-400">{{ rep.region }}</span>
                  </div>
                </div>
              </td>
              <td class="py-3 px-3 text-[13px] border-b border-slate-50 font-bold text-[#0a0f1e]">{{ rep.sales }}</td>
              <td class="py-3 px-3 text-[13px] text-gray-700 border-b border-slate-50">{{ rep.orders }}</td>
              <td class="py-3 px-3 text-[13px] text-gray-700 border-b border-slate-50">
                <div class="flex items-center gap-2">
                  <div class="h-1.5 bg-violet-600 rounded-sm max-w-[80px]" [style.width]="rep.conv + '%'"></div>
                  <span>{{ rep.conv }}%</span>
                </div>
              </td>
              <td class="py-3 px-3 text-[13px] text-gray-700 border-b border-slate-50">{{ rep.ticket }}</td>
              <td class="py-3 px-3 text-[13px] text-gray-700 border-b border-slate-50">
                <span [class]="'py-0.5 px-2 rounded-full text-[11px] font-bold '
                  + (rep.trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600')">
                  {{ rep.trend > 0 ? '↑' : '↓' }} {{ Math.abs(rep.trend) }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class AnalyticsComponent {
  activePeriod = 'Este mes'
  search = ''
  Math = Math

  periods = ['Hoy', 'Esta semana', 'Este mes', 'Trimestre', 'Año']

  funnel = [
    { label: 'Visitantes', value: '12,400', pct: 100, drop: 0, color: '#7c3aed' },
    { label: 'Interesados', value: '6,820', pct: 55, drop: 45, color: '#6d28d9' },
    { label: 'Cotizaron', value: '3,100', pct: 25, drop: 30, color: '#5b21b6' },
    { label: 'Compraron', value: '1,488', pct: 12, drop: 13, color: '#4c1d95' },
  ]

  channels = [
    { name: 'Web directa', pct: 40, color: '#7c3aed' },
    { name: 'WhatsApp', pct: 27, color: '#3b82f6' },
    { name: 'Referidos', pct: 18, color: '#22c55e' },
    { name: 'Redes soc.', pct: 15, color: '#f97316' },
  ]

  days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  hours = ['6am', '9am', '12pm', '3pm', '6pm', '9pm', '12am', '3am']
  scaleSteps = [0, 20, 40, 60, 80, 100]

  heatmapData = Array.from({ length: 56 }, (_, i) => {
    const hour = i % 8
    const day = Math.floor(i / 8)
    // More activity during business hours (hours 1-4 = 9am-6pm)
    const isWorkHour = hour >= 1 && hour <= 4
    const isWeekday = day < 5
    const base = isWorkHour && isWeekday ? 60 : isWorkHour ? 30 : isWeekday ? 20 : 5
    const value = Math.min(100, base + Math.floor(Math.random() * 35))
    return { value, label: `${this.days[day]} ${this.hours[hour]}: ${value} transacciones` }
  })

  cellColor(v: number): string {
    if (v < 15) return '#f1f5f9'
    if (v < 35) return '#ddd6fe'
    if (v < 55) return '#a78bfa'
    if (v < 75) return '#7c3aed'
    return '#4c1d95'
  }

  reps = [
    { name: 'Ana Torres', region: 'Lima Norte', sales: 'S/ 18,400', orders: 42, conv: 78, ticket: 'S/ 438', trend: 14, color: '#7c3aed' },
    { name: 'Luis Ríos', region: 'Lima Sur', sales: 'S/ 14,200', orders: 38, conv: 65, ticket: 'S/ 374', trend: 8, color: '#3b82f6' },
    { name: 'María Chan', region: 'Lima Centro', sales: 'S/ 11,900', orders: 29, conv: 61, ticket: 'S/ 410', trend: -3, color: '#22c55e' },
    { name: 'Pedro Lima', region: 'Callao', sales: 'S/ 9,500', orders: 24, conv: 55, ticket: 'S/ 396', trend: 5, color: '#f97316' },
    { name: 'Sofia Vega', region: 'Miraflores', sales: 'S/ 7,800', orders: 19, conv: 48, ticket: 'S/ 411', trend: -7, color: '#ec4899' },
    { name: 'Carlos Paz', region: 'San Isidro', sales: 'S/ 6,100', orders: 15, conv: 42, ticket: 'S/ 407', trend: 2, color: '#14b8a6' },
  ]

  get filteredReps() {
    if (!this.search) return this.reps
    return this.reps.filter(r => r.name.toLowerCase().includes(this.search.toLowerCase()))
  }
}
