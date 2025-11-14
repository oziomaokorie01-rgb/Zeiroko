const webpack = require('webpack');

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};

        // Add ALL necessary polyfills (for process, crypto, stream, etc.)
            Object.assign(fallback, {
                    "crypto": require.resolve("crypto-browserify"),
                            "stream": require.resolve("stream-browserify"),
                                    "assert": require.resolve("assert/"),
                                            "http": require.resolve("stream-http"),
                                                    "https": require.resolve("https-browserify"),
                                                            "os": require.resolve("os-browserify"),
                                                                    "url": require.resolve("url"),
                                                                            "path": require.resolve("path-browserify"),
                                                                                    "process/browser": require.resolve("process/browser") 
                                                                                        });

                                                                                            config.resolve.fallback = fallback;

                                                                                                // Add the plugins for Buffer and process global variables
                                                                                                    config.plugins = (config.plugins || []).concat([
                                                                                                            new webpack.ProvidePlugin({
                                                                                                                        process: 'process/browser',
                                                                                                                                    Buffer: ['buffer', 'Buffer'],
                                                                                                                                            }),
                                                                                                                                                ]);

                                                                                                                                                    return config;
                                                                                                                                                    }
                                                                                                                                                    