'use strict';

class Chart {
  constructor(data) {
    if (!data) throw('card json data undefined!')
    this.meta    = this.prepMeta(data.meta)
    this.xscale  = this.makeXScale($('#main_graph').width())
    this.data    = data.cards
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
    this.showCards()
    this.addLabels()
    this.addHighlights()
    this.showXAxis()
    return this
  }

  showXAxis() {
    new XAxis(this.meta.dateFrom, this.meta.dateTo).show()
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
          .attr('class',   'label')
          .attr('class',   (label) => this.colorOf(label))
          .attr('width',   labelWidth)
          .attr('height',  d.height)
          .attr('x',       (label, li) => d.x+(li*labelWidth))
          .attr('y',       (label) => d.y)
    })
  }

  mouseEnter(d, i) {
    $(`.card_highlight_${i}`).css('opacity', 0.6)
    this.cardbox.show(d)
  }

  mouseOut(i) {
    this.cardbox.hide()
    $(`.card_highlight_${i}`).css('opacity', 0.0)
  }

  addHighlights() {
    d3.select('svg')
      .selectAll('g')
      .data(this.data)
      .enter()
      .append('rect')
        .attr('class',   (d,i) => `card_highlight_${i}`)
        .attr('width',   (d) => d.width)
        .attr('height',  (d) => d.height)
        .attr('x',       (d) => d.x)
        .attr('y',       (d) => d.y)
        .style('opacity', 0.0)
        .on('mouseenter',(d,i) => this.mouseEnter(d,i))
        .on('mouseout',  (d,i) => this.mouseOut(i))
  }

  showCards() {
    let cards = d3.select('#cards')
      .append('svg')
      .attr('class', 'cards')
      .selectAll('g')
      .data(this.data)
      .enter()

    cards.append('rect')
      .attr('class', 'card')
      .attr('id',     (d) => d.id)
      .attr('x',      (d) => d.x)
      .attr('y',      (d) => d.y)
      .attr('width',  (d) => d.width)
      .attr('height', (d) => d.height)
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
      .attr('x',      (d) => d.x)
      .attr('y',      (d) => d.y)
      .attr('width',  (d) => d.width)
      .attr('height', (d) => d.height)
  }

  prepCards() {
    d3.select('#main_graph')
      .append('div')
      .attr('id', 'cards')
    this.data.forEach((card, index) => {
      if (card.dateBegun)    {card.dateBegun    = new Date(card.dateBegun)}
      if (card.dateFinished) {card.dateFinished = new Date(card.dateFinished)}
      card.x     = this.scaleXstart(card)
      card.width = this.scaleWidth(card)
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
    return Math.floor($('#cards').height() / uniqueRowCount) - 2
  }

  prepCardsY() {
    this.cardHeight = this.calcCardHeight()
    const yOffset   = this.cardHeight+2
    let   i = 0
    this.data.forEach((card, ndx) => {
      if (!this.anyPreviousCardOverlaps(card)) {
        card.y = (i-1)*yOffset
      }
      else {
        card.y = i*yOffset
        i += 1
      }
      card.height = this.cardHeight
    })
  }

  prepMeta(meta) {
    return _.merge(meta, {
      dateFrom: new Date(meta.dateFrom),
      dateTo:   new Date(meta.dateTo)
    })
  }
}
