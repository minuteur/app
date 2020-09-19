<template>
    <span
        class="inline-block mr-2 px-3 py-2 leading-none bg-gray-600 text-xs text-gray-300 rounded-lg"
        :class="{isRunning: 'bg-gray-900'}"
    >
        {{ sessionTime }}
    </span>
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
        };
    },

    mounted () {
        if (this.isRunning) {
            this.currentTime = TimeManager.toSeconds(this.startedAt);

            window.setInterval(() => {
                this.currentTime++;
            }, 1000);
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
}
</script>
