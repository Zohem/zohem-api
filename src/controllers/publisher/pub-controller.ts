import * as Hapi from 'hapi';
import { IServerConfigurations } from '../../configurations';
import {contract,WEB3} from '../../web3';
var ObjectId = require('mongoose').Types.ObjectId; 
import * as Boom from "boom";
var moment = require('moment');
var lodash = require('lodash');
var kue = require("kue");
var async = require('async');

export default class PubController{
	private configs: IServerConfigurations;
	private database: any;

	constructor(configs: IServerConfigurations, database: any) {
	    this.database = database;
	    this.configs = configs;
	}

	public createPublisher(request: Hapi.Request, reply: Hapi.IReply){
		let publisher = new this.database.publishers({
			name: request.payload.name,
			address: request.payload.address,
			url: request.payload.url,
			"trustScore.AutosAndVehicles":request.payload.AutosAndVehicles,
			"trustScore.BeautyAndFitness":request.payload.BeautyAndFitness,
			"trustScore.BooksAndLiterature":request.payload.BooksAndLiterature,
			"trustScore.BusinessAndIndustrial":request.payload.BusinessAndIndustrial,
			"trustScore.ComputersAndElectronics":request.payload.ComputersAndElectronics,
			"trustScore.Finance":request.payload.Finance,
			"trustScore.FoodAndDrink":request.payload.FoodAndDrink,
			"trustScore.Games":request.payload.Games,
			"trustScore.Health":request.payload.Health,
			"trustScore.HobbiesAndLiesure":request.payload.HobbiesAndLiesure,
			"trustScore.HomeAndGarden":request.payload.HomeAndGarden,
			"trustScore.InternetAndTelecom":request.payload.InternetAndTelecom,
			"trustScore.JobsAndEducation":request.payload.JobsAndEducation,
			"trustScore.LawAndGovernment":request.payload.LawAndGovernment,
			"trustScore.OnlineCommunities":request.payload.OnlineCommunities,
			"trustScore.PeopleAndSociety":request.payload.PeopleAndSociety,
			"trustScore.PetsAndAnimals":request.payload.PetsAndAnimals,
			"trustScore.RealEstate":request.payload.RealEstate,
			"trustScore.Reference":request.payload.Reference,
			"trustScore.Science":request.payload.Science,
			"trustScore.Shopping":request.payload.Shopping,
			"trustScore.News":request.payload.News,
			"trustScore.Sports":request.payload.Sports,
			"trustScore.Adult":request.payload.Adult,
			"trustScore.ArtsAndEntertainment":request.payload.ArtsAndEntertainment,
			"trustScore.personal":request.payload.personal
		});
		publisher.save().then( (doc) => {
			reply({ 'success': true });
		}).catch( (error) => {
			return reply(error );
		});
	}

	public getAllPublishers(request:Hapi.Request, reply:Hapi.IReply){
		this.database.publishers.find((err,docs)=>{
			if(err){
				return reply( Boom.badImplementation("There was a problem doing this. Please try again."));
			}else{
				return reply({'message':docs});
			}
		})
	}

	public getPublisher(request:Hapi.Request, reply:Hapi.IReply){
		this.database.publishers.findOne({
			_id:request.params.publisherid
		}).then((response)=>{
			reply({'message':response});
		});
	}

	public addNewUser(request:Hapi.Request, reply:Hapi.IReply){
		this.database.publishers.findOne({
			_id:new ObjectId(request.params.publisherid)
		}).then( (response) => {
			let user = new this.database.zohemUsers({
				name: request.payload.name,
				email: request.payload.email,
				password: request.payload.password,
				orgId: request.params.publisherid,
				role:"PUBLISHER"
			});
			console.log(user);
			user.save().then( (doc) => {
				return reply( {'success': true} );
			} ).catch( (error) => {
				return reply( error );
			})
		});
		
	}

	public getUserPub(request:Hapi.Request, reply:Hapi.IReply){
		this.database.zohemUsers.find({
			"orgId" :new ObjectId(request.params.publisherid)
		}).then((response)=>{
			reply({"message":response});
		} ).catch( (error) =>{
			return reply( Boom.badImplementation("There was a problem doing this. Please try again.") );
		});
	}


	public getUser(request:Hapi.Request, reply:Hapi.IReply){
		this.database.zohemUsers.findOne({
			_id :new ObjectId(request.params.userid),
			"orgId": new ObjectId(request.params.publisherid)
		}).then((response)=>{
			reply({"message":response});
		}).catch( (error) =>{
			return reply( Boom.badImplementation("There was a problem doing this. Please try again.") );
		});
	}


	public getMicroPayoutsBalance(request:Hapi.Request, reply:Hapi.IReply){
		console.log(request);
		this.database.publishers.findOne({
			_id:new ObjectId(request.params.publisherid)
		}).then((response)=>{
			reply({"micropayoutBal":response.micropayoutbal});
		}).catch( (error) =>{
			return reply( Boom.badImplementation("There was a problem doing this. Please try again.") );
		});;
	}

	public transferMicroPayouts(request:Hapi.Request, reply:Hapi.IReply){
		this.database.publishers.findOne({
			_id:  new ObjectId(request.params.publisherid)
		}).then((response)=>{
			let value = response.micropayoutbal;
			let val = request.payload.value;
			let addr = response.address;
			if(val<=value){
				contract.payPublisher(val,addr,{from:WEB3.eth.coinbase,gas:4300000,gasLimit:4000000});
					var model = new this.database.micropayoutModel({
						"value":-val,
						"orgId":request.params.publisherid
					});
					response.micropayoutbal = response.micropayoutbal-val;
					response.save().then((re)=>{
						console.log("saved successfully");
					}).catch((err)=>{
						return reply( Boom.badImplementation("There was a problem doing this. Please try again.") );
					})
					model.save().then((rep)=>{
						console.log("saved model");
					}).catch((err)=>{
						return reply( Boom.badImplementation("There was a problem doing this. Please try again.") );
					})
		}
		})
	}

	public editUser(request:Hapi.Request, reply:Hapi.IReply){
		this.database.zohemUsers.findOne({
			_id :new ObjectId(request.params.userid),
			"orgId": new ObjectId(request.params.publisherid)
		}).then((response)=>{
			response.name = request.payload.name
			response.save().then(( doc)=>{
				return reply({"success":true})
			}).catch((err)=>{
				return reply( Boom.badImplementation("There was a problem doing this. Please try again.") );
			});
		}).catch( (error) =>{
			return reply( Boom.badImplementation("There was a problem doing this. Please try again.") );
		});
	}

	public balanceOfPub(request:Hapi.Request, reply:Hapi.IReply){
		this.database.publishers.findOne({
			_id:new ObjectId(request.params.publisherid)
		}).then((response)=>{
			let addr = response.address;
			let bal = contract.balanceOf.call(addr,{from:WEB3.eth.coinbase,gas:4300000,gasLimit:4000000});
			reply({"balance":bal});
		}).catch( (error) =>{
			return reply( error );
		});
	}

	public getMicropyaments(request:Hapi.Request, reply:Hapi.IReply){
		this.database.micropayModel.find({
			"orgId":new ObjectId(request.params.publisherid)
		}).then((response)=>{
			reply({"message":response});
		});
	}

	public getData(request:Hapi.Request, reply:Hapi.IReply){
		var id = request.params.publisherid;
		this.database.publishers.findOne({
			_id:id
		}).then((res)=>{
			this.database.micropayModel.find({
				"orgId":new ObjectId(id)
			}).then((response)=>{
				var div = res.micropayoutbal/response.length;
				reply({earnings:res.micropayoutbal,length:response.length,payouts:response,divide:div})
			}).catch((error)=>{
				console.log(error);
			})
		}).catch((err)=>{
			console.log(err);
		})
	}

	//////////////main endpoints for fetching for the graphs for the pie chart
	public getPieChartDatatype(request:Hapi.Request, reply:Hapi.IReply){
		// var sd = request.payload.startDate;
		// var ed = request.payload.endDate;
		console.log("mukul");
		var startdate = moment();
		var snd = startdate.toISOString();
		console.log(snd);
		var prevdateTime = startdate.subtract(1,"year");
		console.log(prevdateTime);
		var end = prevdateTime.toISOString();
		this.database.payoutModel.aggregate([
		    {$match: {"orgId": ObjectId("59da6fd33536a02ecf7078e8")}},
		    {$unwind:"$scheme"},
		    {$group:{_id:{started:"$scheme.started",payouts:"$scheme.payouts",datatypes:"$scheme.datatypes"}}},
		    {$match:{"_id.started":{$gte:new Date(end),$lt:new Date(snd)}}}
		]).then((response)=>{
			console.log(response);
			var finalObj = {};
			var len = response.length;
			var sum = 0;
			let types = new this.database.dataTypeModel;
			var keys = Object.keys(types);
			response.forEach(function(item){
				var innerObj = item._id.datatypes;
				Object.keys(innerObj).forEach(function(key){
					if(key != "_id"){
						if(typeof finalObj[key] === "undefined"){
							finalObj[key] = innerObj[key];
							sum = sum+innerObj[key];
						}else{
							finalObj[key] += innerObj[key];
							sum = sum+innerObj[key];

						}
					}	
				})
			})
			console.log("sum is------------------------>",sum);
			var arr = [];
			for (var key in finalObj) {
			  if (finalObj.hasOwnProperty(key)) {
			  	var json = {};
			    var val = finalObj[key];
			    json["name"] = key;
			    json["value"] = (val/sum)*100;
			    arr.push(json);
			  }
			}
			console.log(arr);
		}).catch((error)=>{
			console.log(error);
		})
	}

	////for the normal graph
	public getChartRegions(request:Hapi.Request, reply:Hapi.IReply){
		// var sd = request.payload.startDate;
		// var ed = request.payload.endDate;
		var startdate = moment();
		var snd = startdate.toISOString();
		console.log(snd);
		var prevdateTime = startdate.subtract(1,"year");
		console.log(prevdateTime);
		var end = prevdateTime.toISOString();
		this.database.payoutModel.aggregate([
		    {$match: {"orgId": ObjectId("59da6fd33536a02ecf7078e8")}},
		    {$unwind:"$scheme"},
		    {$group:{_id:{started:"$scheme.started",payouts:"$scheme.payouts",countries:"$scheme.country",total:"$scheme.totalCountries"}}},
		    {$match:{"_id.started":{$gte:new Date(end),$lt:new Date(snd)}}}
		]).then((response)=>{
			console.log(response);
			let newcountries = new this.database.countriesModel;
			var keys = Object.keys(newcountries);
			var finalObj = {};
			var sum = 0;
			response.forEach(function(item){
				var innerObj = item._id.countries;
				Object.keys(innerObj).forEach(function(key){
					if(key != "_id"){
						if(typeof finalObj[key] === "undefined"){
							finalObj[key] = innerObj[key];
							sum = sum+innerObj[key];
						}else{
							finalObj[key] += innerObj[key];
							sum = sum+innerObj[key];
						}
					}					
				})
			})
			var arr = [];
			for (var key in finalObj) {
			  if (finalObj.hasOwnProperty(key)) {
			  	var json = {};
			    var val = finalObj[key];
			    json["name"] = key;
			    json["value"] = (val/sum)*100;
			    arr.push(json);
			  }
			}
			console.log(arr);
		}).catch((error)=>{
			console.log(error);
		})
	}

	public getzdtforTime(request:Hapi.Request, reply:Hapi.IReply){
		// var sd = request.payload.startDate;
		// var ed = request.payload.endDate;
		var startdate = moment();
		var snd = startdate.toISOString();
		console.log(snd);
		var prevdateTime = startdate.subtract(1,"year");
		console.log(prevdateTime);
		var end = prevdateTime.toISOString();
		var diff = startdate.diff(prevdateTime, 'hours');
		console.log("time diff is ------------------>",diff);
		this.database.payoutModel.aggregate([
		    {$match: {"orgId": ObjectId("59da6fd33536a02ecf7078e8")}},
		    {$unwind:"$scheme"},
		    {$group:{_id:{started:"$scheme.started",payouts:"$scheme.payouts"}}},
		    {$match:{"_id.started":{$gte:new Date(end),$lt:new Date(snd)}}}
		]).then((response)=>{
			console.log(response);
			var finalObj = {};
			response.forEach(function(item){
				var innerObj = item._id.countries;
				Object.keys(innerObj).forEach(function(key){
					if(key != "_id"){
						if(typeof finalObj[key] === "undefined"){
							finalObj[key] = innerObj[key];
						}else{
							finalObj[key] += innerObj[key];
						}
					}					
				})
			})
			console.log(JSON.stringify(finalObj));

		}).catch((error)=>{
			console.log(error);
		})
	}
}
