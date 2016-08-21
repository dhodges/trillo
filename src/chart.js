'use strict';

class Chart {
  constructor(data) {
    this.prepLayout()
    this.cardbox  = new Cardbox()
    this.labelbox = new Labelbox()

    this.sanityCheck(data)
    data.forEach((month) => {
      month.meta  = this.prepMeta(month.meta)
      month.cards = this.prepCards(month.cards, month.meta.dateFrom, month.meta.dateTo)
    })

    this.show(data[data.length-1].cards,
              data[data.length-1].meta)
  }

  sanityCheck(data) {
    if (!data)                  throw('data undefined!')
    if (!data[0].cards)         throw('card data undefined!')
    if (!data[0].meta)          throw('data.meta undefined!')
    if (!data[0].meta.dateFrom) throw('meta.dateFrom undefined!')
    if (!data[0].meta.dateTo)   throw('meta.dateTo undefined!')
  }

  show(cards, meta) {
    this.showCards(cards)
    this.overlayCardLabels(cards, meta)
    this.addHighlights(cards)
    this.showXAxis(meta)
    this.labelbox.update(meta.labels, cards).show()
    return this
  }

  showXAxis(meta) {
    new XAxis(meta.dateFrom, meta.dateTo).show()
  }

  overlayCardLabels(cards, meta) {
    const colorOf = (label) => {
      return meta.labels[label]
    }
    cards.forEach((d) => {
      const labelWidth = d.width / Math.max(1, d.labels.length)
      d3.select('svg')
        .selectAll('g')
        .data(d.labels)
        .enter()
        .append('rect')
          .attr('class',   'label')
          .attr('class',   (label) => colorOf(label))
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

  addHighlights(cards) {
    d3.select('svg')
      .selectAll('g')
      .data(cards)
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

  showCards(cards) {
    d3.select('#cards')
      .append('svg')
      .attr('class', 'cards')
      .selectAll('g')
      .data(cards)
      .enter()
      .append('rect')
      .attr('class', 'card')
      .attr('id',     (d) => d.id)
      .attr('x',      (d) => d.x)
      .attr('y',      (d) => d.y)
      .attr('width',  (d) => d.width)
      .attr('height', (d) => d.height)
  }

  ensureFullMonth(endDate) {
    let startDate = new Date(endDate)
    startDate.setDate(1)

    endDate.setMonth(endDate.getMonth()+1)
    endDate.setDate(0)

    return [startDate, endDate]
  }

  prepMeta(meta) {
    const [dateFrom, dateTo] = this.ensureFullMonth(new Date(meta.dateTo))
    return _.merge(meta, {
      dateFrom: dateFrom,
      dateTo:   dateTo
    })
  }

  prepLayout() {
    d3.select('#main_graph')
      .append('div')
      .attr('id', 'cards')
  }

  prepCards(cards, dateFrom, dateTo) {
    let   rows   = []
    const width  = $('#main_graph').width()
    const scaler = new XScaler(width, dateFrom, dateTo)

    cards.forEach((card) => {
      card.dateBegun    = (card.dateBegun    && new Date(card.dateBegun)) || null
      card.dateFinished = (card.dateFinished && new Date(card.dateFinished)) || null
      card.x            = scaler.xStart(card)
      card.width        = scaler.xWidth(card)

      // fit as many cards into as few rows as possible
      // then the row count (vertically within the page div) determines the card height
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
    })

    const cardHeight = Math.floor($('#cards').height() / rows.length) - 5
    cards.forEach((card) => {
      card.y      = card.rowNdx * (cardHeight + 5)
      card.height = cardHeight
    })
    return cards
  }
}
