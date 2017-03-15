import * as Hapi from "hapi";
import * as Joi from "joi";
import {IServerConfigurations} from "../../configurations";

import PubController from "./pub-controller";
export default function (server: Hapi.Server, serverConfigs: IServerConfigurations, database: any) {

    const pubController = new PubController(serverConfigs, database);
    server.bind(pubController);

    server.route({
        method: 'POST',
        path: '/publishers',
        config: {
            description: 'Creates a new publisher.',
            tags: ['api'],
            validate: {
                payload: {
                    name: Joi.string().required(),
                    address: Joi.string().required(),
                    url: Joi.string().required(),
                    AutosAndVehicles:Joi.number(),
                    BeautyAndFitness:Joi.number(),
                    BooksAndLiterature:Joi.number(),
                    BusinessAndIndustrial:Joi.number(),
                    ComputersAndElectronics:Joi.number(),
                    Finance:Joi.number(),
                    FoodAndDrink:Joi.number(),
                    Games:Joi.number(),
                    Health:Joi.number(),
                    HobbiesAndLiesure:Joi.number(),
                    HomeAndGarden:Joi.number(),
                    InternetAndTelecom:Joi.number(),
                    JobsAndEducation:Joi.number(),
                    LawAndGovernment:Joi.number(),
                    OnlineCommunities:Joi.number(),
                    PeopleAndSociety:Joi.number(),
                    PetsAndAnimals:Joi.number(),
                    RealEstate:Joi.number(),
                    Reference:Joi.number(),
                    Science:Joi.number(),
                    Shopping:Joi.number(),
                    News:Joi.number(),
                    Sports:Joi.number(),
                    Adult:Joi.number(),
                    ArtsAndEntertainment:Joi.number(),
                    personal:Joi.number()
                }
            },
            response: {
                schema: Joi.object({
                    success: Joi.bool().required()
                })
            },
            auth: 'jwt',
            plugins: {'hapiAuthorization':{roles:['PUBLISHER','SUPERUSER']}},
            handler: pubController.createPublisher
        }
    });

    server.route({
        method: 'POST',
        path: '/publishers/{publisherid}/users',
        config: {
            description: 'Create a new user under the publisher with the given ID.',
            tags: ['api'],
            validate: {
                params: {
                    publisherid: Joi.string()
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
            plugins: {'hapiAuthorization':{roles:['PUBLISHER','SUPERUSER']}},

            handler: pubController.addNewUser
        }
    });

    ///the api endpoint to get all the publishers
    server.route({
        method: 'GET',
        path: '/publishers',
        config: {
            description: 'Returns all the Publishers',
            tags: ['api'],
            auth: 'jwt',
            plugins: {'hapiAuthorization': {roles:['PUBLISHER','SUPERUSER']}},

            handler: pubController.getAllPublishers
        }
    });

    ///the api endpoint to get a particular publisher by the id
    server.route({
        method: 'GET',
        path: '/publishers/{publisherid}',
        config: {
            description: 'Get publisher info by ID.',
            validate: {
                params: {
                    publisherid: Joi.string().required()
                }
            },
            auth:"jwt",
            plugins: {'hapiAuthorization': {roles:['PUBLISHER','SUPERUSER']}},

            tags: ['api'],
            handler: pubController.getPublisher
        }
    });


    ///the api endpoint to get users by pub id
    server.route({
        method: 'GET',
        path: '/publishers/{publisherid}/users',
        config: {
            description: 'Get all users of publisher info by ID.',
            validate: {
               params: {
                    publisherid: Joi.string()
                }
            },
            tags: ['api'],
            auth: 'jwt',
            plugins: {'hapiAuthorization': {roles:['PUBLISHER','SUPERUSER']}},

            handler: pubController.getUserPub
        }
    });

    ///the api endpoint to get user by pub id and its own id 
    server.route({
        method: 'GET',
        path: '/publishers/{publisherid}/users/{userid}',
        config: {
            description: 'Get user of publisher info by ID.',
            validate: {
               params: {
                    publisherid: Joi.string(),
                    userid: Joi.string()
                }
            },
            tags: ['api'],
            auth: 'jwt',
            plugins: {'hapiAuthorization': {roles:['PUBLISHER','SUPERUSER']}},

            handler: pubController.getUser
        }
    });

    server.route({
        method: 'PUT',
        path: '/publishers/{publisherid}/users/{userid}',
        config: {
            description: 'Update Publisher User info by ID.',
            validate: {
               params: {
                    publisherid: Joi.string(),
                    userid: Joi.string()
                },
                payload:{
                    name:Joi.string()
                }
            },
            tags: ['api'],
            auth: 'jwt',
            plugins: {'hapiAuthorization': {roles:['PUBLISHER','SUPERUSER']}},

            handler: pubController.editUser
        }
    });

    ///api endpoint to get the balance of the publisher by id

    server.route({
        method: 'GET',
        path: '/publishers/{publisherid}/walletbal',
        config: {
            description: 'Get publisher balance zdt by ID.',
            validate: {
               params: {
                    publisherid: Joi.string()
                }
            },    
            tags: ['api'],
            auth: 'jwt',
            plugins: {'hapiAuthorization': {roles:['PUBLISHER','SUPERUSER']}},

            handler: pubController.balanceOfPub
        }
    });

    ///api endpoint to transfer the amount to his address
    ///will call the contract

    server.route({
        method: 'POST',
        path: '/publishers/{publisherid}/transfer',
        config: {
            description: 'Transfers zdt to publisher',
           validate: {
               params: {
                    publisherid: Joi.string()
                },
                payload:{
                    value:Joi.number()
                }
            },
            response: {
                schema: Joi.object({
                    success: Joi.bool().required()
                })
            },
            tags: ['api'],
            auth: 'jwt',
            plugins: {'hapiAuthorization': {roles:['PUBLISHER','SUPERUSER']}},

            handler: pubController.transferMicroPayouts
        }
    });

	///api endpoinit to get the microPayouts balance

	server.route({
        method: 'GET',
        path: '/publishers/{publisherid}/pendingbalance',
        config: {
            description: 'Get pending balance by ID.',
            validate: {
               params: {
                    publisherid: Joi.string()
                }
            },
            tags: ['api'],
            auth: 'jwt',
            plugins: {'hapiAuthorization': {roles:['PUBLISHER','SUPERUSER']}},

            handler: pubController.getMicroPayoutsBalance
        }
    });

        server.route({
        method: 'GET',
        path: '/publishers/{publisherid}/micropayments',
        config: {
            description: 'Get micropayments by ID.',
            validate: {
               params: {
                    publisherid: Joi.string()
                }
            },
            tags: ['api'],
            auth: 'jwt',
            plugins: {'hapiAuthorization': {roles:['PUBLISHER','SUPERUSER']}},

            handler: pubController.getMicropyaments
        }
    });

        server.route({
            method: 'GET',
            path: '/publishers/{publisherid}/getData',
            config: {
                description: 'Get micropayouts by ID.',
                validate: {
               params: {
                    publisherid: Joi.string()
                }
            },
                tags: ['api'],
                handler: pubController.getData
            }
        });

        server.route({
            method: 'GET',
            path: '/graphs/pieChartTypes',
            config: {
                description: 'Get chart data by pie chart.',

                tags: ['api'],
                handler: pubController.getPieChartDatatype
            }
        });


        server.route({
            method: 'GET',
            path: '/graphs/chartCountry',
            config: {
                description: 'Get chart Data by regions.',

                tags: ['api'],
                handler: pubController.getChartRegions
            }
        });

        // server.route({
        //     method: 'GET',
        //     path: '/getZDTForTime',
        //     config: {
        //         description: 'Get chart Data by zdt values.',

        //         tags: ['api'],
        //         handler: pubController.getzdtforTime
        //     }
        // });


}
