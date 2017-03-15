import { IPlugin ,IPluginOptions} from "../interfaces";
import * as Hapi from "hapi";
import * as aclauth from 'hapi-authorization';

export default (): IPlugin => {
    return {
        register: (server: Hapi.Server, options: IPluginOptions): Promise<void>  => {
            return new Promise<void>(resolve => {
                const database = options.database;
                const serverConfig = options.serverConfigs;

                const validateUser = (decoded, request, cb) => {
                    request.userId = decoded.id;
                    console.log("mukul");
                    console.log(decoded);
                    cb(null, true, {userId: decoded.id, role: decoded.role});

                };

                var plugins = [
                    {
                        register: require('hapi-auth-basic')
                    },
                    {
                        register: require('hapi-authorization'),
                        options:{
                        	roles:["PUBLISHER","ADVERTISER","SUPERUSER"]
                        }
                    }
                ];
                server.register(plugins, (error,res) => {
                    if (error) {
                        console.log('error', error);
                    } else {
                        server.auth.strategy('simple', 'basic', {validateFunc: validateUser});
                        console.log("---------------------------------------->>>");
                    }
                    resolve();
                });
            });
        },
        info: () => {
            return {
                name: "ACL Authorization",
                version: "1.0.0"
            };
        }
    };
};



