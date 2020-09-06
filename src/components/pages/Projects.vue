<template>
    <Layout title="Projects">
        <div class="flex flex-col h-screen-85vh">
            <div class="flex-grow">
                <ul v-if="projects.length > 0">
                    <li v-for="(project, index) in projects" :key="project.uuid">
                        <router-link
                            :to="`/projects/${project.uuid}/projects`"
                            :class="[index % 2 === 0 ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-300 hover:bg-gray-400']"
                            class="flex justify-between transition duration-100 cursor-pointer"
                        >
                            <div class="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
                                {{ project.name }}
                            </div>

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
                        <img src="./../../assets/empty.svg" alt="No clients found" class="inline">
                    </div>
                </div>
            </div>

            <footer class="flex justify-between px-6 py-2 bg-gray-800 text-white">
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
        this.fetchProjects();
    },

    data () {
        return {
            projects: []
        };
    },

    methods: {
        async create () {
            let project = await Project.create({
                client_uuid: this.$route.params.uuid,
                name: 'New project'
            });

            console.log(project);

            // this.clients.push(client);
        },

        async fetchProjects () {
            // this.clients = await Client.all();
        }
    }
}
</script>
