import * as Mongoose from "mongoose";
import {N} from '../controllers/publisher_data/trustScore';
import {UserSchema} from './user-model';
var Schema = Mongoose.Schema;
var ObjectId = Schema.ObjectId;

/**export const PubUserSchema = new Mongoose.Schema({
	fingerprint:String,
	data:String
});**/

///micropayments will be added once the data is pushed
export const MicropayoutSchema = new Mongoose.Schema({
	orgId:ObjectId,
	created:{type:Date,default:Date.now},
	value: Number
});

export const PubSchema = new Mongoose.Schema(
{
	name: { type: String, unique: true, required: true },
	url:String,
	trustScore:
	{
		      AutosAndVehicles:{type:Number,default:0},
		      BeautyAndFitness:{type:Number,default:0},
		      BooksAndLiterature:{type:Number,default:0},
		      BusinessAndIndustrial:{type:Number,default:0},
		      ComputersAndElectronics:{type:Number,default:0},
		      Finance:{type:Number,default:0},
		      FoodAndDrink:{type:Number,default:0},
		      Games:{type:Number,default:0},
		      Health:{type:Number,default:0},
		      HobbiesAndLiesure:{type:Number,default:0},
		      HomeAndGarden:{type:Number,default:0},
		      InternetAndTelecom:{type:Number,default:0},
		      JobsAndEducation:{type:Number,default:0},
		      LawAndGovernment:{type:Number,default:0},
		      OnlineCommunities:{type:Number,default:0},
		      PeopleAndSociety:{type:Number,default:0},
		      PetsAndAnimals:{type:Number,default:0},
		      RealEstate:{type:Number,default:0},
		      Reference:{type:Number,default:0},
		      Science:{type:Number,default:0},
		      Shopping:{type:Number,default:0},
		      News:{type:Number,default:0},
		      Sports:{type:Number,default:0},
		      Adult:{type:Number,default:0},
		      ArtsAndEntertainment:{type:Number,default:0},
		      personal:{type:Number,default:0}
	},
	micropayoutbal: {type:Number,default:0},
	address: {type:String},
},
{
	timestamps:true
});

/**PubSchema.pre('save',function(next){
const pubschema = this;
 N(this.url, function(err,res){
	if(res){
		pubschema.trustScore = res;
	console.log(pubschema.trustScore);
	return next();
	}
	else{
		console.log("error");
	}
});

});
**/
export const pubModel = Mongoose.model('publishers', PubSchema, 'publishers');
// export const micropayoutModel = Mongoose.model('publisherMicroTransactions',MicropayoutSchema);
