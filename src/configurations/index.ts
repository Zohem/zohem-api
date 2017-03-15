import * as nconf from "nconf";
import * as path from "path";

//Read Configurations
const configs = new nconf.Provider({
  env: true,
  argv: true,
  store: {
    type: 'file',
      file: path.join(__dirname, `./config.${process.env.ZOHEM_ENV}.json`)
  }
});

export interface IServerConfigurations {
    port: number;
    plugins: Array<string>;
    jwtSecret: string;
    jwtExpiration: string;
    trustScoreConfidenceStepDown: number;
}

export interface IDataConfiguration {
    client: string;
    connectionString: string
}

export function checkConfigEnvironment(): void {
    if (!!configs.get("database") === false) {
        console.error('Check ZOHEM_ENV variable');
        process.exit();
    }
}

export function getDatabaseConfig(): IDataConfiguration {
    checkConfigEnvironment();
    console.log("Node Environment: ", process.env.ZOHEM_ENV);
    return configs.get("database");
}

export function getServerConfigs(): IServerConfigurations {
    checkConfigEnvironment();
    return configs.get("server");
}