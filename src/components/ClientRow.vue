<template>
    <div
        :class="[odd ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-300 hover:bg-gray-400']"
        class="flex justify-between select-none transition duration-100 cursor-pointer"
        @click.right.prevent="openContextMenu"
        @dblclick="goToProjects(client)"
    >
        <div class="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
            <span v-if="state == 'default'">{{ client.name }}</span>

            <input
                type="text"
                class="form-input block w-full transition duration-150 ease-in-out text-sm leading-5"
                :value="client.name"
                @keydown.enter="save"
                ref="input"
                v-else
            >
        </div>

        <div class="px-6 py-4 text-right">
            <svg class="inline" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                <path fill-rule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
        </div>
    </div>
</template>

<script>
import { remote } from 'electron';
const { Menu, MenuItem } = remote;

export default {
    props: {
        client: Object,
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
            this.$emit('client:updated', event.target.value);
            this.state = 'default';
        },

        goToProjects (client) {
            this.$router.push(`/clients/${client.uuid}/projects`);
        }
    },

    computed: {

    }
}
</script>
