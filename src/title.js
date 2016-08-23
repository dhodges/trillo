'use strict'

class Title {
  constructor() {
    let container = $(`<div class='title'></div>`)
    $(`<span class='arrow left'>◀</span>`).appendTo(container)
    $('<span id="title"></div>').appendTo(container)
    $(`<span class='arrow right'>▶ </span>`).appendTo(container)
    container.prependTo($('#main_graph'))
  }

  update(month) {
    $('#title').text(month.label)
  }
}
