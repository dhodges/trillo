'use strict'

describe ('Cardbox', () => {
  beforeAll(() => {
    $('<div id="main_graph"></div>').appendTo('body')
    this.card = {
      id: 1111,
      x:  100,
      y:  100,
      name: 'Virginia Wolf',
      dateBegun: '2016-08-01',
      dateFinished: '2016-08-02'
    }
    this.cardbox = new Cardbox()
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
      expect($('.cardbox').text()).toContain(this.card.dateBegun)
    })

    it ('shows the card finish date', () => {
      expect($('.cardbox').text()).toContain(this.card.dateFinished)
    })

    it ('is hidden when asked', () => {
      this.cardbox.hide()
      expect($('.cardbox').css('display')).toEqual('none')
    })
  })
})
