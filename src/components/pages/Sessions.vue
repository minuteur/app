<template>
    <Layout title="Sessions">
        <template #header-left>
            <router-link :to="projectUrl" class="text-white">
                <svg class="inline" width="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </router-link>
        </template>

        <template #default>
            <div class="flex flex-col h-screen-85vh">
                <div class="flex-grow">
                    <ul v-if="sessions.length > 0">
                        <li v-for="(session, index) in sessions" :key="session.uuid">
                            <SessionRow
                                :session="session"
                                :odd="index % 2 === 0"
                                @session:updated="(name) => onSessionUpdated(index, name)"
                            ></SessionRow>
                        </li>
                    </ul>

                    <div v-else class="h-full flex flex-col justify-center self-center">
                        <div class="text-center">
                            <img src="./../../assets/empty.svg" alt="No clients found" class="inline">
                        </div>
                    </div>
                </div>

                <footer class="flex justify-between px-6 py-2 bg-gray-800 text-white">
                    <button type="button" @click="create" title="Add new session">+</button>
                </footer>
            </div>
        </template>
    </Layout>
</template>

<script>
import Session from '@models/Session'
import Layout from '@components/Layout';
import SessionRow from '@components/SessionRow';

export default {
    name: 'Sessions',

    components: {
        Layout,
        SessionRow,
    },

    async mounted () {
        await this.fetchSessions();
    },

    data () {
        return {
            sessions: []
        };
    },

    methods: {
        async create () {
            let session = await Session.create({
                project_uuid: this.$route.params.projectUuid,
                name: 'Session'
            });

            this.sessions.push(session);
        },

        async fetchSessions () {
            this.sessions = await Session.all(this.$route.params.projectUuid);
        },

        async onSessionUpdated (index, name) {
            this.sessions[index].name = name;

            Session.update(
                this.sessions[index].uuid,
                { name: name }
            );
        },
    },

    computed: {
        projectUrl () {
            return `/clients/${this.$route.params.uuid}/projects`;
        }
    }
}
</script>
