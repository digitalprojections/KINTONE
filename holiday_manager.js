(function() {
    "use strict";
   
    myFunction();  
   
   })();

   function myFunction(){
    kintone.events.on('app.record.index.show', function(event) {
        records = event.records;


        return event;
    });

    
}