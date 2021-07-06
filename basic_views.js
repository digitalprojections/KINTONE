(function() {
 "use strict";
 
  kintone.events.on('app.record.index.show', function(event) {
    //-------------------------------------
    
  // レコードの一覧取得
  $(".calendar-table-gaia").html("<div id='calendar'></div>");
    var records = event.records;

    // 取得したレコードを配列に設定する
    var eventList = [];
    if (records != undefined && records.length > 0) {
      for (var index = 0; index < records.length; index++) {
        eventList.push(
          {
            title : '(' + records[index].username.value[0].name + ') ' +records[index].eventname.value,
            start : moment(records[index].startdate.value).format("YYYY-MM-DD HH:mm:ss"),
            end   : moment(records[index].enddate.value).format("YYYY-MM-DD HH:mm:ss"),
            color : selectColor(records[index].category.value)
          });
      }

      $('#calendar').fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,basicWeek,basicDay'
        },
        defaultDate: new Date(),
        displayEventTime: true,
        displayEventEnd:true,
        editable: true,
        timeFormat: 'HH:mm',
        eventLimit: true, // allow "more" link when too many events
        events: eventList // 配列表示データとして設定
      });

    }

    //-------------------------------------
    
    return event;
  });


  function selectColor(category) {
  var selectColor = 'white';
    switch(category) {
      case '営業 (訪問)':
        selectColor = 'gray';
        break;
      case '営業 (Web)':
        selectColor = 'silver';
        break;
      case '社員面談 (訪問)':
        selectColor = 'maroon';
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
        selectColor = 'green';
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
        selectColor = 'red';
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
})();