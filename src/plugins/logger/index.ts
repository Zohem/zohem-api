import { IPlugin } from "../interfaces";
import * as Hapi from "hapi";

export default (): IPlugin => {
    return {
        register: (server: Hapi.Server): Promise<Hapi.Server> => {
            return new Promise<void>(resolve => {
                const opts = {
                    opsInterval: 1000,
                    reporters: [{
                        reporter: require('good-console'),
                        events: { error: '*', log: '*', response: '*', request: '*' }
                    }]
                };

                server.register({
                    register: require('good'),
                    options: opts
                }, (error) => {
                    if (error) {
                        console.log('error', error);
                    }
                resolve();
                });
            });
        },
        info: () => {
            return {
                name: "Good Logger",
                version: "1.0.0"
            };
        }
    };
};