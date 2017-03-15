import * as Mongoose from "mongoose";
var Schema = Mongoose.Schema;
var ObjectId = Schema.ObjectId;

export const payouts = new Mongoose.Schema({
	value:Number,
	created:{type:Date,default:Date.now}
});

export const countries = new Mongoose.Schema({
		India:{type:Number,default:0},
		Afghanistan:{type:Number,default:0},
		Albania:{type:Number,default:0},
		Algeria:{type:Number,default:0},
		Andorra:{type:Number,default:0},
		Angola:{type:Number,default:0},
		Anguilla:{type:Number,default:0},
		Argentina:{type:Number,default:0},
		Armenia:{type:Number,default:0},
		Australia:{type:Number,default:0},
		Austria:{type:Number,default:0},
		Azerbaijan:{type:Number,default:0},
		Bahamas:{type:Number,default:0},
		Bahrain:{type:Number,default:0},
		Bangladesh:{type:Number,default:0},
		Barbados:{type:Number,default:0},
		Belarus:{type:Number,default:0},
		Belgium:{type:Number,default:0},
		Belize:{type:Number,default:0},
		Benin:{type:Number,default:0},
		Bermuda:{type:Number,default:0},
		AntiguaAndBarbuda:{type:Number,default:0},
		Bhutan:{type:Number,default:0},
		Bolivia:{type:Number,default:0},
		Botswana:{type:Number,default:0},
		Brazil:{type:Number,default:0},
});

export const dataSchema = new Mongoose.Schema({
  name: {type:Number,default:0},
  address: {type:Number,default:0},
  region: {type:Number,default:0},
  firstName:{type:Number,default:0},
  fullName:{type:Number,default:0},
  zip:{type:Number,default:0},
  browser:{type:Number,default:0},
  browserVersion:{type:Number,default:0},
  deviceType:{type:Number,default:0},
  Engine:{type:Number,default:0},
  EngineVersion:{type:Number,default:0},
  systemLanguage:{type:Number,default:0},
  country:{type:Number,default:0},
  state:{type:Number,default:0},
  interests:{type:Number,default:0},
  language:{type:Number,default:0},
  timezone:{type:Number,default:0},
  OS:{type:Number,default:0},
  OsVersion:{type:Number,default:0},
  device:{type:Number,default:0},
  version:{type:Number,default:0},
  getCPU:{type:Number,default:0},
  interest:{type:Number,default:0}	
});

export const payoutSchemas = new Mongoose.Schema({
	started:{type:Date,default:Date.now},
	payouts:{type:Number,default:0},
	country:{type:countries,default:countries},
	totalCountries:Number,
	datatypes:{type:dataSchema,default:dataSchema}
});

export const payoutGraphSchema = new Mongoose.Schema({
	orgId:ObjectId,
	scheme:[payoutSchemas]
});

export const payoutModel = Mongoose.model('hourlyZDTPayoutStats',payoutGraphSchema, 'hourlyZDTPayoutStats');
export const payoutsModel = Mongoose.model('_hourlyZDTPayoutStats', payouts, '_hourlyZDTPayoutStats'); 
export const countriesModel = Mongoose.model('countries',countries, 'countries');
export const dataTypeModel = Mongoose.model('dataPoints',dataSchema, 'dataPoints');
export const payoutSchemaModel = Mongoose.model('hourlyZDTPayoutSchema',payoutSchemas, 'hourlyZDTPayoutSchema');
