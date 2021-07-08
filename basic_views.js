(function() {
 "use strict";

 myFunction();  

})();

function myFunction(){
  kintone.events.on('app.record.index.show', function(event) {
    //-------------------------------------
    
  // レコードの一覧取得
  
    records = event.records;

    // 取得したレコードを配列に設定する
    
    eventList = [];
    if (records) {
      for (index in records) {
        for(var j=0;j<records[index].length;j++){
          eventList.push(
            {
              title : '(' + records[index][j].Created_by.value.name + ') ' +records[index][j].eventname.value,              
              start : moment(records[index][j].startdate.value).format("YYYY-MM-DD HH:mm:ss"),
              end   : moment(records[index][j].enddate.value).format("YYYY-MM-DD HH:mm:ss"),
              color : selectColor(records[index][j].category_dd.value),
              record_id:records[index][j].Record_number
            });
        }
        
      }
      var calen = document.createElement("div");
    calen.id = "calendar";
  calen.addEventListener("onload", addCalendar);
  document.querySelector(".calendar-table-gaia").innerHTML="";
  document.querySelector(".calendar-table-gaia").append(calen);
  calen.dispatchEvent(new CustomEvent("onload"));
    }

    //-------------------------------------
    
    return event;
  });

  


  function selectColor(category) {
  var selectColor = 'lightblue';
    switch(category) {
      case '営業 (訪問)':
        selectColor = 'gray';
        break;
      case '営業 (Web)':
        selectColor = 'silver';
        break;
      case '社員面談 (訪問)':
        selectColor = 'lightcoral';
        break;
      case '社員面談 (Web)':
        selectColor = 'blue';
        break;
      case '面接':
        selectColor = 'navy';
        break;
      case '説明会':
        selectColor = 'teal';
        break;
      case '社内会議':
        selectColor = 'lightseagreen';
        break;
      case '業者打合せ':
        selectColor = 'lime';
        break;
      case '来客':
        selectColor = 'aqua';
        break;
      case '出張':
        selectColor = 'yellow';
        break;
      case '配属':
        selectColor = 'lightpink';
        break;
      case '在宅':
        selectColor = 'fuchsia';
        break;
      case '有給休暇':
        selectColor = 'olive';
        break;
      case 'その他':
        selectColor = 'purple';
        break;
    }

    return selectColor;
  }

if(document.getElementById("calendar")){
  console.log("calendar added");

}
}

function addCalendar(){
//  calendar = $('#calendar').fullCalendar({
//     header: {
//       left: 'prev,next today',
//       center: 'title',
//       right: 'month,basicWeek,basicDay'
//     },
//     defaultDate: new Date(),
//     displayEventTime: true,
//     displayEventEnd:true,
//     editable: true,
//     timeFormat: 'HH:mm',
//     eventLimit: true, // allow "more" link when too many events
//     events: eventList, // 配列表示データとして設定
//     eventClick:function(info) {
//       console.log(info);
//       // change the border color just for fun
//       //info.el.style.borderColor = 'red';
//       window.open(window.location.pathname + "show#record="+info.record_id.value,"_self");
//     }
//   });
var calendarEl = document.getElementById('calendar');
        calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: 'dayGridMonth',  
          headerToolbar:{
            start: '', // will normally be on the left. if RTL, will be on the right
            center: 'title',
            end: '' // will normally be on the right. if RTL, will be on the left
          },
          events: eventList
        });
        calendar.render();
  addEventListeners();
  console.log("rendering the calendar");
  //document.getElementsByClassName("calendar-menu-gaia")[0].setAttribute("style","display:none");
  
}

function addEventListeners(){
  funcRef();
  //document.getElementsByClassName("fc-prev-button fc-button fc-button-primary")[0].setAttribute("onclick", "window.location.assign('#date='+calendar.getDate().getFullYear()+'-'+ fixZero(calendar.getDate().getMonth()+1));");
  //document.getElementsByClassName("fc-next-button fc-button fc-button-primary")[0].setAttribute("onclick", "window.location.assign('#date='+calendar.getDate().getFullYear()+'-'+ fixZero(calendar.getDate().getMonth()+1));");
}

funcRef = function (){
  lochash = window.location.hash;
  if(lochash.length>0){
    lochash = lochash.substr(lochash.indexOf("=")+1);
    console.log(lochash);
    calendar.gotoDate(lochash);
  }
}

//window.onhashchange = funcRef;

function fixZero(x){  
  if(x<=9){
    x="0"+x;    
  }
  console.log(x);
  return x;
}