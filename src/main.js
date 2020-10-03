import Vue from 'vue'
import api from './api';
import App from './App.vue'
import Home from '@pages/Home'
import VueRouter from 'vue-router'
import Projects from '@pages/Projects'
import Sessions from '@pages/Sessions'
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
    { name: 'home', path: '/', component: Home },
    { name: 'client.projects', path: '/clients/:uuid/projects', component: Projects },
    { name: 'client.projects.sessions', path: '/clients/:uuid/projects/:projectUuid/sessions', component: Sessions },
]

const router = new VueRouter({
    routes: routes
})

DatabaseManager.init();
DatabaseManager.migrate().then(() => {
    new Vue({
        router: router,
        render: h => h(App),

        beforeDestroy () {
            console.log('before destroy!');
        }
    }).$mount('#app')

    /**
     * Starting the API server...
     */
    const port = 22507;

    api.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
});
