module.exports = {
    purge: false,

    theme: {
        extend: {
            height: {
                'screen-15vh': '15vh',
                'screen-85vh': '85vh',
            }
        },

        customForms: theme => ({
            sm: {
                'input, textarea, multiselect, select': {
                    fontSize: theme('fontSize.sm'),
                    padding: `${theme('spacing.1')} ${theme('spacing.2')}`,
                },
                select: {
                    paddingRight: `${theme('spacing.4')}`,
                },
                'checkbox, radio': {
                    width: theme('spacing.3'),
                    height: theme('spacing.3'),
                },
            }
        }),
    },
    variants: {},

    plugins: [
        require('@tailwindcss/ui'),
    ],
}
