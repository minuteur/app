<template>
    <div
        :class="[odd ? 'bg-gray-100 hover:bg-gray-300' : 'bg-gray-300 hover:bg-gray-500']"
        class="flex justify-between select-none transition duration-100"
        @click.right.prevent="openContextMenu"
    >
        <div class="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
            <span v-if="state == 'default'">{{ project.name }}</span>

            <input
                type="text"
                class="form-input block w-full transition duration-150 ease-in-out text-sm leading-5"
                :value="project.name"
                @keydown.enter="save"
                ref="input"
                v-else
            >
        </div>

        <div class="px-6 py-4 text-right">
            <router-link :to="`/clients/${$route.params.uuid}/projects/${project.uuid}/sessions`">
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

export default {
    props: {
        project: Object,
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
