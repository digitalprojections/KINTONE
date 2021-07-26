(function () {
  "use strict";

  myFunction();
})();

function myFunction() {
  var xhttp = new XMLHttpRequest();
  var category_id = getCategoryFieldCodeID();
  kintone.events.on("app.record.index.show", function (event) {
    // レコードの一覧取得
    records = event.records;
    // 取得したレコードを配列に設定する
    eventList = [];
    if (records) {
      for (index in records) {
        for (var j = 0; j < records[index].length; j++) {
          eventList.push({
            title: records[index][j].category_dd.value +
              " (" +
              records[index][j].Created_by.value.name +
              ") " +
              records[index][j].eventname.value,
            start: moment(records[index][j].startdate.value).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            end: moment(records[index][j].enddate.value).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            color: selectColor[records[index][j].category_dd.value],
            bg_color: selectColor[records[index][j].category_dd.value],
            record_id: records[index][j].Record_number,
            category_name: records[index][j].category_dd.value,
          });
        }
      }
//要望②期間表示ができること
      var calen = document.createElement("div");
      calen.id = "calendar";
      calen.addEventListener("onload", addCalendar);
      try {
        document.querySelector(".calendar-table-gaia").innerHTML = "";
        document.querySelector(".calendar-table-gaia").append(calen);
        calen.dispatchEvent(new CustomEvent("onload"));
      } catch (e) {
        displayCats();
        console.log(e);
      }    
    }

    function displayCats() {
      document
        .querySelectorAll("#view-list-data-gaia > table > tbody > tr")
        .forEach((i) => {
          for (var j = 0; j < i.querySelectorAll("td").length; j++) {
            if (
              i
              .querySelectorAll("td")[j].classList.contains("value-" + category_id)
            ) {
              i.querySelectorAll("td")[j].querySelector("span")
                .setAttribute(
                  "style",
                  "text-align: center; color:white; background:" +
                  selectColor[
                    i.querySelectorAll("td")[j].querySelectorAll("span")[0]
                    .innerText
                  ] +
                  ";"
                );
            }
          }
        });
    }

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML =
        xml = JSON.parse(this.response);
        //console.log(this.responseText);
        for (item in xml){       
          var myday = document.querySelectorAll(".fc-daygrid-day[data-date='"+item+"'")[0];
            if(myday){

              var span = document.createElement("span");
              span.innerText = xml[item];
              span.setAttribute("style","flex:auto;");
              myday.classList.add("holiday"); 
              myday.querySelector("div>div").append(span);
            } 
            else{
                console.log("myday is "+ myday);
            }
            
      }
    }        
}
xhttp.open("GET", "https://holidays-jp.github.io/api/v1/date.json", true);
    xhttp.send();

    for (record in records){
        for(var i=0;i<records[record].length; i++){
            if(records[record][i].holiday_radio.value=="Yes"){
              document.querySelectorAll(".fc-daygrid-day[data-date='"+record+"'")[0].classList.add("holiday"); 
            }else{
              document.querySelectorAll(".fc-daygrid-day[data-date='"+record+"'")[0].classList.add("exception");
            }
        }
    }
    //-------------------------------------
    return event;
  });

  function getCategoryFieldCodeID() {
    var retval = "0";
    for (item in cybozu.data.page.FORM_DATA.schema.table.fieldList) {
      if (
        cybozu.data.page.FORM_DATA.schema.table.fieldList[item].var ==
        "category_dd"
      ) {
        //category_dd フィールドコード IDを見つけた
        retval = item;
        break;
      }
    }
    return retval;
  }
}
if (document.getElementById("calendar")) {
  console.log("calendar added");
}

function addCalendar() {
  var calendarEl = document.getElementById("calendar");
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    headerToolbar: {
      start: "", // 普段左側、RTLの場合は右に表示する。必要がない為隠している
      center: "title", //冗長と感じられるかも知れませんが、確認の為に必要。真ん中に表示する、例：July-2021
      end: "", // 普段右側、RTLの場合は左に表示する。必要がない為隠している
    },
    locale: "ja",
    events: eventList,
    eventClick: function (info) {
      console.log(info);
      clicktargetevent = info;
      window.open(
        window.location.pathname +
        "show#record=" +
        info.event._def.extendedProps.record_id.value,
        "_self"
      );
    },
    // eventClassNames: function (arg) {
    //   console.log(arg);

    //   if (arg.event.extendedProps.isUrgent) {
    //     return ["urgent"];
    //   } else {
    //     return ["normal"];
    //   }
    // },

  });

  calendar.render();
  
  getLocHash(window.location.hash);
    
  //eventList = [];
  console.log("rendering the calendar");
  try {
    document
      .querySelectorAll("table.fc-scrollgrid-sync-table")[0]
      .setAttribute("style", "height:600px");
    document
      .querySelectorAll(".fc-view-harness.fc-view-harness-active")[0]
      .setAttribute("style", "height:650px;");

    var startdateid = getFieldCodeName();

    document.querySelectorAll("div.fc-daygrid-day-top > a").forEach((item) => {
      item.setAttribute(
        "href",
        "edit?fid=" +
        startdateid +
        "&v=" +
        item.parentElement.parentElement.parentElement.getAttribute(
          "data-date"
        )
      );
    });
  } catch (e) {
    console.log(e);
  }

  function getLocHash(x){
    if (x.length > 0) {
      x = x.substr(x.indexOf("=") + 1);
      console.log(x);
      calendar.gotoDate(x);
    }
  }

  function getFieldCodeName() {
    var retval = "0";
    for (item in cybozu.data.page.FORM_DATA.schema.table.fieldList) {
      if (
        cybozu.data.page.FORM_DATA.schema.table.fieldList[item].var ==
        "startdate"
      ) {
        //startdate フィールドコード ID
        retval = item;
        break;
      }
    }
    return retval;
  }
}