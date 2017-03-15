
var mqg = require('mongo-query-generator');
var s = '';
///below is an example json
/// in the real world this will be taken 
///from the parameters given by the advertiser
/**var aaaa = 
{
	"name":"muukul",
	"age":123,
	"region":"delhi",
	"state":"delhi",
	"add":"asas"

};**/
///the inputs will be taken from the request.params or similar
//var bb = Object.keys(aaaa);
///here input parameter is the JSON object
async function aa(b,a){
	var m = '';
	for (var i=0;i<b.length;i++)
	{
	var e = b[i].toString()+"!=undefined"+" && "+b[i].toString()+"!=null";
	var f = "("+e+" && "+b[i].toString()+".value"+ " == "+"'"+a[b[i]].toString()+"'"+")";
	if(i!=b.length-1){
		m = m + f + " && " 
	}
	else{
		m = m+f
	}
}
return m;
}
/**var n = '';
console.log(aa(bb));
aa(bb).then(v=>{
	n = v;
})
var query = mqg(n);
console.log(n);
console.log(typeof(query));
///It is Object as expected :))
console.log(JSON.stringify(query, null ,1));
**/

export const aaa = aa;