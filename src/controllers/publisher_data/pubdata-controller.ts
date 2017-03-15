import * as Hapi from 'hapi';
import { IServerConfigurations } from '../../configurations';
import './trustScore';
import {ob} from './scores';
var lodash = require('lodash');
var async = require('async');
import * as Boom from "boom";
var ObjectId = require('mongoose').Types.ObjectId; 
import {contract,WEB3} from '../../web3';
import {afterConfidence} from './trustScore';
import {getType} from './types';
import {convert} from '../../controllers/auth/convert';
var arr = ["fullName","name","firstName","OsVersion","region","zip","country","state","timezone","OS","getCPU","version","systemLanguage","language","device","browser","browserVersion","Engine","EngineVersion"];
export default class PubDataController{
	private configs: IServerConfigurations;
	private database: any;

	constructor(configs: IServerConfigurations, database: any) {
	    this.database = database;
	    this.configs = configs;
	}

	public getAllData(request:Hapi.Request, reply:Hapi.IReply){
		this.database.userData.find((err,docs)=>{
			if(err){
				reply({"message":err});
			}else{
				reply(docs);
			}
		});
	}

	public pushsomedata(request:Hapi.Request, reply:Hapi.IReply){
		this.database.userData.findOneAndUpdate({
			"fingerprint":10111,
			"name" : [{
				"value":"100",
				"confidenceInterval":"1000	"
			}]
		},{},{upseresponsePub:true,new:true}).then((res)=>{
			console.log(res);
		}).catch((err)=>{
			console.log(err)
		});
	}

	public pushData(request:Hapi.Request, reply:Hapi.IReply){

        // Kyunki humein achi JS nahi aati
        var that = this;

        // Get the publisher with the publisher ID we got in the request.
        this.database.publishers.findOne({ "_id": new ObjectId(request.params.publisherId) }).then( (pubDoc) => {
            // See if the fingerprint given in the request exists or not
            return this.database.userData.findOne({ "fingerprint": request.payload.fingerprint }).then( (userDoc) => {
                return Promise.resolve({userDoc: userDoc, pubDoc: pubDoc});
            });
        })
        // Here either the user document would be null (if no user with the fingerprint exists) or will have the document with
        // corresponding fingerprint in Mongo
        .then( (docs) => {

            // console.log(docs);

            // Get all the data point keys which the user has sent
            let dataPointKeys = Object.keys(request.payload);
            dataPointKeys.splice( dataPointKeys.indexOf("fingerprint"), 1 );
            dataPointKeys.splice( dataPointKeys.indexOf("country"), 1 );

            // The case where no user document with the given fingerprint exists
            if(docs.userDoc === null) {
                let dpconfscorearray = [];
                let dpModelObjs = {};
                for (let i=0; i<dataPointKeys.length; i++) {
                    // Get the trust score of the particular category which the currently iterated data point belongs to
                    let dataPointKey = dataPointKeys[i];
                    let dataPointCategory = getType[dataPointKey];
                    let dataPointCategoryTrustScore = docs.pubDoc.trustScore[dataPointCategory];
                    let confidenceInterval = (1 - 0) * dataPointCategoryTrustScore * this.configs.trustScoreConfidenceStepDown; // (1-C)*TS*SD
                    dpModelObjs[dataPointKey] = [{ // this obj can directly be given to mongoose for creation
                        'value': request.payload[dataPointKey],
                        'confidenceInterval': confidenceInterval
                    }];
                }

                // prepare the document to send to mongoose
                let finalUserDoc = { "fingerprint": request.payload.fingerprint }
                Object.assign(finalUserDoc, dpModelObjs);

                // let userModelInstance = new this.database.userModel;
                return this.database.userData.create(finalUserDoc).then( (newUserDoc) => {
                    return reply({ success: true })
                });
            } else if (docs.userDoc !== null) {
                // Mongo update query
                let updateQuery = {
                    "$push": {},
                    "$set": {}
                }

                // Check which data points already exist on the user document and check which don't
                // Do corresponding actions accordingly
                for (let i=0; i<dataPointKeys.length; i++) {

                    // Check if the data point exists or not
                    let dataPointKey = dataPointKeys[i];
                    let dataPointFound = false;
                    let foundDataPointIndex = null;
                    let confidenceInterval = null;
                    lodash.forEach(docs.userDoc[dataPointKey], function(item, index){
                        if (item.value == request.payload[dataPointKey]) {
                            dataPointFound = true;
                            foundDataPointIndex = index;
                            confidenceInterval = item.confidenceInterval;
                        }
                    })

                    // Shit for trust score
                    let dataPointCategory = getType[dataPointKey];
                    let dataPointCategoryTrustScore = docs.pubDoc.trustScore[dataPointCategory];

                    // If the data point exists already on the user document
                    if(dataPointFound) {
                        let pastConfidenceInterval = confidenceInterval;
                        confidenceInterval = (1 - pastConfidenceInterval) * dataPointCategoryTrustScore * this.configs.trustScoreConfidenceStepDown;
                        updateQuery['$set'][dataPointKey + '.' + foundDataPointIndex.toString() + '.confidenceInterval'] = confidenceInterval;
                    }
                    // If the data point does not exist on the user document
                    else {
                        confidenceInterval = (1 - 0) * dataPointCategoryTrustScore * this.configs.trustScoreConfidenceStepDown;
                        updateQuery['$push'][dataPointKey] = {
                            'value': request.payload[dataPointKey],
                            'confidenceInterval': confidenceInterval
                        }
                    }
                }

                if ((Object.keys(updateQuery['$push']).length === 0)) {
                    delete updateQuery['$push'];
                }
                if ((Object.keys(updateQuery['$set']).length === 0)) {
                    delete updateQuery['$set'];
                }
                console.log(updateQuery);
                this.database.userData.update({ "fingerprint": request.payload.fingerprint }, updateQuery).then( (query) => {
                    console.log(query);
                    return reply({ success: true });
                });
            }

        })
        
	}

    public pubDataInterests(request:Hapi.Request, reply:Hapi.IReply){
        var keys = Object.keys((request.payload));
        // var keys = Object.keys(JSON.parse(request.payload));
            this.database.userData.findOne({
                "fingerprint":"1234"
            }).then((response)=>{
                var finalarrinterests = [];
                var finalarrconfidencees = [];
                var finObj = {};
                var matchObj = {};
                async.eachSeries(keys,function(item,cb){
                 var arr = convert(item);
                console.log("keys are ---------------------->");
                console.log(item);
                var len = arr.length;
                var element = arr[0];
                if(len>0){
                    if(request.payload[item]>0.5){
                        if(finObj.hasOwnProperty(element)){
                            finObj[element]+=request.payload[item];
                            matchObj[element]+=1;
                        }else{
                            finObj[element] = request.payload[item];
                            matchObj[element] = 1;
                        }
                        cb();
                    }
                }               
            });
                var keysfinObj = Object.keys(finObj);
                async.eachSeries(keysfinObj,function(item,cb){
                    finObj[item] = finObj[item]/matchObj[item];
                    cb();
                });
                let totalChange = 0; 
                async.eachSeries(keysfinObj,function(item,cb){
                     var initialCI = response.interest[item][item];
                     let averageConfidence = finObj[item];
                     afterConfidence(initialCI,averageConfidence,function(data){
                         response.interest[item][item] +=data;
                         totalChange+=data;
                    });
                     let micropaymod = new this.database.micropayModel({
                         value : item,
                         fingerprint : request.payload.fingerprint,
                         datatype :"interest",
                         orgId:new ObjectId(request.payload.publisherId)
                     }); 
                     var newcoins = totalChange*1*1;
                     micropaymod.payoutCalculated = newcoins;
                     micropaymod.ciBefore = initialCI;
                     micropaymod.ciAfter = response.interest[item][item];                    
                    cb(); 
                 });                                
                response.save().then((res)=>{
                    console.log("saved");
                }).catch((err)=>{    
                    console.log(err);
                })
            }).catch((error)=>{
                console.log(error);
            });
    }

    public createSuperAdminUser(request:Hapi.Request, reply:Hapi.IReply)
    {
        console.log(request.payload);
            let user = new this.database.zohemUsers({
                name: request.payload.name,
                email: request.payload.email,
                password: request.payload.password,
                role: "SUPERUSER"
            });
            user.save().then( (doc) => {
                return reply( {'success': true} );
            } ).catch( (error) => {
                return reply( error );
            });
      
    }

}
