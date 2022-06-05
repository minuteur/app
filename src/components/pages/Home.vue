<template>
    <Layout title="Clients">
        <div class="flex flex-col h-screen-85vh">
            <div class="flex-grow">
                <ul v-if="clients.length > 0">
                    <li v-for="(client, index) in clients" :key="client.uuid">
                        <ClientRow
                            :client="client"
                            :odd="index % 2 === 0"
                            @client:updated="(name) => onClientUpdated(index, name)"
                        ></ClientRow>
                    </li>
                </ul>

                <div v-else class="h-full flex flex-col justify-center self-center">
                    <div class="text-center">
                        <h1 class="mb-6 text-lg text-gray-800">No clients found</h1>
                        <img src="./../../assets/empty.svg" alt="No clients found" class="inline">
                    </div>
                </div>
            </div>

            <footer class="px-6 py-2 bg-gray-800 text-white flex justify-between">
                <button type="button" @click="create" title="Add new client">+</button>
                <button type="button" @click="openTimer" title="Open timer" class="text-sm">Open timer</button>
            </footer>
        </div>
    </Layout>
</template>

<script>
import Layout from './../Layout';
import ClientRow from './../ClientRow'
import { ipcRenderer } from 'electron';
import ClientModel from './../../lib/models/Client'

export default {
    name: 'Home',

    components: { Layout, ClientRow },

    mounted () {
        this.fetchClients();
    },

    data () {
        return {
            state: 'default',
            clients: []
        };
    },

    methods: {
        async create () {
            let client = await ClientModel.create({name: 'New client'});

            this.clients.push(client);
        },

        async fetchClients () {
            this.clients = await ClientModel.all();
        },

        async onClientUpdated (index, name) {
            this.clients[index].name = name;

            ClientModel.update(
                this.clients[index].uuid,
                { name: name }
            );
        },

        openTimer () {
            ipcRenderer.send('timer-window:open', {});
        },
    }
}
</script>
