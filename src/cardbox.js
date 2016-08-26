'use strict';

class Cardbox {
  constructor() {
    this.div = d3.select('#cards')
                 .append('div')
                 .attr('class', 'cardbox')
    this.width = 200
  }

  hide() {
    this.div.style('display', 'none')
  }

  findX(card) {
    return Math.max(10, card.x + (card.width/2) - (this.width/2))
  }

  findY(card) {
    return card.y + 32 + card.height*2
  }

  show(card) {
    this.div.style('left', `${this.findX(card)}px`)
            .style('top',  `${this.findY(card)}px`)
            .html(this.format_html(card))
            .style('display', 'block')
  }

  duration(card) {
    if (!card.dateBegun || ! card.dateFinished) {
      return 'unknown'
    }
    const days   = 86400000
    const hours  = 3600000
    const millis = card.dateFinished - card.dateBegun
    if (Math.round(millis / days) > 1) {
      return `${this.number_of_weekdays_between(card.dateBegun, card.dateFinished)} workdays`
    }
    if (Math.round(millis / days) == 1) {
      return `1 day`
    }
    if (Math.round(millis / hours) > 1) {
      return `${Math.round(millis / hours)} hours`
    }
    return '1 hour'
  }

  number_of_weekdays_between(date1, date2) {
    let d1 = new Date(date1),
        d2 = new Date(date2),
        total = 0

    while (d1 < d2) {
      d1.setDate(d1.getDate()+1)
      if (0 < d1.getDay() && d1.getDay() < 6) {
        total += 1
      }
    }
    return total
  }

  format_html(card) {
    const name     = card.name
    const begun    = card.dateBegun
    const finished = card.dateFinished
    return `
    ${name}<BR/>
    <HR/>
    <TABLE>
      <TR>
        <TD class='begun'>${this.format_date(begun)}</TD>
        <TD class='duration'>(${this.duration(card)})</TD>
        <TD class='finished'>${this.format_date(finished)}</TD>
      </TR>
    </TABLE>
    `
  }

  format_date(date) {
    if (!date) return ''
    const days   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}`
  }
}
