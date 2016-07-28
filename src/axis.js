'use strict'

class XAxis {
  constructor(date1, date2) {
    // see: https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Axes.md#axis
    this.t0 = d3.time.week.offset(date1, -1)
    this.t1 = date1
    this.t2 = date2
    this.t3 = d3.time.week.offset(date2, +1)
  }

  makeXScale(width) {
    return d3.time.scale()
      .domain([this.t0, this.t3])
      .range( [this.t0, this.t3].map(
        d3.time.scale()
          .domain([this.t1, this.t2])
          .range([0, width])
      ))
  }

  show(parent_frame) {
    const width = $('#main_graph').width()
    this.xAxis  = d3.svg.axis().scale(this.makeXScale(width))
    return parent_frame
      .append('svg')
      .attr('class', 'axis')
      .append('g')
      .attr('class', 'x')
      .attr('transform', `translate(20,10)`)
      .call(this.xAxis)
  }
}
