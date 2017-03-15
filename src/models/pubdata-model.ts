import * as Mongoose from "mongoose";
var Schema = Mongoose.Schema;
var ObjectId = Schema.ObjectId;
import {afterConfidence} from "../controllers/publisher_data/trustScore";

export const micropaySchema = new Mongoose.Schema({
  ciBefore:{type:Number,default:0},
  ciAfter:{type:Number,default:0},
  value:String,
  fingerprint:String,
  datatype:String,
  payoutCalculated:{type:Number,default:0},
  country:{type:String,default:"India"},
  orgId:{type:ObjectId},
  createdDate:{type:Date,default:Date.now},
  payoutGiven:{type:Boolean,default:false}
});

export const dataSchema = new  Mongoose.Schema({
  value:String,
  confidenceInterval:{type:Number,default:0}
},{ _id : false });

export const interestSchema = new Mongoose.Schema({
    AutosAndVehicles:{
      AutosAndVehicles:{type:Number,default:0}
    },
    BeautyAndFitness:{
      BeautyAndFitness:{type:Number,default:0}
    },
    BooksAndLiterature:{
      BooksAndLiterature:{type:Number,default:0}
    },
    BusinessAndIndustrial:{
      BusinessAndIndustrial:{type:Number,default:0}
    },
    ComputersAndElectronics:{
      ComputersAndElectronics:{type:Number,default:0}
    },
    Finance:{
      Finance:{type:Number,default:0}
    },
    FoodAndDrink:{
      FoodAndDrink:{type:Number,default:0}
    },
    Games:{
      Games:{type:Number,default:0}
    },
    Health:{
      Health:{type:Number,default:0}
    },
    HobbiesAndLiesure:{
      HobbiesAndLiesure:{type:Number,default:0}
    },
    HomeAndGarden:{
      HomeAndGarden:{type:Number,default:0}
    },
    InternetAndTelecom:{
      InternetAndTelecom:{type:Number,default:0}
    },
    JobsAndEducation:{
      JobsAndEducation:{type:Number,default:0}
    },
    LawAndGovernment:{
      LawAndGovernment:{type:Number,default:0}
    },
    OnlineCommunities:{
      OnlineCommunities:{type:Number,default:0}
    },
    PeopleAndSociety:{
      PeopleAndSociety:{type:Number,default:0}
    },
    PetsAndAnimals:{
      PetsAndAnimals:{type:Number,default:0}
    },
    RealEstate:{
      RealEstate:{type:Number,default:0}
    },
    Reference:{
      Reference:{type:Number,default:0}
    },
    Science:{
      Science:{type:Number,default:0}
    },
    Shopping:{
      Shopping:{type:Number,default:0}
    },
    Travel:{
      Travel:{type:Number,default:0}
    },
    News:{
      News:{type:Number,default:0},
    },
    Sports:{
      Sports:{type:Number,default:0},
    },
    Adult:{
      Adult:{type:Number,default:0}
     },
    ArtsAndEntertainment:{
      ArtsAndEntertainment:{type:Number,default:0}    
    }
},{ _id : false });



export const PubDataSchema = new Mongoose.Schema(
{
	fingerprint: { type: String, unique: true, required: true },
  browser:[dataSchema],
  browserVersion:[dataSchema],
  deviceType:[dataSchema],
  Engine:[dataSchema],
  EngineVersion:[dataSchema],
  systemLanguage:[dataSchema],
  interest:{type:interestSchema,default:interestSchema},
  language:[dataSchema],
  timezone:[dataSchema],
  OS:[dataSchema],
  OsVersion:[dataSchema],
  device:[dataSchema],
  version:[dataSchema],
  getCPU:[dataSchema]
});

PubDataSchema.method.findOneOrCreate = function findOneOrCreate(condition, doc, callback) {
  const self = this;
  self.findOne(condition, (err, result) => {
    return result 
      ? callback(err, result)
      : self.create(doc, (err, result) => {
        return callback(err, result);
      });
  });
};

micropaySchema.pre('save',function(next){
  let arr = ["India","USA","Russia","Australia","Iran"];
  let i = Math.floor((Math.random() * 4) + 0);
  this.country = arr[i];
  return next();  
});

// export const dataModel  = Mongoose.model('dataData', dataSchema);
export const pubDataModel = Mongoose.model('userData', PubDataSchema, 'userData');
export const micropayModel = Mongoose.model('publisherMicroTransactions',micropaySchema, 'publisherMicroTransactions');
