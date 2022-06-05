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
                                @session:stopped="() => onSessionStopped(index)"
                            ></SessionRow>
                        </li>
                    </ul>

                    <div v-else class="h-full flex flex-col justify-center self-center">
                        <div class="text-center">
                            <img src="./../../assets/empty.svg" alt="No clients found" class="inline">
                        </div>
                    </div>

                    <!-- Session edit overlay -->
                    <div class="fixed w-full h-full top-0 left-0 bg-gray-900 opacity-50 overflow-hidden" v-if="state === 'edit'"></div>
                    <div class="fixed w-full bottom-0 left-0 px-6 py-4 bg-gray-800 shadow border-t-4 border-t-gray-700" v-if="state === 'edit'">
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

                        <div class="flex justify-between">
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

                            <div>
                                <label for="hours" class="block text-sm font-medium leading-5 text-white">Time</label>
                                <div class="flex mt-1 relative rounded-md shadow-sm">
                                    <input
                                        id="hours"
                                        class="form-input form-input-sm block w-12 sm:text-sm sm:leading-5 mr-2"
                                        placeholder="H"
                                        type="text"
                                        v-model="edit.session.hours"
                                        @keydown.enter="update"
                                    >

                                    <input
                                        id="minutes"
                                        class="form-input form-input-sm block w-12 sm:text-sm sm:leading-5 mr-2"
                                        placeholder="M"
                                        type="text"
                                        v-model="edit.session.minutes"
                                        @keydown.enter="update"
                                    >

                                    <input
                                        id="seconds"
                                        class="form-input form-input-sm block w-12 sm:text-sm sm:leading-5"
                                        placeholder="S"
                                        type="text"
                                        v-model="edit.session.seconds"
                                        @keydown.enter="update"
                                    >
                                </div>
                            </div>
                        </div>
                    </div><!-- Edit overlay -->
                </div>

                <footer class="flex justify-between px-6 py-2 bg-gray-800 text-white">
                    <button type="button" @click="create" title="Add new session">+</button>

                    <div class="px-4 py-1 text-xs bg-gray-900 text-white text-center rounded-md">
                        {{ totalTime }} total
                    </div>

                    <div>
                        <button type="button" @click="openTimer" title="Open timer" class="text-sm text-white">
                            <img src="./../../assets/open.svg" alt="Open timer window" class="inline" width="12">
                        </button>
                    </div>
                </footer>
            </div>
        </template>
    </Layout>
</template>

<script>
import { ipcRenderer } from 'electron';
import TimeManager from '@lib/TimeManager';
import Session from '@models/Session';
import { SESSION_STATUS_DONE, SESSION_STATUS_RUNNING } from '@models/Session';
import Layout from '@components/Layout';
import SessionRow from '@components/SessionRow';
import EventManager from '@lib/EventManager';

export default {
    name: 'Sessions',

    components: {
        Layout,
        SessionRow,
    },

    async mounted () {
        this.listenToEvents();
        await this.fetchSessions();

        if (this.$route.params.start === true && ! this.hasRunningSession) {
            this.create();
        }
    },

    beforeDestroy () {
        EventManager.clear('sessions.changed');
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
        listenToEvents () {
            EventManager.listen('sessions.changed', async () => {
            console.log('Sessions updated via API, re-fetching to make sure the app is up-to-date');

            await this.fetchSessions();
        });

            ipcRenderer.on('sessions:changed', async (event, args) => {
                await this.fetchSessions();

                if (args.session_uuid) {
                    this.openSessionEdit(args.session_uuid);
                }
            });
        },

        openSessionEdit (session_uuid) {
            let session = this.sessions.find(session => session.uuid === session_uuid);

            if (session) {
                this.onSessionEdit(this.sessions.indexOf(session));
            }
        },

        async create () {
            let session = await Session.create({
                project_uuid: this.$route.params.projectUuid,
            });

            this.sessions.push(session);
            ipcRenderer.send('sessions:added', {});
        },

        async fetchSessions () {
            this.sessions = await Session.all(this.$route.params.projectUuid);
        },

        async onSessionEdit (index) {
            this.edit.session = this.sessions[index];
            this.edit.session.hours = TimeManager.hoursFromSeconds(this.edit.session.time);
            this.edit.session.minutes = TimeManager.minutesFromSeconds(this.edit.session.time);
            this.edit.session.seconds = TimeManager.secondsFromSeconds(this.edit.session.time);
            this.state = 'edit';

            this.$nextTick(() => {
                this.$refs.name.focus();
            })
        },

        async update () {
            let time = TimeManager.convertToSeconds(
                this.edit.session.hours,
                this.edit.session.minutes,
                this.edit.session.seconds,
            );

            this.edit.session.time = time;

            await Session.update(
                this.edit.session.uuid,
                {
                    name: this.edit.session.name,
                    date: this.edit.session.date,
                    time: time
                }
            );

            this.state = 'default';
        },

        async onSessionDeleted (index) {
            await Session.delete(this.sessions[index].uuid);

            this.sessions.splice(index, 1);
        },

        async onSessionStopped (index) {
            let totalTime = TimeManager.round(TimeManager.toSeconds(this.sessions[index].started_at));

            this.sessions[index].state = SESSION_STATUS_DONE;
            this.sessions[index].time = totalTime;

            await Session.stopTimer(
                this.sessions[index].uuid,
                totalTime
            );

            this.onSessionEdit(index);
        },

        openTimer () {
            ipcRenderer.send('timer-window:open', {});
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
        },

        totalTime () {
            const totalTime = this.sessions.reduce((total, session) => {
                return total + session.time;
            }, 0);

            return TimeManager.toFormattedTimeWithoutSeconds(totalTime);
        },
    }
}
</script>
