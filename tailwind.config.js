module.exports = {
    purge: [
        './src/**/*.vue',
    ],
    theme: {
        extend: {
            height: {
                'screen-15vh': '15vh',
                'screen-85vh': '85vh',
            }
        },
    },
    variants: {},

    plugins: [
        require('@tailwindcss/ui'),
    ],
}
