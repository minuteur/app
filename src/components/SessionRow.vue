<template>
    <div
        :class="[odd ? 'bg-gray-100 hover:bg-gray-300' : 'bg-gray-200 hover:bg-gray-400']"
        class="flex justify-between items-center transition duration-100"
        @click.right.prevent="openContextMenu"
    >
        <div class="px-6 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900 w-8/12">
            <span @dblclick.stop="edit" class="w-full">
                <p class="block mb-1 leading-none truncate" :title="session.name">{{ session.name }}</p>
                <p class="block leading-none text-xs text-gray-400">{{ session.date }}</p>
            </span>
        </div>

        <div class="px-6 py-4 text-right">
            <Timer
                :time="session.time"
                :started-at="session.started_at"
                :is-running="isRunning"
                @stop="onStopTimer"
            />
        </div>
    </div>
</template>

<script>
import Timer from '@components/Timer';
import { remote } from 'electron';
const { Menu, MenuItem } = remote;

export default {
    props: {
        session: Object,
        odd: Boolean
    },

    components: {
        Timer,
    },

    mounted () {
        //
    },

    data () {
        return {
            state: 'default',
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
            menu.append(new MenuItem({
                label: 'Delete',
                click: () => this.delete(),
            }))

            menu.popup({ window: remote.getCurrentWindow() });
        },

        edit () {
            this.$emit('session:edit');
        },

        delete () {
            this.$emit('session:deleted');
        },

        onStopTimer (totalTime) {
            this.$emit('session:stopped', totalTime);
        },
    },

    computed: {
        isRunning () {
            return this.session.state === 'running';
        }
    }
}
</script>
