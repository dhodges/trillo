'use strict'

class XAxis {
  constructor(date1, date2) {
    // see: https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Axes.md#axis
    this.t0 = d3.time.week.offset(date1, -1)
    this.t1 = date1
    this.t2 = date2
    this.t3 = d3.time.week.offset(date2, +1)
  }

  makeXScale() {
    return d3.time.scale()
      .domain([this.t0, this.t3])
      .range( [this.t0, this.t3].map(
        d3.time.scale()
          .domain([this.t1, this.t2])
          .range([0, $('#main_graph').width()])
      ))
  }

  addDaysToDate(n, date) {
    let date2 = new Date(date)
    date2.setDate(date2.getDate() + n)
    return date2
  }

  nextDay(date) {
    return this.addDaysToDate(1, date)
  }

  isMonday(date) {
    return 1 == date.getDay()
  }

  ticks() {
    let day = this.t0
    while (!this.isMonday(day)) {
      day = this.nextDay(day)
    }
    let ticks = []
    while (day < this.t3) {
      ticks.push(day)
      day = this.addDaysToDate(7, day)
    }
    return ticks
  }

  tickFormat(date) {
    const str = date.toDateString()
    return str.substr(0, str.lastIndexOf(' '))
  }

  show() {
    this.xAxis = d3.svg.axis().scale(this.makeXScale())
                   .tickValues(this.ticks())
                   .tickFormat(this.tickFormat)
    return d3.select('#main_graph')
      .append('svg')
      .attr('class', 'axis')
      .append('g')
      .attr('class', 'x')
      .attr('transform', `translate(20,10)`)
      .call(this.xAxis)
  }
}
