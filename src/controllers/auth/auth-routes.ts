import * as Hapi from "hapi";
import * as Joi from "joi";
import {IServerConfigurations} from "../../configurations";

import AuthController from "./auth-controller";
export default function (server: Hapi.Server, serverConfigs: IServerConfigurations, database: any) {

    const authController = new AuthController(serverConfigs, database);
    server.bind(authController);
    ///the api endpoint to get all the publishers
   server.route({
           method: 'POST',
           path: '/auth/login',
           config: {
               description: 'Login route',
               validate: {
                   payload: {
                       email: Joi.string().required(),
                       password: Joi.string().required()
                   }
               },
              
               tags: ['api'],
               handler: authController.login,
           }
       });

//    server.route({
//            method: 'POST',
//            path: '/google',
//            config: {
//                description: 'Get the text ',
//                tags: ['api'],
//                handler: authController.getDataFromGoogle
//            }
//        });

}
