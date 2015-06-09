var fs = require('fs');
var HeapSnapshotLoader = require('./HeapSnapshotLoader.js').HeapSnapshotLoader;
fs.readFile("snap.json", function(err, data){
   if (err){
       throw new Error(err);
   }else{
       var loader = new HeapSnapshotLoader();
       loader.write(data.toString());
       loader.close();
       var snapshot = loader.buildSnapshot(true);
       console.log("snapshot built");
   }
});