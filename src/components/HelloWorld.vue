<template>
    <div class="flex items-center justify-center h-full">
        <h1 class="text-2xl">{{ msg }}</h1>
    </div>
</template>

<script>
export default {
    name: 'HelloWorld',
    props: {
        msg: String
    }
}
</script>
