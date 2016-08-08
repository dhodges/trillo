'use strict';

class Cardbox {
  constructor() {
    this.div = d3.select('#main_graph')
                 .append('div')
                 .attr('class', 'cardbox')
    this.width = 200
  }

  hide() {
    this.div.style('display', 'none')
  }

  findX(card) {
    return Math.max(0, card.x + (card.width/2) - (this.width/2))
  }

  findY(card) {
    return card.y + card.height*2
  }

  show(card) {
    this.div.style('left', `${this.findX(card)}px`)
            .style('top',  `${this.findY(card)}px`)
            .html(this.format_html(card))
            .style('display', 'block')
  }

  format_html(card) {
    const name     = card.name
    const begun    = card.dateBegun
    const finished = card.dateFinished
    return `
    ${name}<BR/>
    <HR/>
    <TABLE>
      <TR><TD>begun:</TD><TD>${begun}</TD></TR>
      <TR><TD>finished:</TD><TD>${finished}</TD></TR>
    </TABLE>
    `
  }
}
