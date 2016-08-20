'use strict';

class Chart {
  constructor(data) {
    if (!data) throw('card json data undefined!')
    this.meta    = this.prepMeta(data.meta)
    this.xscale  = this.makeXScale($('#main_graph').width())
    this.cards   = data.cards
    this.cardbox = new Cardbox()
    this.prepCards()
    this.sanityCheck()
  }

  sanityCheck() {
    if (!this.cards)         throw('card data undefined!')
    if (!this.meta.dateFrom) throw('dateFrom date undefined!')
    if (!this.meta.dateTo)   throw('dateTo date undefined!')
  }

  makeXScale(width) {
    return d3.scale.linear()
      .domain([this.meta.dateFrom.getTime(), this.meta.dateTo.getTime()])
      .range( [0, width])
  }

  show() {
    this.showCards()
    this.addLabels()
    this.addHighlights()
    this.showXAxis()
    this.labelbox = new Labelbox(this.meta.labels, this.cards).show()
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
    this.cards.forEach((d) => {
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
      .data(this.cards)
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
      .data(this.cards)
      .enter()

    cards.append('rect')
      .attr('class', 'card')
      .attr('id',     (d) => d.id)
      .attr('x',      (d) => d.x)
      .attr('y',      (d) => d.y)
      .attr('width',  (d) => d.width)
      .attr('height', (d) => d.height)
  }

  ensureFullMonth(startDate, endDate) {
    startDate.setDate(1)

    endDate.setMonth(endDate.getMonth()+1)
    endDate.setDate(0)

    return [startDate, endDate]
  }

  prepMeta(meta) {
    const [dateFrom, dateTo] =
      this.ensureFullMonth(new Date(meta.dateFrom), new Date(meta.dateTo))
    return _.merge(meta, {
      dateFrom: dateFrom,
      dateTo:   dateTo
    })
  }

  prepCards() {
    d3.select('#main_graph')
      .append('div')
      .attr('id', 'cards')

    let rows = []

    this.cards.forEach((card, index) => {
      if (card.dateBegun)    {card.dateBegun    = new Date(card.dateBegun)}
      if (card.dateFinished) {card.dateFinished = new Date(card.dateFinished)}

      card.index = index
      card.x     = this.scaleXstart(card)
      card.width = this.scaleWidth(card)

      find_row: {
        for (let ndx=0; ndx<rows.length; ndx++) {
          if (rows[ndx].extent < card.x) {
            card.rowNdx = ndx
            rows[ndx].extent = card.x + card.width + 10
            break find_row
          }
        }
        rows.push({extent: card.x + card.width + 10})
        card.rowNdx = rows.length-1
      }

      this.cardHeight = Math.floor($('#cards').height() / rows.length) - 5
      const yOffset   = this.cardHeight + 5
      this.cards.forEach((card) => {
        card.y      = card.rowNdx * yOffset
        card.height = this.cardHeight
      })
    })
  }
}
