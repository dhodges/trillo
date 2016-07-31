'use strict';

class Chart {
  constructor(data) {
    if (!data) throw('card json data undefined!')
    this.data   = data.cards
    this.meta   = this.prep(data.meta)
    this.xscale = this.makeXScale($('#main_graph').width())
    this.sanityCheck()
  }

  sanityCheck() {
    if (!this.data)          throw('card data undefined!')
    if (!this.meta.dateFrom) throw('dateFrom date undefined!')
    if (!this.meta.dateTo)   throw('dateTo date undefined!')
  }

  makeXScale(width) {
    return d3.scale.linear()
      .domain([this.meta.dateFrom.getTime(),
               this.meta.dateTo.getTime()])
      .range( [0, width])
  }

  show() {
    this.showXAxis()
    this.showCards()
    return this
  }

  showXAxis() {
    new XAxis(this.meta.dateFrom, this.meta.dateTo)
      .show(d3.select('#content'))
  }

  showCards() {
    const scaleX = (dStr) => this.xscale(new Date(dStr).getTime())
    const scaleWidth = (d) => {
      const start = scaleX(d.dateStartedDoing)
      const end   = scaleX(d.dateDeployed || d.dateLastActivity)
      return (end - start) < 50 ? 50 : (end - start)
    }
    const textX = (d) => {
      const x = scaleX(d.dateStartedDoing)+5
      return Math.max(x, 5)
    }

    let cards = d3.select('#main_graph')
      .append('svg')
      .attr('class', 'cards')
      .selectAll('g')
      .data(this.data)
      .enter()

    cards.append('rect')
      .attr('class', 'card')
      .attr('name',  (d) => d.name)
      .attr('x',     (d) => scaleX(d.dateStartedDoing))
      .attr('y',     (d, i) => i*22)
      .attr('width', (d) => scaleWidth(d))
      .attr('height', 20)

    cards.append('svg:text')
      .text((d) => d.name)
      .attr('x',     (d) => textX(d))
      .attr('y',     (d, i) => i*22+15)
      .attr('width', (d) => scaleWidth(d))
      .attr('text-anchor', 'start')
      .attr('clip-path', (d,i) => `url(#clip_${i})`)

    d3.select('#main_graph')
      .append('svg')
      .attr('class', 'defs')
      .selectAll('g')
      .append('defs')
      .data(this.data)
      .enter()
      .append('clipPath')
      .attr('id', (d,i) => `clip_${i}`)
      .append('rect')
      .attr('x',     (d) => scaleX(d.dateStartedDoing))
      .attr('y',     (d, i) => i*22)
      .attr('width', (d) => scaleWidth(d))
      .attr('height', 20)
  }

  prep(meta) {
    return _.merge(meta, {
      dateFrom: new Date(meta.dateFrom),
      dateTo:   new Date(meta.dateTo)
    })
  }
}
