'use strict';

class Labelbox {
  constructor(labels, cards) {
    this.labels = labels
    this.cards  = cards
    this.table  = d3.select('#content')
                    .append('table')
                    .attr('id', 'labelbox')
    this.count_cards()
    this.format_html()
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

  format_html() {
    _.keys(this.labels).forEach((label) => {
      $(`
        <tr>
          <td class='color ${this.labels[label]}'></td>
          <td class='label'>${label} (${this.card_counts[label]})</td>
        </tr>
      `).appendTo('#labelbox')
    })
  }
}
