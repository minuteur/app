const path = require('path');

module.exports = {
    configureWebpack: {
        devtool: 'source-map',

        resolve: {
            alias: {
                '@lib': path.resolve(__dirname, 'src', 'lib'),
                '@models': path.resolve(__dirname, 'src', 'lib/models'),
                '@components': path.resolve(__dirname, 'src', 'components'),
                '@pages': path.resolve(__dirname, 'src', 'components/pages'),
            }
        }
    },

    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
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
            }
        }
    }
}
