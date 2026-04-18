import '../style.css'
import { createApp, reactive } from 'vue'
import ProductsPage from '../pages/ProductsPage.vue'

export default function mount(el, bridge) {
  const app = createApp(ProductsPage)
  if (bridge) {
    const shared = reactive(bridge.getState())
    bridge.subscribe(state => Object.assign(shared, state))
    app.provide('sharedState', shared)
    app.provide('sharedBridge', bridge)
  }
  app.mount(el)
  return app
}
