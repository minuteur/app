<template>
    <div class="flex flex-col min-h-screen w-full">
        <div class="flex justify-center h-screen-15vh px-6 py-4 bg-gray-800 text-white">
            <h3 class="text-center text-lg">{{ title }}</h3>
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
