(function() {
    "use strict";
   
    myFunction();  
   
   })();

   function myFunction(){
    kintone.events.on('app.record.index.show', function(event) {
        records = event.records;

        for (record in records){
            for(var i=0;i<records[record].length; i++){
                if(records[record][i].holiday_radio.value=="Yes")
                    document.getElementById("2021-07-22-calendar-gaia").classList.add("holiday");        
            }}
        

        return event;
    });

    
}