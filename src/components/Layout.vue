<template>
    <div class="flex flex-col min-h-screen w-full">
        <div class="flex justify-between items-center h-screen-15vh px-6 py-4 bg-gray-800 text-white">
            <slot name="header-left">
                <div></div>
            </slot>

            <slot name="header-center">
                <h3 class="text-center text-lg">{{ title }}</h3>
            </slot>

            <slot name="header-right">
                <div></div>
            </slot>
        </div>

        <div class="flex-grow">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: String
    }
}
</script>
