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
        //var elAccuracy = kintone.app.getFieldElements('status');    //field code of the Status field
        records = event.records;
        if(elCustomer){
        //    for (var i = 0; i < records.length; i++) {
        //         //Record data is stored in the event object
        //         record = event.records[i];            
        //         //If the Status is "Not started", color in the To Do field and the Status field
        //         if (records['status']['value'] == "Not started") {
        //             elCustomer[i].style.color = fontColorRed;
        //             //elAccuracy[i].style.color = fontColorRed;
        //         }
        //     }
            console.log(elCustomer);
            for(i in records){
                for (var j=0; j<records[i].length; j++){
                        console.log(records[i][j]);
                    }
                }
        }else{
               console.log(`problem with elCustomer being ${elCustomer}`);
        }        

        //CODE TO collect a tags
        var eventList = [];
        var aTagList = [];
        for (i in records){
            eventList.push(document.getElementById(i+"-calendar-gaia"));
        }
        for (j=0;j<eventList.length;j++){
            aTagList.push(eventList[j].getElementsByTagName("a"));
        }


    });
    console.log(kintone);

    eventid = records["2021-07-06"][0].startdate.value;
    eventid = eventid.substring(0,10);
    eselector = eventid+"-calendar-gaia";
    var myEventElement = document.getElementById(eselector);


}