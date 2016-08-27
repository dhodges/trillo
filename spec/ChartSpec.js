'use strict'

describe ('Chart', () => {
  beforeAll((done) => {
    $('<div id="main_graph"></div>').appendTo('body')
    d3.json('../../spec/fixtures/archived_cards_fixture.json', (err, data) => {
      if (err) throw err
      this.chart = new Chart(data)
      this.cards = data[data.length-1].cards
      done()
    })
  })

  afterAll(() => $('#main_graph').remove())

  it ('should exist', () => expect(this.chart).not.toBeUndefined())

  describe ('cards', () => {
    it ('should exist', () => expect($('rect.card').length).toEqual(31))

    it ('should contain their ID', () => {
      expect($(`rect#${this.cards[0].id}`).length).toEqual(1)
    })

    describe ('when the mouse enters', () => {
      beforeAll(() => {
        this.d = this.cards[0]
        this.chart.mouseEnter(this.d)
      })

      it ('display a muted line', () => {
        expect($(`.card_highlight_${this.cards[0].id}`).css('opacity')).toEqual('0.6')
      })
    })

    describe ('when the mouse leaves', () => {
      beforeAll(() => {
        this.d = this.cards[0]
        this.chart.mouseEnter(this.d)
        this.chart.mouseOut(this.d)
      })

      it ('remove the muted line', () => {
        expect($(`.card_highlight_${this.cards[0].id}`).css('opacity')).toEqual('0')
      })
    })
  })
})
