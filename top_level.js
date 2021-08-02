//トップレベルのスクリプト。アプリじゃなくて、KINTONEのトップレベルに入れる事
//Customizing Kintone System-Wide
var cpicker;
var elements;
selectColor = {
  "営業 (訪問)": "#ff0000",
  "営業（訪問）": "#ff0000",
  "営業 (Web)": "#ff0080",
  "営業（Web）": "#ff0080",
  "社員面談 (訪問)": "#bf00ff",
  "社員面談（訪問）": "#bf00ff",
  "社員面談 (Web)": "#4000ff",
  "社員面談（Web）": "#4000ff",
  面接: "#00bfff",
  説明会: "#00ffff",
  社内会議: "#00ff80",
  業者打合せ: "#40ff00",
  来客: "#ffbf00",
  出張: "#ff8000",
  配属: "#ff4000",
  在宅: "#bf00ff",
  有給休暇: "#00ff80",
  その他: "#bfff00",
};
function getColor(category_name) {
  console.log(category_name);
  return localStorage.getItem(category_name)
    ? localStorage.getItem(category_name)
    : selectColor[category_name];
}
function displayCats() {
  var catar = kintone.app.getFieldElements("category_dd");
  for (i = 0; i < catar?.length; i++) {
    catar[i].style.backgroundColor = getColor(catar[i].innerText);
  }
}
kintone.events.on(
  [
    "app.record.create.show",
    "app.record.edit.show",
    "app.record.detail.show",
    "app.record.index.edit.submit.success",
    "app.record.edit.change.category_dd",
    "app.record.create.change.category_dd",
  ],
  function (event) {
    elements = event;
    console.log(event.type);
    category_id = getFieldCodeID("category_dd");

    if (
      event.type == "app.record.edit.show" ||
      event.type == "app.record.detail.show"
    ) {
      addUIAction();
      addColorPicker(event.record.category_dd.value);
    } else if (event.type == "app.record.index.edit.submit.success") {
      setTimeout(() => {
        displayCats();
      }, 500);
    } else if (
      event.type == "app.record.edit.change.category_dd" ||
      event.type == "app.record.create.change.category_dd"
    ) {
      cpicker.value = getColor(event.record.category_dd.value);
    } else if (event.type == "app.record.create.show") {
      kelement = event;
      addUIAction();
      ///*Set enddate equal to the startdate*/
      setEndDate();
      addColorPicker();
      ///
    }
  }
);

function addUIAction() {
  //if ALL DAY cb is checked, DISABLE enddate and time
  //DISABLED enddate
  $(".value-" + getFieldCodeID("allday_cb") + " div span input").on(
    "click",
    function () {
      setInputValues(getFieldCodeID("end_date"), this.checked);
    }
  );
  setInputValues(
    getFieldCodeID("end_date"),
    $(".value-" + getFieldCodeID("allday_cb") + " div span input")[0]?.checked
  );
}
function setEndDate() {
  //THIS MUST BE CHECKED
  var d = new Date(Date.parse(elements.record.start_date.value) + 3600000);
  edate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
  etime = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h24",
  }).format(d);
  $(
    ".value-" + getFieldCodeID("end_date") + " input.input-date-text-cybozu"
  )[0].value = edate;
  $(
    ".value-" + getFieldCodeID("end_date") + " input.input-time-text-cybozu"
  )[0].value = etime;
}
function addColorPicker(category_item) {
  //<input type="color" id="html5colorpicker" onchange="clickColor(0, -1, -1, 5)" value="#ff0000" style="width: 30px;height: 30px;">
  cpicker = document.createElement("input");
  cpicker.id = "html5colorpicker";
  cpicker.type = "color";
  //cpicker.setAttribute("onchange", "clickColor(0, -1, -1, 5)");
  cpicker.value = getColor(category_item);
  cpicker.setAttribute("style", "width:174px; height:20px;");
  cpicker.addEventListener("change", watchColorPicker, false);
  //now add the element at the right place
  $(".field-" + getFieldCodeID("category_dd"))[0]?.append(cpicker);
}
function watchColorPicker() {
  cpicker.value = event.target.value;
  localStorage.setItem(elements.record.category_dd.value, cpicker.value);
  console.log("saving color " + cpicker.value);
}
function setInputValues(enddate_id, bool) {
  console.log(this.checked);
  if (bool) {
    //set the enddate value and state

    document
      .querySelectorAll(
        ".control-value-gaia.value-" + enddate_id + " div input"
      )
      ?.forEach((i) => {
        i.value = "";
        i.disabled = true;
        //console.log(i);
      });
  } else {
    document
      .querySelectorAll(
        ".control-value-gaia.value-" + enddate_id + " div input"
      )
      ?.forEach((i) => {
        i.disabled = false;
        //console.log(i);
      });
  }
}
kintone.events.on("space.portal.show", function () {
  var el = kintone.space.portal.getContentSpaceElement();
  el.textContent = "Hello Kintone!";
});
function getFieldCodeID(fc) {
  var retval = null;
  for (item in cybozu.data.page.FORM_DATA.schema.table.fieldList) {
    if (cybozu.data.page.FORM_DATA.schema.table.fieldList[item].var == fc) {
      //allday_cb フィールドコード IDを見つけた
      retval = item;
      break;
    }
  }
  return retval;
}
