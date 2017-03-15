private removeThisAtTheEnd() {
    var keys = Object.keys(request.payload);
    console.log(arr);
    var that = this;
    this.database.userData.findOneAndUpdate({
        "fingerprint":request.payload.fingerprint
    },{},{upsert:true,new:true}).then((response)=>{
        async.eachSeries(keys , function(item, cb){
            console.log("iterating item  ------------> "+ item);
            if(arr.indexOf(item)!=-1){
                console.log("----------->",response[item]);
                if(response[item]!=undefined ){
                    console.log(item+ " is defined");
                    if(item!="fingerprint" && item!="_id"){
                        var datajson = {};
                        datajson["fingerprint"] = request.payload.fingerprint;
                        datajson[item+".value"] = request.payload[item];
                        that.database.pubDataModel.findOne(datajson).then((res)=>{
                            if(res){
                                var matched = true;var change = 0;var itemArray = res[item];                            		                                    
                                var found=false;var ite; var indexMatch = 0;                                                                    
                                lodash.forEach(itemArray,function(iterator,index){         
                                    if(iterator.value== request.payload[item]){
                                        found = true;
                                        ite = iterator; indexMatch = index;                                                                                  
                                    }})
                                if(found){
                                    var cibefore = 0;var ts;                                        
                                    let micropaymod = new that.database.micropayModel({
                                        value : request.payload[item],
                                        fingerprint : request.payload.fingerprint,
                                        datatype :item,
                                        orgId:new ObjectId(request.payload.publisherId)
                                    });
                                    var numstr = indexMatch.toString();
                                    var str = item+"."+numstr+".confidenceInterval";                                                                                                   
                                    cibefore = res[item][indexMatch]["confidenceInterval"];
                                    var trustscore = getType[item];
                                    that.database.pubModel.findOne({
                                        _id:new ObjectId(request.payload.publisherId),
                                    }).then((responsePub)=>{
                                        ts = responsePub.trustScore[trustscore];
                                        var ciafter;
                                        afterConfidence(cibefore,ts, function(data){
                                        ciafter=cibefore+data;
                                        });  
                                        var jsonToSet = {};
                                        jsonToSet[str] = ciafter;
                                        that.database.pubDataModel.update({"fingerprint":request.payload.fingerprint},{'$set':jsonToSet})
                                        .then((responseSaved)=>{
                                            change =ciafter-cibefore;
                                            var score = 0;
                                            score = ob[item];
                                            console.log("change is", change);
                                            var newcoins = change*1*score;
                                            console.log("new coins are "+newcoins);
                                            micropaymod.payoutCalculated = newcoins;
                                            micropaymod.ciBefore = cibefore;
                                            micropaymod.ciAfter =  ciafter;
                                            micropaymod.save().then( (doc) => {
                                                console.log("dfcs saved .................");
                                                if(responsePub.micropayoutbal!=undefined){
                                                    responsePub.micropayoutbal =responsePub.micropayoutbal+newcoins;
                                                 }else{
                                                    responsePub.micropayoutbal = newcoins;
                                                }
                                                responsePub.save().then((r)=>{
                                                    console.log("Saved");
                                                    cb();
                                                    }).catch((ed)=>{
                                                    console.log(ed);
                                                    })
                                                }).catch((ergg)=>{
                                             });  
                                            } ).catch( (error) => {
                                                console.log( Boom.badImplementation("There was a problem doing this. Please try again.") );
                                            });                                              
                                        }).catch((er)=>{
                                            console.log(er);
                                       })
                                     }else{
                                     console.log("some problem");
                                     cb();
                                    }
                             }else{
                                     let micropaymod = new that.database.micropayModel({
                                         value : request.payload[item],
                                         fingerprint : request.payload.fingerprint,
                                         datatype :item,
                                         orgId:new ObjectId(request.payload.publisherId)
                                     });                        				
                                     var data = new that.database.dataModel;
                                    let initialConfidence=0;
                                    var ciafter;
                                    var trustscore = getType[item];
                                    that.database.pubModel.findOne({
                                        _id:new ObjectId(request.payload.publisherId)
                                    }).then((responsePub)=>{
                                      ts = responsePub.trustScore[trustscore];
                                       afterConfidence(initialConfidence,ts, function(data){
                                            ciafter=initialConfidence+data;
                                        });
                                        data.value = request.payload[item];
                                        data.confidenceInterval = ciafter;
                                        response[item].push(data);
                                        change =ciafter-initialConfidence;
                                        var score = 0;
                                        score = ob[item];
                                        console.log("change is", change);
                                        var newcoins = change*1*score;
                                        micropaymod.payoutCalculated = newcoins;
                                        micropaymod.ciBefore = initialConfidence;
                                        micropaymod.ciAfter =  ciafter;
                                        micropaymod.save().then( (responseSaved) => {
                                            console.log("micropay Saved");
                                            if(responsePub.micropayoutbal!=undefined){
                                                    responsePub.micropayoutbal =responsePub.micropayoutbal+newcoins;
                                                 }else{
                                                    responsePub.micropayoutbal = newcoins;
                                                }
                                                responsePub.save().then((r)=>{
                                                    console.log("Saved");
                                                    response.save().then( (responseSaved)=>{
                                                       console.log("saved here");
                                                        cb();
                                                        }).catch((e)=>{
                                                        console.log( e );
                                                    })
                                                    }).catch((ed)=>{
                                                    console.log(ed);
                                                    })
                                           
                                        } ).catch( (error) => {
                                            console.log( Boom.badImplementation("There was a problem doing this. Please try again.") );
                                        });
                                          
                                    }).catch((err)=>{
                                        console.log(err);
                                    })    				
                             }
                       }).catch((error)=>{
                            console.log(error);
                            cb();
                        })
                    }
                }
            }else{
                console.log(item+" not supported yet");
                cb();
            }
        },function(){
            console.log("all array processing done");
            return reply({success:true});
        })
    }).catch((error)=>{
        console.log(error);
    })
}