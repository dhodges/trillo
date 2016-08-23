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
      .toEqual(['Mon Sep 23', 'Mon Sep 30', 'Mon Oct 07', 'Mon Oct 14',
                'Mon Oct 21', 'Mon Oct 28', 'Mon Nov 04'])
  })
})
