///pass in the array of the parameters
//that are being pushed
///This will be on the basis of the data wwe have on mail...
///and will be the basis
var request = require('request');
var parseString = require('xml2js').parseString;
///to calculate the distribution
function calcDistribution(parametersPushed){
	let total = 200;
	let totalScore=0;
	///max score = 200
	//all from the advertising perspective
	///low importance
	var one_pointers = ["firstName","lastName","prefix",];
	///medium importance
	var two_pointers = [];
	///high importance parameters
	var three_pointers = [];

}


////calculate trust score
//the trust score can initially be a value between [0-1]
///and can be judged initially by the popularity of the website
///the trust increases only if the advertiser consumes some of his data
///using https://developer.similarweb.com for now to get the global rank
///alexa free api to get the gloabl rank is better 
var f = function calTrustScore(url, cb){
	var large_int = 10000000;
	///the parameter will be the url of the publisher
	request('http://data.alexa.com/data?cli=10&dat=s&url='+url,function(err,res){
		if(err) return cb(err);
		var xml = res.body;
		parseString(xml,function(e,result){
			return cb(null,1/(result['ALEXA']['SD'][1]['COUNTRY'][0]['$']['RANK']));
		});
	});

};

 function updateCI(beforeCI,trustScore, cb){
	//CI = (1 - C) . TS . SD
	var afterci;
	var sd = 0.00087;//step down value
	afterci = (1-beforeCI)*(trustScore)*(sd);
	return cb(afterci);
}
export const N = f;
export const afterConfidence = updateCI;
//calTrustScore(1);