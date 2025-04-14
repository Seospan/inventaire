import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

// Importation du JSON si besoin
// Remarque: avec Vite, vous pouvez importer des JSON directement
// import inventoryData from '../matos_updated.json'

const app = createApp(App)

// Si vous souhaitez rendre les données disponibles globalement
// app.provide('defaultInventory', inventoryData)

app.mount('#app')