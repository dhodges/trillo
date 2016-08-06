'use strict';

class Chart {
  constructor(data) {
    if (!data) throw('card json data undefined!')
    this.meta   = this.prepMeta(data.meta)
    this.xscale = this.makeXScale($('#main_graph').width())
    this.data   = data.cards
    this.cardbox = new Cardbox()
    this.prepCards()
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
    this.addLabels()
    this.setupClippaths()
    return this
  }

  showXAxis() {
    new XAxis(this.meta.dateFrom, this.meta.dateTo)
      .show(d3.select('#content'))
  }

  scaleDate(d) {
    return Math.floor(this.xscale(d.getTime()))
  }

  scaleXstart(d) {
    return Math.max(0, this.scaleDate(d.dateBegun || this.meta.dateFrom))
  }

  scaleXend(d) {
    return this.scaleDate(d.dateFinished || this.meta.dateTo)
  }

  scaleWidth(d) {
    return Math.max(50, this.scaleXend(d) - this.scaleXstart(d))
  }

  textX(d) {
    return Math.max(5, this.scaleXstart(d)+5) + d.labels.length*10
  }

  textY(d) {
    return d.y + Math.floor(3*this.cardHeight/4)
  }

  colorOf(label) {
    return this.meta.labels[label]
  }

  addLabels() {
    this.data.forEach((d) => {
      const labelWidth = this.scaleWidth(d) / Math.max(1, d.labels.length)
      d3.select('svg')
        .selectAll('g')
        .data(d.labels)
        .enter()
        .append('rect')
          .attr('class', 'label')
          .attr('class',  (label) => this.colorOf(label))
          .attr('width',  labelWidth)
          .attr('height', this.cardHeight)
          .attr('x',      (label, li) => this.scaleXstart(d)+(li*labelWidth))
          .attr('y',      (label) => d.y)
    })
  }

  showCards() {
    let cards = d3.select('#main_graph')
      .append('svg')
      .attr('class', 'cards')
      .selectAll('g')
      .data(this.data)
      .enter()

    cards.append('rect')
      .attr('class', 'card')
      .attr('id',    (d) => d.id)
      .attr('x',     (d) => this.scaleXstart(d))
      .attr('y',     (d) => d.y)
      .attr('width', (d) => this.scaleWidth(d))
      .attr('height', this.cardHeight)

    cards.append('svg:text')
      .text((d) => d.name)
      .attr('x',     (d) => this.textX(d))
      .attr('y',     (d) => this.textY(d))
      .attr('width', (d) => this.scaleWidth(d))
      .attr('text-anchor', 'start')
      .attr('clip-path', (d) => `url(#clip_${d.index})`)
  }

  setupClippaths() {
    d3.select('#main_graph')
      .append('svg')
      .attr('class', 'defs')
      .selectAll('g')
      .append('defs')
      .data(this.data)
      .enter()
      .append('clipPath')
      .attr('id', (d) => `clip_${d.index}`)
      .append('rect')
      .attr('x',     (d) => this.scaleXstart(d))
      .attr('y',     (d) => d.y)
      .attr('width', (d) => this.scaleWidth(d))
      .attr('height', this.cardHeight)
  }

  prepCards() {
    this.data.forEach((card, index) => {
      if (card.dateBegun)    {card.dateBegun    = new Date(card.dateBegun)}
      if (card.dateFinished) {card.dateFinished = new Date(card.dateFinished)}
      card.index = index
    })
    return this.prepCardsY()
  }

  anyPreviousCardOverlaps(card) {
    return this.data.slice(0, card.index).some((d) => this.scaleXend(d) >= this.scaleXstart(card))
  }

  calcCardHeight() {
    let uniqueRowCount = 0
    this.data.forEach((card, ndx) => {
      if (this.anyPreviousCardOverlaps(card)) {uniqueRowCount += 1}
    })
    return Math.floor($('#main_graph').height() / uniqueRowCount) - 2
  }

  prepCardsY() {
    this.cardHeight = this.calcCardHeight()
    const yOffset   = this.cardHeight+2
    let   i = 0
    return this.data.forEach((card, ndx) => {
      if (!this.anyPreviousCardOverlaps(card)) {
        card.y = (i-1)*yOffset
      }
      else {
        card.y = i*yOffset
        i += 1
      }
    })
  }

  prepMeta(meta) {
    return _.merge(meta, {
      dateFrom: new Date(meta.dateFrom),
      dateTo:   new Date(meta.dateTo)
    })
  }
}
