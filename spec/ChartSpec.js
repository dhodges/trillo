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

  })
})
