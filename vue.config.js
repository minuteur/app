const path = require('path');
const { IgnorePlugin } = require('webpack');

module.exports = {
    configureWebpack: {
        devtool: 'source-map',

        resolve: {
            mainFields: ['module', 'main'],
            alias: {
                'knex-migrations': path.resolve(__dirname, 'node_modules', 'knex/lib/migrate'),
                '@lib': path.resolve(__dirname, 'src', 'lib'),
                '@models': path.resolve(__dirname, 'src', 'lib/models'),
                '@components': path.resolve(__dirname, 'src', 'components'),
                '@pages': path.resolve(__dirname, 'src', 'components/pages'),
            }
        },

        plugins: [
            new IgnorePlugin({
                resourceRegExp: /\/migrate$/,
                contextRegExp: /knex$/
            })
        ]
    },

    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                extraResources: [
                    {
                        from: 'migrations',
                        to: 'migrations',
                        filter: ['**/*'],
                    },
                    {
                        from: 'db/.gitignore',
                        to: 'db/.gitignore'
                    }
                ],

                mac: {
                    hardenedRuntime: true,
                    entitlements: "./build/entitlements.mac.inherit.plist"
                },
                linux: {
                  target: ["AppImage"]
                },
                publish: ['github'],
                appId: 'com.minuteur',
                afterSign: './afterSignHook.js'
            },
        }
    }
}
