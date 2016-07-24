'use strict'

class XAxis {
  constructor(date1, date2) {
    // see: https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Axes.md#axis
    this.t0 = d3.time.week.offset(date1, -1)
    this.t1 = date1
    this.t2 = date2
    this.t3 = d3.time.week.offset(date2, +1)
  }

  show(parent_frame) {
    const parent_width  = parent_frame.attr('width')
    const parent_height = parent_frame.attr('height')
    const x = d3.time.scale()
                .domain([this.t0, this.t3])
                .range( [this.t0, this.t3].map(
                  d3.time.scale()
                    .domain([this.t1, this.t2])
                    .range([0, parent_width])
                ))
    this.xAxis = d3.svg.axis().scale(x)
    return parent_frame
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${+parent_height - 40})`)
      .call(this.xAxis)
  }
}
