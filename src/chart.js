'use strict';

class Chart {
  constructor(data) {
    if (!data) throw('card json data undefined!')
    this.cards = data.cards
    this.meta  = this.prep(data.meta)
    this.frame = this.makeFrame()
    this.sanityCheck()
  }

  sanityCheck() {
    if (!this.cards)         throw('cards undefined!')
    if (!this.meta.earliest) throw('earliest date undefined!')
    if (!this.meta.latest)   throw('latest date undefined!')
  }

  makeFrame() {
    return d3.select('#main_graph')
             .append('svg')
             .attr('width',  $('#main_graph').width())
             .attr('height', $('#main_graph').height())
             .attr('class', 'test_chart')
  }

  show() {
    new XAxis(this.meta.earliest, this.meta.latest)
      .show(this.frame)

    return this
  }

  prep(meta) {
    return {
      earliest: new Date(meta.earliest_date),
      latest:   new Date(meta.latest_date)
    }
  }
}
