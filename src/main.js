import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Home from './components/pages/Home'
import Projects from './components/pages/Projects'
import DatabaseManager from './lib/DatabaseManager'

const Storage = require('electron-store');

// We keep our main storage as a global variable
// so that it's automatically available in all
// our components
window.mainStorage = new Storage({
    watch: true,
    defaults: {
        email: '',
        licenseKey: ''
    }
});

Vue.use(VueRouter)
Vue.config.productionTip = false

const routes = [
    { path: '/', component: Home },
    { path: '/clients/:uuid/projects', component: Projects },
]

const router = new VueRouter({
    routes: routes
})

DatabaseManager.init()

new Vue({
    router: router,
    render: h => h(App),
}).$mount('#app')
