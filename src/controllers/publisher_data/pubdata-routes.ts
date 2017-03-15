import * as Hapi from "hapi";
import * as Joi from "joi";
import {IServerConfigurations} from "../../configurations";

import PubDataController from "./pubdata-controller";
export default function (server: Hapi.Server, serverConfigs: IServerConfigurations, database: any) {

    const pubController = new PubDataController(serverConfigs, database);
    server.bind(pubController);
    ///the api endpoint to get all the publishers
    server.route({
        method: 'POST',
        path: '/publishers/{publisherId}/pushData',
        config: {
            validate: {
                params: {
                    publisherId: Joi.string()
                },
                payload: {
                    fingerprint: Joi.string().required(),
                    browser: Joi.string(),
                    language: Joi.string(),
                    browserVersion: Joi.string(),
                    country: Joi.string(),
                }
            },
            description: 'This will be internally used by Zohem infra to push data about a user which it got from the SDK.',
            tags: ['api'],
            auth: 'jwt',
            plugins: {'hapiAuthorization':{roles:['PUBLISHER','SUPERUSER']}},
            handler: pubController.pushData
        }
    });

    ///the api endpoint to get all the Data
    server.route({
        method: 'GET',
        path: '/testing/getAllUserData',
        config: {
            description: 'Returns all the Data',
            tags: ['api'],
            auth: 'jwt',
            plugins: {'hapiAuthorization':{roles:['PUBLISHER','SUPERUSER']}},

            handler: pubController.getAllData
        }
    });

    // server.route({
    //     method: 'POST',
    //     path: '/pushsomeData',
    //     config: {
    //         description: 'pushed data ',
    //         tags: ['api'],
    //         handler: pubController.pushsomedata
    //     }
    // });

    server.route({
        method: 'POST',
        path: '/publishers/pushInterests',
        config: {
            description: 'pushed data ',
            tags: ['api'],
            // auth: 'jwt',
            // plugins: {'hapiAuthorization':{role:'PUBLISHER'}},
            handler: pubController.pubDataInterests
        }
    });

    server.route({
        method: 'POST',
        path: '/testing/createSuperAdminUser',
        config: {
            validate: {
                payload: {
                    name: Joi.string().required(),
                    password: Joi.string().required(),
                    email: Joi.string().required()
                }
            },
            description: 'Create a super admin user.',
            tags: ['api', 'testing'],
            handler: pubController.createSuperAdminUser
        }
    });

}
