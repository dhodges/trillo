'use strict'

class XScaler {

  constructor(dateFrom, dateTo, divWidth) {
    this.dateFrom = dateFrom
    this.dateTo   = dateTo
    this.xscale   = this.makeXScale(divWidth)
  }

  makeXScale(divWidth) {
    return d3.scale.linear()
      .domain([this.dateFrom.getTime(), this.dateTo.getTime()])
      .range( [0, divWidth])
  }

  scaleDate(d) {
    return Math.floor(this.xscale(d.getTime()))
  }

  xStart(d) {
    return Math.max(0, this.scaleDate(d.dateBegun || this.dateFrom))
  }

  xEnd(d) {
    return this.scaleDate(d.dateFinished || this.dateTo)
  }

  xWidth(d) {
    return Math.max(50, this.xEnd(d) - this.xStart(d))
  }
}
