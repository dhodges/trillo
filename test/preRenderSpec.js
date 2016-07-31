'use strict'

const {_, expect, fixture} = require('./spec_helper')

const utils = require('../dist/utils.js')

try {
  describe ('preparing the data', () => {
    const cards = utils.prepare(fixture('archived_cards_dump.json'))
    const meta  = cards.meta

    it ('gets the cards', () => {
      expect(cards.cards.length).to.equal(47)
    })

    describe ('meta', () => {
      it ('exists', () => expect(meta).to.not.be.undefined)
      it ('has card count',    () => expect(meta.cardCount).to.equal(47))
      it ('contains dateFrom', () => expect(meta.dateFrom).to.equal('2016-05-31T17:19:22.405Z'))
      it ('contains dateTo',   () => expect(meta.dateTo).to.equal('2016-06-29T17:19:22.405Z'))
      it ('contains labels',   () => {
        expect(meta.labels).to.deep.equal([
          'best of',
          'bug or minor feature',
          'city',
          'epic',
          'open planet',
          'product',
          'spp',
          'tech'])
        })
    })
  })
}
catch(err) {
  console.log(`error: ${err.message}`)
  throw err.message
}
