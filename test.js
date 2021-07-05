console.log("Hi, I am testing custom views");
(function() {
    "use strict";

    myFunction();
})();

function myFunction(){
    //Create an event handler for the Record List
    kintone.events.on('app.record.index.show', function(event) {
        //Set a color
        var fontColorRed = "#ff0000";        
        //Retrieve elements for the "To Do" and "status" fields
        var elCustomer = kintone.app.getFieldElements('todo');    //field code of the To Do field
        var elAccuracy = kintone.app.getFieldElements('status');    //field code of the Status field
        if(elAccuracy){
           for (var i = 0; i < elAccuracy.length; i++) {
                //Record data is stored in the event object
                var record = event.records[i];            
                //If the Status is "Not started", color in the To Do field and the Status field
                if (record['status']['value'] == "Not started") {
                    elCustomer[i].style.color = fontColorRed;
                    elAccuracy[i].style.color = fontColorRed;
                }
            }
            console.log("All good with the elAccuracy");
        }else{
            var ranOnce;
            if(!ranOnce){
                console.log(`problem with elAccuracy being ${elAccuracy}. I will retry`);
                ranOnce = true;
                setTimeout(myFunction(), 1000);
            }else{
                console.log(`problem with elAccuracy being ${elAccuracy} again. I quit retrying`);
            }

        }        
    });
    console.log(kintone);
}