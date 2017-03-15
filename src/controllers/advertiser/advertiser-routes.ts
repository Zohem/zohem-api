import * as Hapi from "hapi";
import * as Joi from "joi";
import {IServerConfigurations} from "../../configurations";

import AdvController from "./advertiser-controller";
export default function (server: Hapi.Server, serverConfigs: IServerConfigurations, database: any) {

    const advController = new AdvController(serverConfigs, database);
    server.bind(advController);

    server.route({
        method: 'POST',
        path: '/advertisers',
        config: {
            description: 'Create a new advertiser',
            tags: ['api'],
            validate: {
                payload: {
                    name: Joi.string().required(),
                    address: Joi.string().required(),
                }
            },
            auth: 'jwt',
            plugins: {'hapiAuthorization':{roles:['SUPERUSER','ADVERTISER']}},
            handler: advController.createAdvertiser
        }
    });


    server.route({
            method: 'GET',
            path: '/advertisers/{fingerprint}',
            config: {
                description: 'Get all data of user by fingerprint.',
                validate: {
                    params: {
                       fingerprint: Joi.number()
                    }
                },
                tags: ['api'],
                auth: 'jwt',
                plugins: {'hapiAuthorization':{roles:['SUPERUSER','ADVERTISER']}},
                handler: advController.getAllData,
            }
        });

    server.route({
            method: 'GET',
            path: '/advertisers',
            config: {
                description: 'Get all advertisers.',
                tags: ['api'],
                auth: 'jwt',
                plugins: {'hapiAuthorization':{roles:['SUPERUSER','ADVERTISER']}},

                handler: advController.getAllAdvertisers,
            }
        });

    server.route({
        method: 'POST',
        path: '/advertisers/{advertiserId}/users',
        config: {
            description: 'Create a new user under the advertiser with the given ID.',
            tags: ['api'],
            validate: {
                params: {
                   advertiserId: Joi.string()
                },
                payload: {
                    name: Joi.string().required(),
                    email: Joi.string().required(),
                    password: Joi.string().required()
                }
            },
            response: {
                schema: Joi.object({
                    success: Joi.bool().required()
                })
            },
            auth: 'jwt',
            plugins: {'hapiAuthorization':{roles:['SUPERUSER','ADVERTISER']}},

            handler: advController.addNewUser
        }
    });


    server.route({
        method: 'GET',
        path: '/advertisers/{advertiserid}/users',
        config: {
            description: 'Get all users of advertiser info by ID.',
            validate: {
               params: {
                   advertiserid: Joi.string()
                }
            },
            tags: ['api'],
            auth: 'jwt',
            plugins: {'hapiAuthorization':{roles:['SUPERUSER','ADVERTISER']}},

            handler: advController.getUserPub
        }
    });

    server.route({
        method: 'GET',
        path: '/advertisers/{advertiserid}/users/{userid}',
        config: {
            description: 'Get user of advertiser info by ID.',
            validate: {
               params: {
                    advertiserid: Joi.string(),
                    userid: Joi.string()
                }
            },
            tags: ['api'],
            auth: 'jwt',
            plugins: {'hapiAuthorization':{roles:['SUPERUSER','ADVERTISER']}},
            handler: advController.getUser
        }
    });

    server.route({
            method: 'GET',
            path: '/advertisers/getSomeData',
            config: {
                description: 'Get all data of user by querying.',
                tags: ['api'],
                auth: 'jwt',
                plugins: {'hapiAuthorization':{roles:['SUPERUSER','ADVERTISER']}},

                handler: advController.getSomeData
            }
        });

    server.route({
            method: 'GET',
            path: '/advertisers/{advertiserid}/loadedbalance',
            config: {
                description: 'Get Actual Zohem Token balance of advertiser',
                validate: {
                    params: {
                        advertiserid: Joi.string().required(),
                    }
                },
                tags: ['api'],
                auth: 'jwt',
                plugins: {'hapiAuthorization':{roles:['SUPERUSER','ADVERTISER']}},

                handler: advController.getBalance
            }
        });

    server.route({
        method: 'PUT',
        path: '/advertisers/{advertiserid}/users/{userid}',
        config: {
            description: 'Update Advertiser User info by ID.',
            validate: {
               params: {
                    advertiserid: Joi.string(),
                    userid: Joi.string()
                },
                payload:{
                    name:Joi.string()
                }
            },
            tags: ['api'],
            auth: 'jwt',
            plugins: {'hapiAuthorization':{roles:['SUPERUSER','ADVERTISER']}},

            handler: advController.editUser
        }
    });

    server.route({
            method: 'GET',
            path: '/advertisers/{advertiserid}/walletbalance',
            config: {
                description: 'Get wallet balance of advertiser',
                validate: {
                    params: {
                        advertiserid: Joi.string().required(),
                    }               
                },
                tags: ['api'],
                auth: 'jwt',
                plugins: {'hapiAuthorization':{roles:['SUPERUSER','ADVERTISER']}},

                handler: advController.getWalletBal
            }
        });

    server.route({
            method: 'POST',
            path: '/advertisers/{advertiserid}/transferToWallet',
            config: {
                description: 'transfer To Wallet',
                validate: {
                    params: {
                        advertiserid: Joi.string().required(),
                    } ,
                    payload:{
                        value:Joi.number().required()
                    }              
                },
                tags: ['api'],
                auth: 'jwt',
                plugins: {'hapiAuthorization':{roles:['SUPERUSER','ADVERTISER']}},

                handler: advController.transferToWallet
            }
        });


   

}
