import * as Mongoose from "mongoose";
var Schema = Mongoose.Schema;
var ObjectId = Schema.ObjectId;
//micropayments will be added once the data is pushed
export const MicropaySchema = new Mongoose.Schema({
	orgId:ObjectId,
	created: {type:Date,default:Date.now},
	value: Number
});

///Advertiser Schema 
export const advertiserSchema = new Mongoose.Schema(
{
	name: { type: String, unique: true, required: true },
	address: {type:String},
	lastWalletBal:{type:Number,default:0}
},
{
	timestamps:true
});
export const advModel = Mongoose.model('advertisers', advertiserSchema, 'advertisers');
export const microModel = Mongoose.model('advMicroTransactions', MicropaySchema, 'advMicroTransactions');
