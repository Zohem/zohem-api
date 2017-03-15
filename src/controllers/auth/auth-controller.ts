import * as Hapi from 'hapi';
import { IServerConfigurations } from '../../configurations';
var mqg = require('mongo-query-generator');
var ObjectId = require('mongoose').Types.ObjectId; 
import * as Boom from "boom";
import * as Jwt from "jsonwebtoken";
var extractor = require('unfluff');
var req = require('request');
var https = require("https");
var textract = require('textract');
var getIP = require('ipware')().get_ip;

export default class AuthController{
	private configs: IServerConfigurations;
	private database: any;

	constructor(configs: IServerConfigurations, database: any) {
	    this.database = database;
	    this.configs = configs;
	}

	public login(request:  Hapi.Request,  reply: Hapi.IReply){
		this.database.zohemUsers.findOne({
			email:request.payload.email
		}).then((res)=>{
			console.log(res);
			if(res.validatePassword(request.payload.password)){
				let token = Jwt.sign(
				{id:res.orgId,username:res.name,role:res.role},
				this.configs.jwtSecret,
				{expiresIn: this.configs.jwtExpiration}
				);
				return reply({"success":true,"token":token});
			}else{
				return reply({"success":false,"error":"wrong password"});
			}
		}).catch((err)=>{
			console.log(err);
			return reply({"success":false,"error":"username not found"});
		})	
	}


	public getDataFromGoogle(request:Hapi.Request,reply:Hapi.IReply){
		var url = request.payload.url;
		console.log(url);
		var ipInfo = getIP(request);
		console.log(ipInfo.clientIp);
		console.log("mukul");
		var fingerprint = request.payload.fingerprint;
		///put url ehen deloying
		textract.fromUrl("https://timesofindia.indiatimes.com/sports/football/top-stories/infantino-regrets-not-meeting-pm-modi-during-fifa-u-17-world-cup/articleshow/61531347.cms", function( error, text ) {
			if(error){
				console.log(error);
			}
			var headers = {
			    'Content-Type':'application/json',
			    'Authorization':"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5ZGE2ZmQzMzUzNmEwMmVjZjcwNzhlOCIsInVzZXJuYW1lIjoibXVrdWxqYSIsInJvbGUiOiJQVUJMSVNIRVIiLCJpYXQiOjE1MDk3MTU0NTMsImV4cCI6MTUwOTcxOTA1M30.S12wbhAjDPl1SiyQpH6AZAJhfJI-wODm4YSdjh2ReE0"
			}
			console.log(text)
			var jj = JSON.stringify({'text':text});
			var options = {
			    url: 'http://localhost:5001/classify',
			    method: 'POST',
			    headers: headers,
			    body: jj
			}
			req(options,function(err,response,body){
				if(err){
					console.log(err);
				}
				console.log(response.body);
				var dat = JSON.stringify(response.body);
				var options1 = {
					url:'http://localhost:5000/pushInterests',
					method:'POST',
					headers:headers,
					body:dat
				};
				req(options1,function(e,r,b){
					if(e){
						console.log(e);
					}
					console.log("saved");
				})
			});
		})
	}


}