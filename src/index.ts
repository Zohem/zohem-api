import * as Server from "./server";
import * as Database from "./database";
import * as Configs from "./configurations";

//Init Database
const dbConfigs = Configs.getDatabaseConfig();
const databaseConfig = Database.init(dbConfigs);
export default databaseConfig;

const serverConfigs = Configs.getServerConfigs();

//Starting Application Server
const server = Server.init(serverConfigs, databaseConfig)
    .then((server) => {
        if (!module.parent) {
            server.start((err) => {
                console.log(err);
                console.log('Server running at:', server.info.uri);
            });
            
            console.log("Running server from parent :)");
        } else {
            console.log("Not running the server because it is not run through parent module.");
        }
    });