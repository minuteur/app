<template>
    <div
        :class="[odd ? 'bg-gray-100 hover:bg-gray-300' : 'bg-gray-300 hover:bg-gray-500']"
        class="flex justify-between select-none transition duration-100"
        @click.right.prevent="openContextMenu"
    >
        <div class="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
            <span v-if="state == 'default'">{{ session.name }}</span>

            <input
                type="text"
                class="form-input block w-full transition duration-150 ease-in-out text-sm leading-5"
                :value="session.name"
                @keydown.enter="save"
                ref="input"
                v-else
            >
        </div>

        <div class="px-6 py-4 text-right text-xs text-gray-400">
            <span>{{ session.date }}</span>
        </div>
    </div>
</template>

<script>
import { remote } from 'electron';
const { Menu, MenuItem } = remote;

export default {
    props: {
        session: Object,
        odd: Boolean
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
        }
    },

    computed: {

    }
}
</script>
