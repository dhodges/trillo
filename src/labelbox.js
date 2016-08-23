'use strict';

class Labelbox {
  constructor() {
    this.table =
      d3.select('#content')
        .append('table')
        .attr('id', 'labelbox')
  }

  update(month) {
    this.labels = month.meta.labels
    this.cards  = month.cards
    this.count_cards()
    this.update_html()
    return this
  }

  show() {
    this.table.style('display', 'block')
    return this
  }

  hide() {
    this.table.style('display', 'none')
  }

  count_cards() {
    const keys   = _.keys(this.labels)
    const counts = new Array(keys.length)
    _.fill(counts, 0)
    this.card_counts = _.zipObject(keys, counts)
    _.forEach(this.cards, (card) => {
      card.labels.forEach((label) => {
        this.card_counts[label] += 1
      })
    })
  }

  update_html() {
    $('#labelbox').empty()
    _.keys(this.labels).sort().forEach((label) => {
      $(`
        <tr>
          <td class='color ${this.labels[label]}'></td>
          <td class='label'>${label} (${this.card_counts[label]})</td>
        </tr>
      `).appendTo('#labelbox')
    })
  }
}
