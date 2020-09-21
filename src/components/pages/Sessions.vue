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
                                @session:edit="() => onSessionEdit(index)"
                                @session:deleted="() => onSessionDeleted(index)"
                                @section:time-updated="(time) => session.time = time"
                                @session:stopped="(totalTime) => onSessionStopped(index, totalTime)"
                            ></SessionRow>
                        </li>
                    </ul>

                    <div v-else class="h-full flex flex-col justify-center self-center">
                        <div class="text-center">
                            <img src="./../../assets/empty.svg" alt="No clients found" class="inline">
                        </div>
                    </div>

                    <!-- Session edit overlay -->
                    <div class="absolute w-full bottom-0 left-0 px-6 py-4 bg-gray-800 shadow border-t-4 border-t-gray-700" v-if="state === 'edit'">
                        <div class="mb-3">
                            <label for="name" class="block text-sm font-medium leading-5 text-white">Session name</label>
                            <div class="mt-1 relative rounded-md shadow-sm">
                                <input
                                    id="name"
                                    class="form-input form-input-sm block w-full sm:text-sm sm:leading-5"
                                    placeholder="Session name"
                                    ref="name"
                                    v-model="edit.session.name"
                                    @keydown.enter="update"
                                >
                            </div>
                        </div>

                        <div>
                            <label for="date" class="block text-sm font-medium leading-5 text-white">Date</label>
                            <div class="mt-1 relative rounded-md shadow-sm">
                                <input
                                    id="date"
                                    class="form-input form-input-sm block w-full sm:text-sm sm:leading-5"
                                    placeholder="YYYY-MM-DD"
                                    type="date"
                                    ref="date"
                                    v-model="edit.session.date"
                                    @keydown.enter="update"
                                >
                            </div>
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
import { SESSION_STATUS_DONE, SESSION_STATUS_RUNNING } from '@models/Session'
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

        if (this.$route.params.start === true && ! this.hasRunningSession) {
            this.create();
        }
    },

    data () {
        return {
            state: 'default',
            sessions: [],
            edit: {
                session: {}
            },
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

        async onSessionEdit (index) {
            this.edit.session = this.sessions[index];
            this.state = 'edit';

            this.$nextTick(() => {
                this.$refs.name.focus();
            })
        },

        async update () {
            await Session.update(
                this.edit.session.uuid,
                {
                    name: this.edit.session.name,
                    date: this.edit.session.date
                }
            );

            this.state = 'default';
        },

        async onSessionDeleted (index) {
            await Session.delete(this.sessions[index].uuid);

            this.sessions.splice(index, 1);
        },

        async onSessionStopped (index, totalTime) {
            this.sessions[index].state = SESSION_STATUS_DONE;
            this.sessions[index].time = totalTime;

            await Session.stopTimer(
                this.sessions[index].uuid,
                totalTime
            );

            this.onSessionEdit(index);
        },
    },

    computed: {
        projectUrl () {
            return `/clients/${this.$route.params.uuid}/projects`;
        },

        hasRunningSession () {
            return this.sessions.filter((session) => {
                return session.state === SESSION_STATUS_RUNNING;
            }).length > 0;
        }
    }
}
</script>
