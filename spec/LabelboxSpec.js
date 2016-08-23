'use strict'

describe ('Labelbox', () => {
  beforeAll((done) => {
    $('<div id="main_graph"></div>').appendTo('body')
    d3.json('../../spec/fixtures/archived_cards_fixture.json', (err, data) => {
      if (err) throw err
      this.labelbox = new Labelbox()
      this.labelbox.update(data[0])
      done()
    })
  })

  afterAll(() => $('#main_graph').remove())

  it ('exists', () => {
    expect($('#labelbox').length).toEqual(1)
  })

  it ('is hidden by default', () => {
    expect($('#labelbox').css('display')).toEqual('none')
  })

  describe ('', () => {
    beforeEach(() => {this.labelbox.show()})

    it ('lists each label', () => {
      _.keys(this.labelbox.labels).forEach((label) => {
        expect($('#labelbox').text()).toContain(label)
      })
    })

    it ('is hidden when asked', () => {
      this.labelbox.hide()
      expect($('#labelbox').css('display')).toEqual('none')
    })
  })
})
