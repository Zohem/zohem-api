import {IPlugin, IPluginInfo} from "../interfaces";
import * as Hapi from "hapi";

export default (): IPlugin => {
    return {
        register: (server: Hapi.Server): Promise<Hapi.Server> => {
            return new Promise<void>(resolve => {
                server.register([
                    require('inert'),
                    require('vision'),
                    {
                        register: require('hapi-swagger'),
                        options: {
                            info: {
                                title: 'Zohem - Zohem API',
                                description: 'API powering the the Zohem platform :)',
                                version: '0.1'
                            },
                            securityDefinitions: {
                                'jwt': {
                                    'type': 'apiKey',
                                    'name': 'Authorization',
                                    'in': 'header'
                                }
                            },
                            tags: [
                                {
                                    'name': 'users',
                                },
                                {
                                    'name': 'courses',
                                },
                                {
                                    'name': 'assignments',
                                },
                                {
                                  'name': 'reports',
                                }
                            ],
                            documentationPage: true,
                            documentationPath: '/docs'
                        }
                    }
                ]
                    , (error) => {
                        if (error) {
                            console.log('error', error);
                        }
                        resolve();
                    });
                });
        },
        info: () => {
            return {
                name: "Swagger Documentation",
                version: "1.0.0"
            };
        }
    };
};
