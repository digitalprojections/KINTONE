kintone.events.on('app.record.detail.show', function(event){
    //kintone.app.record.setFieldShown('Text', false);
    elements = event;
    //alert(event);
  });

  kintone.events.on('space.portal.show', function () {
    var el = kintone.space.portal.getContentSpaceElement();
    el.textContent = 'Hello Kintone!';
  });