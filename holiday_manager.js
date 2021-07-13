(function() {
    "use strict";
   
    myFunction();  
   
   })();

   function myFunction(){

    kintone.events.on('app.record.index.show', function(event) {
        records = event.records;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            //document.getElementById("demo").innerHTML =
            xml = JSON.parse(this.response);
            //console.log(this.responseText);
            for (item in xml){       
                try{
                    document.getElementById(item+"-calendar-gaia").classList.add("holiday"); 
                    document.getElementById(item+"-calendar-gaia").getElementsByClassName("calendar-cell-header-date-gaia")[0].innerText+=" "+xml[item];
                } 
                catch(ex){
                    console.log(ex);
                }
                
          }
        }        
    }
    xhttp.open("GET", "https://holidays-jp.github.io/api/v1/date.json", true);
        xhttp.send();

        for (record in records){
            for(var i=0;i<records[record].length; i++){
                if(records[record][i].holiday_radio.value=="Yes"){
                    document.getElementById(record+"-calendar-gaia").classList.add("holiday");
                }else{
                    document.getElementById(record+"-calendar-gaia").classList.add("exception");
                }
                            
            }
        }
        return event;
    });
    loadXMLDoc();


    function loadXMLDoc() {
        
      }
    
}