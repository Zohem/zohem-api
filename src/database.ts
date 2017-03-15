import * as Mongoose from "mongoose";
import { IDataConfiguration } from "./configurations";
import { IUser, UserModel } from "./models/user-model";
import { pubModel} from './models/pub-model';
import { pubDataModel, micropayModel } from './models/pubdata-model'
import { advModel, microModel } from './models/advertiser-model';
import { payoutModel, payoutsModel, dataTypeModel, countriesModel, payoutSchemaModel } from './models/payoutgraph-model';

export interface IDatabase {
    zohemUsers: Mongoose.Model<IUser>;
    publishers: Mongoose.Model;
    userData: Mongoose.Model;
    advertisers: Mongoose.Model;
    micropayModel: Mongoose.Model;
    microModel:Mongoose.Model;
    payoutModel:Mongoose.Model;
    payoutsModel:Mongoose.Model;
    dataTypeModel:Mongoose.Model;
    countriesModel:Mongoose.Model;
    payoutSchemaModel:Mongoose.Model;
}

export function init(config: IDataConfiguration): IDatabase {

    (<any>Mongoose).Promise = Promise;
    Mongoose.connect(process.env.MONGO_URL || config.connectionString);

    let mongoDb = Mongoose.connection;

    mongoDb.on('error', () => {
        console.log(`Unable to connect to database: ${config.connectionString}`);
    });

    mongoDb.once('open', () => {
        console.log(`Connected to database: ${config.connectionString}`);
    });

    return {
        zohemUsers: UserModel,
        publishers: pubModel,
        userData: pubDataModel,
        advertisers: advModel,
        micropayModel:micropayModel,
        microModel:microModel,
        payoutModel:payoutModel,
        payoutsModel:payoutsModel,
        countriesModel:countriesModel,
        dataTypeModel:dataTypeModel,
        payoutSchemaModel:payoutSchemaModel
    };
}