'use strict'

const {_, expect, fixture} = require('./spec_helper')

const utils = require('../dist/utils.js')

try {
  describe ('utils.prepare()', () => {
    const data = utils.prepare(fixture('rows_dump.json'))
    const meta = data.meta

    it ('gets the cards', () => {
      expect(data.cards.length).to.equal(51)
    })

    it ('only gathers names for card labels', () => {
      expect(data.cards[0].labels).to.deep.equal([
        'spp',
        'tech'
      ])
    })

    describe ('meta', () => {
      it ('exists',         () => expect(meta).to.not.be.undefined)
      it ('has card count', () => expect(meta.cardCount).to.equal(51))
      it ('has dateFrom',   () => expect(meta.dateFrom).to.equal('2016-07-04T00:50:58.636Z'))
      it ('has dateTo',     () => expect(meta.dateTo).to.equal('2016-07-25T09:27:42.921Z'))
      it ('has labels as an object', () => {
        expect(meta.labels).to.deep.equal({
          "bug or minor feature": "red",
          "city": "red",
          "dev": "black",
          "epic": "blue",
          "product": "lime",
          "spp": "purple",
          "tech": "yellow"
        })
      })
    })
  })
}
catch(err) {
  console.log(`error: ${err.message}`)
  // throw err.message
  throw err
}
