<template>
    <div
        :class="[odd ? 'bg-gray-100 hover:bg-gray-300' : 'bg-gray-300 hover:bg-gray-500']"
        class="flex justify-between items-center select-none transition duration-100"
        @click.right.prevent="openContextMenu"
        @dblclick="goToSession"
    >
        <div class="px-4 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
            <div class="flex items-center" v-if="state == 'default'" @dblclick.stop="edit">
                <span class="mr-3">{{ project.name }}</span>

                <Timer :time="project.total_time" :is-running="false" title="Total timer so far" />
            </div>

            <input
                type="text"
                class="form-input block w-full transition duration-150 ease-in-out text-sm leading-5"
                :value="project.name"
                @keydown.enter="save"
                ref="input"
                v-else
            >
        </div>

        <div class="px-4 py-4 text-right">
            <div v-if="runningSession">
                <Timer
                    :time="runningSession.time"
                    :started-at="runningSession.started_at"
                    @stop="onStopTimer"
                />
            </div>

            <router-link :to="startNewSessionLink" v-else>
                <svg class="inline" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" title="Start timer">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                </svg>
            </router-link>
        </div>
    </div>
</template>

<script>
import { remote } from 'electron';
const { Menu, MenuItem } = remote;
import Session from '@models/Session';
import Timer from '@components/Timer';
import EventManager from '@lib/EventManager';

export default {
    props: {
        project: Object,
        odd: Boolean
    },

    components: {
        Timer,
    },

    data () {
        return {
            state: 'default',
            runningSession: null,
        };
    },

    async mounted () {
        this.runningSession = await Session.getRunningSession(this.project.uuid);

        EventManager.listen('sessions.changed', async () => {
            console.log('[ProjectRow.vue] Sessions updated via API, re-fetching to make sure the app is up-to-date');

            this.runningSession = await Session.getRunningSession(this.project.uuid);
        });
    },

    beforeDestroy () {
        EventManager.clear('sessions.changed');
    },

    methods: {
        openContextMenu () {
            console.log('opening context menu');

            const menu = new Menu();
            menu.append(new MenuItem({
                label: 'View',
                click: () => this.view(),
            }));
            menu.append(new MenuItem({
                label: 'Edit',
                click: () => this.edit(),
            }));

            menu.popup({ window: remote.getCurrentWindow() });
        },

        view () {
            this.goToSession();
        },

        edit () {
            this.state = 'edit';

            this.$nextTick(() => {
                this.$refs.input.focus();
            });
        },

        save (event) {
            this.$emit('project:updated', event.target.value);
            this.state = 'default';
        },

        onStopTimer (totalTime) {
            Session.stopTimer(
                this.runningSession.uuid,
                totalTime
            );

            this.goToSession({ edit: this.runningSession.uuid });
        },

        goToSession (extraParams = {}) {
            // this.$router.push(`/clients/${this.$route.params.uuid}/projects/${this.project.uuid}/sessions`);
            this.$router.push({
                name: 'client.projects.sessions',
                params: {
                    uuid: this.$route.params.uuid,
                    projectUuid: this.project.uuid,
                    ...extraParams,
                }
            });
        }
    },

    computed: {
        startNewSessionLink () {
            return {
                name: 'client.projects.sessions',
                params: {
                    uuid: this.$route.params.uuid,
                    projectUuid: this.project.uuid,
                    start: true
                }
            };
        }
    }
}
</script>
