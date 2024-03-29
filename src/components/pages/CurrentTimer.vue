<template>
    <div class="flex flex-col min-h-screen w-full">
        <div v-for="session in sessions" :key="session.uuid" class="p-4">
            <div class="flex justify-between" :title="session.project.name">
                <div class="text-sm pt-1 text-gray-500 truncate pr-2">
                    <span v-if="session.project">{{ session.project.name }}</span>
                </div>
                <Timer
                    v-if="session.time"
                    :time="session.time"
                    :started-at="session.started_at"
                    :is-running="session.state === 'running'"
                    @stop="onStopTimer(session)"
                />
            </div>
        </div>

        <div v-if="sessions.length === 0" class="text-center text-gray-600 mt-5">
            No active sessions
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { ipcRenderer } from 'electron';
import Timer from '@components/Timer';
import Session from '@models/Session';
import Project from '@models/Project';
import TimeManager from '@lib/TimeManager';
import { SESSION_STATUS_DONE } from '@models/Session';

export default {
    name: 'CurrentTimer',

    components: {
        Timer,
    },

    data () {
        return {
            state: 'default',
            sessions: [],
        };
    },

    async mounted () {
        this.listenToEvents();
        await this.fetchActiveSessions();
    },

    methods: {
        listenToEvents () {
            ipcRenderer.on('sessions:changed', () => {
                this.fetchActiveSessions();
            });
        },

        async fetchActiveSessions () {
            this.sessions = await Session.active();
            this.sessions.forEach(async (session, index) => {
                Vue.set(this.sessions[index], 'project', await Project.find(session.project_uuid));
                console.log(this.sessions[index].project)
            });
        },

        async onStopTimer (session) {
            let totalTime = TimeManager.round(TimeManager.toSeconds(session.started_at));

            session.state = SESSION_STATUS_DONE;
            session.time = totalTime;

            await Session.stopTimer(
                session.uuid,
                totalTime
            );

            ipcRenderer.send('current-timer:sessions:changed', {
                session_uuid: session.uuid,
            });

            this.fetchActiveSessions();
        },
    }
};
</script>
