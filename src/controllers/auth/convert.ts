var str = "/Arts & Entertainment/Celebrities & Entertainment News";

var convertdata = function(str){
	var arr = str.split('/');
	var arr2 = [];
	for (var i=1;i<arr.length;i++){
		arr[i] = arr[i].replace(/\s/g, "");
		arr[i] = arr[i].replace(/-/g, "");
		arr[i] = arr[i].replace(/&/g,"And");
		//console.log(arr[i]);
		arr2.push(arr[i]);
	}
	return arr2;
}

export const convert = convertdata;
