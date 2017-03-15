import * as Hapi from 'hapi';
import { IServerConfigurations } from './configurations';
import {contract,WEB3} from './web3';
import * as Pub from './controllers/publisher';
import * as Adv from './controllers/advertiser';
import * as PubData from './controllers/publisher_data';
import {Scheduler} from './cron';
import * as Auth from './controllers/auth';
import { IPlugin } from './plugins/interfaces';
var async = require('async');
var cors = require('cors');

export function init(serverConfigs: IServerConfigurations, databaseConfig: any): Promise<Hapi.Server> {
    return new Promise<Hapi.Server>(resolve => {
        const port = process.env.port || serverConfigs.port;
        const server = new Hapi.Server();

        server.connection({
            port: port,
            routes: {
                cors: {
                    'headers': ['Accept', 'Authorization', 'Content-Type', 'If-None-Match', 'Accept-language']
                },
                log: true
            }
        });
        // server.ext('onPreResponse', corsHeaders);

        //  Setup Hapi Plugins
        const plugins: Array<string> = serverConfigs.plugins;
        const pluginOptions = {
            database: databaseConfig,
            serverConfigs: serverConfigs
        };

        let pluginPromises = [];

        plugins.forEach((pluginName: string) => {
            let plugin: IPlugin = (require('./plugins/' + pluginName)).default();
            console.log(`Register Plugin ${plugin.info().name} v${plugin.info().version}`);
            pluginPromises.push(plugin.register(server, pluginOptions)); });

        // Register all the routes once all plugins have been initialized
        Promise.all(pluginPromises).then(() => {
            Pub.init(server, serverConfigs, databaseConfig);
            Adv.init(server, serverConfigs, databaseConfig);
            PubData.init(server,serverConfigs,databaseConfig);
            Auth.init(server,serverConfigs,databaseConfig);
            resolve(server);
        });
        console.log("linking publisher contract");
        let sch = new Scheduler(serverConfigs,databaseConfig);
        sch.scheduler();
    });
}