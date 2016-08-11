'use strict';

class Labelbox {
  constructor(labels) {
    this.labels = labels
    this.table  = d3.select('#content')
                    .append('table')
                    .attr('id', 'labelbox')
    this.format_html()
  }

  show() {
    this.table.style('display', 'block')
    return this
  }

  hide() {
    this.table.style('display', 'none')
  }

  format_html() {
    _.keys(this.labels).forEach((label) => {
      $(`
        <tr>
          <td class='color ${this.labels[label]}'></td>
          <td class='label'>${label}</td>
        </tr>
      `).appendTo('#labelbox')
    })
  }
}
