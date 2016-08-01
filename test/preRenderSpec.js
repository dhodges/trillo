'use strict'

const {_, expect, fixture} = require('./spec_helper')

const utils = require('../dist/utils.js')

try {
  describe ('utils.prepare()', () => {
    const data = utils.prepare(fixture('rows_dump.json'))
    const meta = data.meta

    it ('gets the cards', () => {
      expect(data.cards.length).to.equal(55)
    })

    it ('only gathers names for card labels', () => {
      expect(data.cards[0].labels).to.deep.equal([
        'bug or minor feature',
        'spp'
      ])
    })

    describe ('meta', () => {
      it ('exists',         () => expect(meta).to.not.be.undefined)
      it ('has card count', () => expect(meta.cardCount).to.equal(55))
      it ('has dateFrom',   () => expect(meta.dateFrom).to.equal('2016-07-01T01:14:21.538Z'))
      it ('has dateTo',     () => expect(meta.dateTo).to.equal('2016-07-31T01:14:21.538Z'))
      it ('has labels',     () => {
        expect(meta.labels).to.deep.equal([
          {"name": "bug or minor feature", "color": "red"},
          {"name": "city",    "color": "red"},
          {"name": "dev",     "color": "black"},
          {"name": "epic",    "color": "blue"},
          {"name": "product", "color": "lime"},
          {"name": "spp",     "color": "purple"},
          {"name": "tech",    "color": "yellow"}
        ])
      })
    })
  })
}
catch(err) {
  console.log(`error: ${err.message}`)
  // throw err.message
  throw err
}
