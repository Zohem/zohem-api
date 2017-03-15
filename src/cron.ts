var schedule = require('node-schedule');
import * as Hapi from 'hapi';
import { IServerConfigurations } from './configurations';
var ObjectId = require('mongoose').Types.ObjectId; 
import * as Boom from "boom";
var async = require('async');
var moment = require('moment');
var lodash = require('lodash');

export class Scheduler{
	private configs: IServerConfigurations;
	private database: any;

	constructor(configs: IServerConfigurations, database: any) {
	    this.database = database;
	    this.configs = configs;
	}

	public scheduler(){
		  console.log("job started");
		  var db = this.database;
		  var startdate = moment();
		  var sd = startdate.toISOString();
		  var prevdateTime = startdate.subtract(1,"year");
		  var ed = prevdateTime.toISOString();
		  var rule = new schedule.RecurrenceRule();
		  rule.hour = 20;
		  schedule.scheduleJob(rule, function(){
		  	var id;
		  	db.pubModel.find().then((res)=>{
		  		var len = res.length;
		  		console.log("length is --------> ",len , "for" , "this");
		  	 async.eachSeries(res , function(item, cb){
		  			db.micropayModel.find({
		  				"orgId":new ObjectId(item._id),
		  				"createdDate":{$lte:new Date(sd),$gt:new Date(ed)}
		  			}).then((response)=>{
		  				let val = 0;
		  				let country = new db.countriesModel;
		  				let types = new db.dataTypeModel;
		  				console.log(response.length);
		  				console.log(response);
		  				let sum = 0;
		  				db.payoutModel.findOneAndUpdate({
		  					"orgId":new ObjectId(item._id)
		  				},{},{upsert:true,new:true}).then((r)=>{
		  					let vv = new db.payoutSchemaModel;	
		  					lodash.map(response,function(iter){
		  						val = val + iter.payoutCalculated;
		  						vv.country[iter.country] += 1;
		  						vv.datatypes[iter.datatype] +=1;
		  						sum = sum + 1;
		  					})
		  					vv.totalCountries = sum;
		  					vv.payouts = val;
		  					r.scheme.push(vv);
		  					r.save().then((rrrr)=>{
		  						console.log("rrrr");
		  					}).catch((eeee)=>{
		  						console.log("err");
		  					})
		  					vv.save().then((re)=>{
		  						console.log("made");
		  					}).catch((ee)=>{
		  						console.log(ee);
		  					})		
		  				});

		  			}).catch((error)=>{
		  				console.log(error);
		  			})
		  		})
		  	}).catch((err)=>{
		  		console.log(err);
		  	})
		  });
	}



}



