<template>
    <div
        :class="[odd ? 'bg-gray-100 hover:bg-gray-300' : 'bg-gray-300 hover:bg-gray-500']"
        class="flex justify-between transition duration-100"
        @click.right.prevent="openContextMenu"
    >
        <div class="px-6 py-2 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
            <span v-if="state == 'default'">
                <span class="block mb-1 leading-none"></span>{{ session.name }}
                <span class="block mt-1 leading-none text-xs text-gray-400">{{ session.date }}</span>
            </span>

            <input
                type="text"
                class="form-input block w-full transition duration-150 ease-in-out text-sm leading-5"
                :value="session.name"
                @keydown.enter="save"
                ref="input"
                v-else
            >
        </div>

        <div class="flex items-center px-6 py-4 text-right text-xs text-gray-400">
            <span
                class="inline-block mr-2 px-3 py-2 leading-none bg-gray-600 text-xs text-gray-300 rounded-lg"
                :class="{isRunning: 'bg-gray-900'}"
            >
                {{ sessionTime }}
            </span>

            <button type="button" class="text-gray-400" title="Stop timer" @click="stop" v-if="isRunning">
                <svg class="inline" width="32" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import TimeManager from '@lib/TimeManager';
import { remote } from 'electron';
const { Menu, MenuItem } = remote;

let runningInterval;

export default {
    props: {
        session: Object,
        odd: Boolean
    },

    mounted () {
        if (this.session.state === 'running') {
            runningInterval = window.setInterval(() => {
                this.$emit('section:time-updated', this.session.time + 1);
            }, 1000);
        }
    },

    data () {
        return {
            state: 'default',
            now: moment(),
        };
    },

    methods: {
        openContextMenu () {
            console.log('opening context menu');

            const menu = new Menu();
            menu.append(new MenuItem({
                label: 'Edit',
                click: () => this.edit(),
            }))

            menu.popup({ window: remote.getCurrentWindow() });
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

        stop () {
            window.clearInterval(runningInterval);

            this.$emit('session:stopped');
        }
    },

    computed: {
        sessionTime () {
            return TimeManager.toFormattedTime(this.session.time);
        },

        isRunning () {
            return this.session.state === 'running';
        }
    }
}
</script>
