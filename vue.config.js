module.exports = {
    configureWebpack: {
        devtool: 'source-map'
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
