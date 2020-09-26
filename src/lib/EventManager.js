import Vue from 'vue';

class EventManager {
    constructor () {
        this.vue = new Vue;
    }

    listen (event, ...params) {
        this.vue.$on(event, ...params);
    }

    fire (event, ...params) {
        this.vue.$emit(event, ...params);
    }
}

export default new EventManager;
