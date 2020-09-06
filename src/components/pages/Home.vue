<template>
    <Layout title="Clients">
        <div class="flex flex-col h-screen-85vh">
            <div class="flex-grow">
                <ul v-if="clients.length > 0">
                    <li v-for="(client, index) in clients" :key="client.uuid">
                        <router-link
                            :to="`/clients/${client.uuid}/projects`"
                            :class="[index % 2 === 0 ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-300 hover:bg-gray-400']"
                            class="flex justify-between transition duration-100 cursor-pointer"
                        >
                            <div class="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">{{ client.name }}</div>
                            <div class="px-6 py-4 text-right">
                                <svg class="inline" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                    <path fill-rule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                </svg>
                            </div>
                        </router-link>
                    </li>
                </ul>

                <div v-else class="h-full flex flex-col justify-center self-center">
                    <div class="text-center">
                        <h1 class="mb-6 text-lg text-gray-800">No clients found</h1>
                        <img src="./../../assets/empty.svg" alt="No clients found" class="inline">
                    </div>
                </div>
            </div>

            <footer class="px-6 py-2 bg-gray-800 text-white">
                <button type="button" @click="create" title="Add new client">+</button>
            </footer>
        </div>
    </Layout>
</template>

<script>
import Layout from './../Layout';
import Client from './../../lib/models/Client'

export default {
    name: 'Home',

    components: { Layout },

    mounted () {
        this.fetchClients();
    },

    data () {
        return {
            clients: []
        };
    },

    methods: {
        create () {
            let client = Client.create('New client');
            console.log(client);

            this.clients.push(client);
        },

        async fetchClients () {
            this.clients = await Client.all();
        }
    }
}
</script>
