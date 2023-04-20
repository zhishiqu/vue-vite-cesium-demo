/*
 * @Author: zhishiqu
 * @Description: 
 * @Date: 2023-04-18 10:18:49
 * @LastEditTime: 2023-04-18 16:32:35
 * @FilePath: \vue-vite-cesium-demo\vite.config.js
 */
import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium'
import babel from 'vite-babel-plugin'

const { geoserverHost } = require('./public/setting')

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const isDev = mode === 'development'
    const proxyHost = isDev ? 'http://192.168.2.196:8085/' : geoserverHost
    // const proxyHost = 'http://192.168.2.196:8085/'
    return {
        plugins: [vue(), cesium(), babel()],
        base: './',
        sourcemap: isDev,
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src'),
                '~': resolve(__dirname, 'public')
            }
            // extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
        },
        optimizeDeps: {
            // include: ['axios'],
        },
        define: {
            'process.env': {}
        },
        build: {
            target: 'modules',
            outDir: 'dist',
            assetsDir: 'assets',
            minify: 'terser' // terser
        },
        server: {
            cors: true,
            open: false,
            host: '0.0.0.0',
            port: 9999,
            proxy: {
                '/geoserver': {
                    target: proxyHost, // proxy site
                    changeOrigin: true
                },
                '/terrain': {
                    target: proxyHost, // proxy site
                    changeOrigin: true
                }
            }
        }
    }
})
