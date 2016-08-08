'use strict'

describe ('Chart', () => {
  beforeAll((done) => {
    $('<div id="main_graph"></div>').appendTo('body')
    d3.json('../../spec/fixtures/archived_cards.json', (err, data) => {
      if (err) throw err
      this.chart = new Chart(data).show()
      done()
    })
  })

  afterAll(() => $('#main_graph').remove())

  it ('should exist', () => expect(this.chart).not.toBeUndefined())

  describe ('cards', () => {
    it ('should exist', () => expect($('rect.card').length).toEqual(55))

    it ('should contain their ID', () => {
      expect($(`rect#${this.chart.data[0].id}`).length).toEqual(1)
    })

    describe ('when the mouse enters', () => {
      beforeAll(() => {
        this.d = this.chart.data[0]
        this.chart.mouseEnter(this.d, 0)
      })

      it ('display a muted line', () => {
        expect($('.card_highlight_0').css('opacity')).toEqual('0.6')
      })
    })

    describe ('when the mouse leaves', () => {
      beforeAll(() => {
        this.d = this.chart.data[0]
        this.chart.mouseEnter(this.d, 0)
        this.chart.mouseOut(0)
      })

      it ('display a muted line', () => {
        expect($('.card_highlight_0').css('opacity')).toEqual('0')
      })
    })
  })
})
