<template>
    <Layout title="Projects">
        <div class="flex flex-col h-screen-85vh">
            <div class="flex-grow">

            </div>

            <footer class="flex justify-between px-6 py-2 bg-gray-800 text-white">
                <router-link to="/" class="text-white">
                    <svg class="inline" width="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                </router-link>

                <button type="button" @click="create" title="Add new project">+</button>
            </footer>
        </div>
    </Layout>
</template>

<script>
import Layout from './../Layout';
import Project from './../../lib/models/Project'

export default {
    name: 'Projects',

    components: { Layout },

    mounted () {
        // this.fetchClients();
    },

    data () {
        return {
            projects: []
        };
    },

    methods: {
        create () {
            let project = Project.create({
                client_uuid: this.$router.params.uuid,
                name: 'New project'
            });

            console.log(project);

            // this.clients.push(client);
        },

        async fetchClients () {
            // this.clients = await Client.all();
        }
    }
}
</script>
