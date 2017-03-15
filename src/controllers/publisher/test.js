var obj = {a: 1, b: 2};var arr = [];
for (var key in obj) {
  if (obj.hasOwnProperty(key)) {
  	var json = {};
    var val = obj[key];
    json[key] = val;
    arr.push(json);
  }
}
console.log(arr);