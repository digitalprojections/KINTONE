/*
https://code.jquery.com/jquery-2.2.4.min.js
https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
https://cdn.jsdelivr.net/npm/fullcalendar@5.8.0/main.js


CSS
https://cdn.jsdelivr.net/npm/fullcalendar@5.8.0/main.min.css
extended_view.css
MOBILE CSS
https://cdn.jsdelivr.net/npm/fullcalendar@5.8.0/main.min.css

*/

(function () {
  "use strict";

  myFunction();
})();

function myFunction() {
  var xhttp = new XMLHttpRequest();

  kintone.events.on("app.record.index.show", function (event) {
    // レコードの一覧取得
    records = event.records;
    // 取得したレコードを配列に設定する
    eventList = [];
    if (records) {
      for (index in records) {
        for (var j = 0; j < records[index].length; j++) {
          eventList.push({
            title:
              records[index][j].category_dd.value +
              " (" +
              records[index][j].author.value.name +
              ") " +
              records[index][j].event_name.value,
            start: moment(records[index][j].start_date.value).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            end: moment(records[index][j].end_date.value).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            //category_dd、Record_number、enddate、startdate、Created_by、eventnameは
            //アプリのフォームに無ければ、正しく動作しません
            color: getColor(records[index][j].category_dd.value),
            bg_color: getColor(records[index][j].category_dd.value),
            record_id: records[index][j].$id,
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
        document.querySelector(".calendar-table-gaia")?.append(calen);
        calen.dispatchEvent(new CustomEvent("onload"));
      } catch (e) {
        //this error means, we are in list view
        //リスト表示だから、カテゴリーの色、アイコンの様に
        displayCats();
        console.log(e.prototype.message);
      }
    }

    // xhttp.onreadystatechange = function () {
    //   if (this.readyState == 4 && this.status == 200) {
    //     //document.getElementById("demo").innerHTML =
    //     xml = JSON.parse(this.response);
    //     //console.log(this.responseText);
    //     for (item in xml) {
    //       var myday = document.querySelectorAll(
    //         ".fc-daygrid-day[data-date='" + item + "'"
    //       )[0];
    //       if (myday) {
    //         var span = document.createElement("span");
    //         span.innerText = xml[item];
    //         span.setAttribute("style", "flex:auto;");
    //         myday.classList.add("holiday");
    //         //myday.querySelector("div>div").append(span);
    //       } else {
    //         console.log("myday is " + myday);
    //       }
    //     }
    //   }
    // };

    // //requesting Japanese holidays
    // xhttp.open("GET", "https://holidays-jp.github.io/api/v1/date.json", true);
    // xhttp.send();

    //-------------------------------------
    return event;
  });
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
    views: {
      timeGrid: {
        dayMaxEventRows: 6,
      },
      dayGrid: {
        dayMaxEvents: 5,
      },
    },
    locale: "ja",
    googleCalendarApiKey: "AIzaSyAIC0iaF4zmKPANSF_EaKFbWRCC-bW381k",
    //events: eventList,
    events: "ja.japanese#holiday@group.v.calendar.google.com",
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
  calendar.addEventSource(eventList);
  calendar.render();
  console.log("rendering the calendar");

  getLocHash(window.location.hash);
  //eventList = [];
  try {
    //このブロックは全てのセルをチェックしイベントが入っていれば、そのイベントにクリック
    //アクションを使えるようにする。
    //itemはAタッグです。
    document
      .querySelectorAll("table.fc-scrollgrid-sync-table")[0]
      .setAttribute("style", "height:600px");
    document
      .querySelectorAll(".fc-view-harness.fc-view-harness-active")[0]
      .setAttribute("style", "height:650px;");

    //開始日をcybozu.data.page.FORM_DATA.schema.table.fieldList　から取る。
    var startdateid = getFieldCodeID("start_date");

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
      item.setAttribute("target", "_self");
    });
  } catch (e) {
    console.log(e);
  }

  function getLocHash(x) {
    if (x.length > 0) {
      x = x.substr(x.indexOf("=") + 1);
      console.log(x);
      calendar.gotoDate(x);
    }
  }

  class GCalUrl {
    static main_url = "https://www.googleapis.com/calendar/v3/calendars/";
    constructor(caltype, apikey, timeMin, timeMax) {
      this.url = main_url + caltype + "/events";
      this.options.key = apikey;
      this.options.timeMin = timeMin;
      this.options.timeMax = timeMax;
      return this;
    }
  }
  setTimeout(function () {
    for (record in records) {
      for (var i = 0; i < records[record].length; i++) {
        if (records[record][i].category_dd.value == "会社カレンダー") {
          if (
            records[record][i].holiday_radio.value == "Yes" ||
            records[record][i].holiday_radio.value == "はい"
          ) {
            document
              .querySelectorAll(
                ".fc-daygrid-day[data-date='" + record + "']"
              )[0]
              .classList.add("holiday");
          } else {
            document
              .querySelectorAll(
                ".fc-daygrid-day[data-date='" + record + "']"
              )[0]
              .classList.add("exception");
          }
          $(
            ".fc-daygrid-day[data-date='" + record + "'] a.fc-daygrid-event"
          ).each(function (item) {
            if ($(this).text().indexOf("会社カレンダー") > 0) {
              $(this).text("ALTECS Co. ltd");
              //$(this).addClass("special_day");
            }
          });
        }
      }
    }
  }, 1000);
}
