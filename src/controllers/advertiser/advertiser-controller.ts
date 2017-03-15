import * as Hapi from 'hapi';
import { IServerConfigurations } from '../../configurations';
import {advcontract,WEB3} from '../../web3';
var mqg = require('mongo-query-generator');
var ObjectId = require('mongoose').Types.ObjectId; 
var mqg = require('mongo-query-generator');
import {aaa} from './mqg';
import {ob} from '../publisher_data/scores';
import * as Boom from "boom";
var kue = require("kue");

export default class AdvController{
	private configs: IServerConfigurations;
	private database: any;

	constructor(configs: IServerConfigurations, database: any) {
	    this.database = database;
	    this.configs = configs;
	}

	public createAdvertiser(request:  Hapi.Request,  reply: Hapi.IReply){
		this.database.advModel.create({
			"name":request.payload.name,
			"address":request.payload.address
		}).then((docs)=>{
			return reply({docs});
		}).catch( (error) => {
				return reply( Boom.badImplementation("There was a problem doing this. Please try again.") );
			})
		}

	///gets all the data for a particular fingerprint of user
	public getAllData(request: Hapi.Request, reply: Hapi.IReply){
		this.database.pubDataModel.findOne({
			"fingerprint":request.params.fingerprint
		}).then((docs)=>{
			console.log(docs);
			reply({"data":docs});
		});
	}

	public getAllAdvertisers(request:Hapi.Request, reply:Hapi.IReply){
		this.database.advModel.find((err,docs)=>{
			if(err){
				return reply( Boom.badImplementation("There was a problem doing this. Please try again."));
			}else{
				return reply({'message':docs});
			}
		});
	}

	public addNewUser(request:Hapi.Request, reply:Hapi.IReply){
		this.database.pubModel.findOne({
			_id:new ObjectId(request.params.advertiserId)
		}).then( (response) => {
			let user = new this.database.userModel({
				name: request.payload.name,
				email: request.payload.email,
				password: request.payload.password,
				orgId: request.params.advertiserId,
				role: "ADVERTISER"
			});
			user.save().then( (doc) => {
				return reply( {'success': true} );
			} ).catch( (error) => {
				return reply( Boom.badImplementation("There was a problem doing this. Please try again.") );
			})
		});
		
	}

	public getUserPub(request:Hapi.Request, reply:Hapi.IReply){
		this.database.userModel.find({
			"orgId" :new ObjectId(request.params.advertiserid)
		}).then((response)=>{
			reply({"message":response});
		} ).catch( (error) =>{
			return reply( Boom.badImplementation("There was a problem doing this. Please try again.") );
		});
	}


	public getUser(request:Hapi.Request, reply:Hapi.IReply){
		this.database.userModel.findOne({
			_id :new ObjectId(request.params.userid),
			"orgId": new ObjectId(request.params.advertiserid)
		}).then((response)=>{
			reply({"message":response});
		}).catch( (error) =>{
			return reply( Boom.badImplementation("There was a problem doing this. Please try again.") );
		});
	}

	public editUser(request:Hapi.Request, reply:Hapi.IReply){
		this.database.userModel.findOne({
			_id :new ObjectId(request.params.userid),
			"orgId": new ObjectId(request.params.advertiserid)
		}).then((response)=>{
			response.name = request.payload.name
			console.log(response)
			response.save().then(( doc)=>{
				return reply({"success":true})
			}).catch((err)=>{
				return reply( Boom.badImplementation("There was a problem doing this. Please try again.") );
			});
		}).catch( (error) =>{
			return reply( Boom.badImplementation("There was a problem doing this. Please try again.") );
		});
	}

	///get Data of some specific parameters
	public getSomeData(request: Hapi.Request, reply: Hapi.IReply){
		var aa = {
		};
		var b = Object.keys(request.query);
		for(var i=0;i<b.length;i++){
			aa[b[i]] = request.query[b[i]];
		}
		var ba = Object.keys(aa);
		var m = '';
		var q;
		var query ;
		aaa(ba,aa).then(v=>{
			q = v;
			query = mqg(q);
			this.database.pubDataModel.find(
			{
				query
			}
			).then((docs)=>{
				let micropaymod = new this.database.micropayModel({
					value:10,
					orgId:new ObjectId(request.query.advertiserid)
				});
				micropaymod.save().then((res)=>{
					console.log(res);
					this.database.advModel.findOne({
						_id:new ObjectId(request.query.advertiserid)
					}).then((r)=>{
						r.lastWalletBal = r.lastWalletBal-b.length*(10);
					}).catch((e)=>{	
						console.log(e);
					})
				}).catch((err)=>{
					console.log(err);
				})
				reply({"data":docs});
			}).catch((err)=>{
				console.log(err);
			});	
		});
	}

	////get advertiser balance
	public getBalance(request:Hapi.Request, reply:Hapi.IReply){
		this.database.advModel.findOne({
			_id:new ObjectId(request.params.advertiserid)
		}).then((docs)=>{
			let addr = docs.address;
			let bal = advcontract.balanceOf.call(addr,{from:WEB3.eth.coinbase,gas:4300000,gasLimit:4000000});
			reply({"bal":bal});
		})
	};

	////get the payments done by advertiser
	public getMicroPayments(request:Hapi.Request, reply:Hapi.IReply){
		this.database.advModel.findOne({
			_id:new ObjectId(request.params.advertiserid)
		}).then((docs)=>{
			console.log(docs);
			reply({"data":docs});
		})
	}

	///get the wallet balance of the advertiser
	public getWalletBal(request:Hapi.Request, reply:Hapi.IReply){
		this.database.advModel.findOne({
			_id:new ObjectId(request.params.advertiserid)
		}).then((docs)=>{
			let addr = docs.address;
			let bal = advcontract.getWalletBal.call(addr,{from:WEB3.eth.coinbase,gas:4300000,gasLimit:4000000});
			reply({"walletBal":bal});
		});
	}

	///The endpoint advertiser calls to transfer tokens to wallet
	public transferToWallet(request:Hapi.Request, reply:Hapi.IReply){
		this.database.advModel.findOne({
			_id:new ObjectId(request.params.advertiserid)
		}).then((docs)=>{
			let addr = docs.address;
			let val = request.payload.value;
			advcontract.transferToWallet(val,{from:WEB3.eth.coinbase,gas:4300000,gasLimit:4000000});
			reply({"success":true});
		});
	}


}