<template>
    <div class="flex items-center text-right text-xs text-gray-400">
        <button type="button" class="mr-2 text-gray-400 hover:text-gray-600" title="Stop timer" @click="stop" v-if="isRunning">
            <svg class="inline" width="32" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
        </button>

        <span
            class="inline-block w-20 text-center py-2 leading-none bg-gray-500 text-xs text-gray-300 rounded-lg"
            :class="{'bg-gray-900': isRunning}"
        >
            {{ sessionTime }}
        </span>
    </div>
</template>

<script>
import TimeManager from '@lib/TimeManager';

export default {
    name: 'Timer',

    props: {
        time: Number,
        startedAt: String,
        isRunning: {
            type: Boolean,
            default: true
        },
    },

    data () {
        return {
            currentTime: null,
            interval: null
        };
    },

    mounted () {
        if (this.isRunning) {
            this.currentTime = TimeManager.toSeconds(this.startedAt);

            this.interval = window.setInterval(() => {
                this.currentTime++;
            }, 1000);
        }
    },

    methods: {
        stop () {
            this.$emit('stop', this.currentTime);
        }
    },

    computed: {
        sessionTime () {
            if (this.isRunning) {
                return TimeManager.toFormattedTime(this.currentTime);
            }

            return TimeManager.toFormattedTime(this.time);
        },
    },

    watch: {
        isRunning (isRunning) {
            if (isRunning === false && this.interval) {
                window.clearInterval(this.interval);
            }
        }
    }
}
</script>
