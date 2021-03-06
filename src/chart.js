'use strict';

class Chart {
  constructor(data) {
    this.prepLayout()
    this.title    = new Title()
    this.cardbox  = new Cardbox()
    this.labelbox = new Labelbox()
    this.bouncebox = new Bouncebox()

    this.sanityCheck(data)
    data.forEach((month) => {
      month.meta  = this.prepMeta(month.meta)
      month.cards = this.prepCards(month)
    })
    this.prepTitleHandlers()
    this.months   = new Months(data)

    this.show(this.months.current())
  }

  sanityCheck(data) {
    if (!data)                  throw('data undefined!')
    if (!data[0].cards)         throw('card data undefined!')
    if (!data[0].meta)          throw('data.meta undefined!')
    if (!data[0].meta.dateFrom) throw('meta.dateFrom undefined!')
    if (!data[0].meta.dateTo)   throw('meta.dateTo undefined!')
  }

  prepTitleHandlers() {
    $('.title .arrow.left').on('click',  () => this.show(this.months.previous()))
    $('.title .arrow.right').on('click', () => this.show(this.months.next()))
  }

  show(month) {
    this.title.update(month)
    this.showCards(month)
    this.overlayCardLabels(month)
    this.labelbox.update(month).show()
    this.bouncebox.update(month)
    this.addHighlights(month.cards)
    this.showXAxis(month.meta)

    return this
  }

  showXAxis(meta) {
    new XAxis(meta.dateFrom, meta.dateTo).show()
  }

  overlayCardLabels(month) {
    const colorOf = (label) => month.meta.labels[label]

    d3.selectAll('rect.label').remove()

    month.cards.forEach((card) => {
      const labelWidth = card.width / Math.max(1, card.labels.length)

      d3.select('svg')
        .selectAll('g')
        .data(card.labels)
        .enter()
        .append('rect')
          .attr('class',   'label')
          .attr('class',   (label) => colorOf(label))
          .attr('width',   labelWidth)
          .attr('height',  card.height)
          .attr('x',       (label, li) => card.x+(li*labelWidth))
          .attr('y',       (label) => card.y)
    })
  }

  mouseEnter(card) {
    $(`.card_highlight_${card.id}`).css('opacity', 0.6)
    this.cardbox.show(card)
  }

  mouseEnterBounced(event, cards) {
    $(event.target).parent('tr').attr('style', 'background-color: lightsteelblue')
    const card_id = $(event.target).parent('tr').data('card_id')
    this.mouseEnter(cards.find((card) => card.id == card_id))
  }

  mouseOut(card) {
    this.cardbox.hide()
    $(`.card_highlight_${card.id}`).css('opacity', 0.0)
  }

  mouseOutBounced(event, cards) {
    $(event.target).parent('tr').removeAttr('style')
    const card_id = $(event.target).parent('tr').data('card_id')
    this.mouseOut(cards.find((card) => card.id == card_id))
  }

  addHighlights(cards) {
    d3.selectAll('rect.highlight').remove()

    d3.select('svg')
      .selectAll('g')
      .data(cards)
      .enter()
      .append('rect')
        .attr('class',   (card) => `highlight card_highlight_${card.id}`)
        .attr('width',   (card) => card.width)
        .attr('height',  (card) => card.height)
        .attr('x',       (card) => card.x)
        .attr('y',       (card) => card.y)
        .style('opacity', 0.0)
        .on('mouseenter',(card) => this.mouseEnter(card))
        .on('mouseout',  (card) => this.mouseOut(card))

    $('tr.bounced_card')
      .on('mouseenter', (event) => this.mouseEnterBounced(event, cards))
      .on('mouseout',   (event) => this.mouseOutBounced(event, cards))
  }

  showCards(month) {
    d3.selectAll('svg.cards rect').remove()

    d3.select('svg.cards')
      .selectAll('g')
      .data(month.cards)
      .enter()
      .append('rect')
      .attr('class', 'card')
      .attr('id',     (card) => card.id)
      .attr('x',      (card) => card.x)
      .attr('y',      (card) => card.y)
      .attr('width',  (card) => card.width)
      .attr('height', (card) => card.height)
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

    d3.select('#cards')
      .append('svg')
      .attr('class', 'cards')

    d3.select('#main_graph')
      .append('div')
      .attr('id', 'sidebar')
  }

  prepCards(month) {
    let   rows   = []
    const width  = $('#cards').width()
    const scaler = new XScaler(width, month.meta.dateFrom, month.meta.dateTo)

    month.cards.forEach((card) => {
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
    month.cards.forEach((card) => {
      card.y      = card.rowNdx * (cardHeight + 5)
      card.height = cardHeight
    })
    return month.cards
  }
}
