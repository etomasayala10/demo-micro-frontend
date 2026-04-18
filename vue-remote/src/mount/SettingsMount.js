import '../style.css'
import { createApp, reactive } from 'vue'
import SettingsPage from '../pages/SettingsPage.vue'

export default function mount(el, bridge) {
  const app = createApp(SettingsPage)
  if (bridge) {
    const shared = reactive(bridge.getState())
    bridge.subscribe(state => Object.assign(shared, state))
    app.provide('sharedState', shared)
    app.provide('sharedBridge', bridge)
  }
  app.mount(el)
  return app
}
