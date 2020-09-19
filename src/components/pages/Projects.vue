<template>
    <Layout title="Projects">
        <template #header-left>
            <router-link to="/" class="text-white">
                <svg class="inline" width="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </router-link>
        </template>

        <template #default>
            <div class="flex flex-col h-screen-85vh">
                <div class="flex-grow">
                    <ul v-if="projects.length > 0">
                        <li v-for="(project, index) in projects" :key="project.uuid">
                            <ProjectRow
                                :project="project"
                                :odd="index % 2 === 0"
                                @project:updated="(name) => onProjectUpdated(index, name)"
                            ></ProjectRow>
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
        </template>
    </Layout>
</template>

<script>
import Layout from '@components/Layout';
import ProjectRow from '@components/ProjectRow'
import Project from '@models/Project'

export default {
    name: 'Projects',

    components: {
        Layout,
        ProjectRow
    },

    async mounted () {
        await this.fetchProjects();
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

            this.projects.push(project);
        },

        async fetchProjects () {
            this.projects = await Project.all(this.$route.params.uuid);
        },

        async onProjectUpdated (index, name) {
            this.projects[index].name = name;

            Project.update(
                this.projects[index].uuid,
                { name: name }
            );
        },
    }
}
</script>
