'use strict'

describe ('Cardbox', () => {
  beforeAll((done) => {
    $('<div id="main_graph"></div>').appendTo('body')
      d3.json('../../spec/fixtures/archived_cards_fixture.json', (err, data) => {
      if (err) throw err
      this.chart   = new Chart(data)
      this.cardbox = this.chart.cardbox
      this.card    = this.chart.cards[5]
      done()
    })
  })

  afterAll(() => $('#main_graph').remove())

  it ('exists', () => {
    expect($('.cardbox').length).toEqual(1)
  })

  it ('is hidden by default', () => {
    expect($('.cardbox').css('display')).toEqual('none')
  })

  describe ('', () => {
    beforeEach(() => {
      this.cardbox.show(this.card)
    })

    it ('shows the card name', () => {
      expect($('.cardbox').text()).toContain(this.card.name)
    })

    it ('shows the card start date', () => {
      const startDate = this.cardbox.format_date(this.card.dateBegun)
      expect($('.cardbox').text()).toContain(startDate)
    })

    it ('shows the card finish date', () => {
      const finishDate = this.cardbox.format_date(this.card.dateFinished)
      expect($('.cardbox').text()).toContain(finishDate)
    })

    it ('is hidden when asked', () => {
      this.cardbox.hide()
      expect($('.cardbox').css('display')).toEqual('none')
    })

    it ('can format a date', () => {
      expect(this.cardbox.format_date(new Date('2016/08/11'))).toEqual('Thu Aug 11')
    })
  })
})
