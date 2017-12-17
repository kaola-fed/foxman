import EasyKoa from 'easy-koa'
import { Module } from '@easy-koa/shared'
import { Forwarder } from '@easy-koa/plugin-forwarder';
import * as path from 'path';

@Module({
    logger: {
        application: 'foxman',
        logdir: path.join(__dirname, 'logs'),
        options: {},
    },
    monitor: {
        disabled: false,
    },
    server: {
        middlewares: [], // koa middlewares, async function first
        interceptors: [
        ],
        controllers: [
        ],
        renderOptions: {
            root: path.join(__dirname, 'view'),
        },
        port: 3000,
    },

    components: [
        new Forwarder({
            secure: false,
            proxyTimeout: 3000,
            host: 'm.kaola.com',
            headers: {
                'a': 'b',
            },
            xfwd: true,
            target: 'https://m.kaola.com',
        }),
    ],

    config: {
        x: 1,
    },
})
class FoxmanEasyKoa extends EasyKoa {}

const foxmanEasyKoa: FoxmanEasyKoa = FoxmanEasyKoa.create()

foxmanEasyKoa
    .run()
    .then(function(): any {
        // do something in completed
    })
    .catch((e: any) => {
        console.log(e)
    })
