'use strict'

const makeFrame = () => {
  return d3.select('#cards')
           .append('svg')
           .attr('width',  $('#cards').width())
           .attr('height', $('#cards').height())
           .attr('class', 'test_chart')
}

describe ('X Axis', () => {
  beforeAll(() => {
    $('<div id="cards"></div>').appendTo('body')
    this.earliest = new Date("2013-09-29")
    this.latest   = new Date("2013-10-29")
    new XAxis(this.earliest, this.latest)
      .show(makeFrame())
  })

  afterAll(() => $('#cards').remove())

  it ('should exist', () => {
    expect($('.x.axis')).not.toBeUndefined()
  })

  it ('should generate ticks', () => {
    expect($('.tick text').toArray().map((t) => t.textContent))
      .toEqual(['Mon 23', 'Mon 30', 'Mon 07', 'Mon 14', 'Mon 21', 'Mon 28', 'Mon 04'])
  })
})
