'use strict'

const {_, expect, fixture} = require('./spec_helper')

const utils = require('../dist/utils.js')

try {
  describe ('preparing the data', () => {
    const cards = utils.prepare(fixture('archived_cards_dump.json'))
    const meta  = cards.meta

    it ('gets the cards', () => {
      expect(cards.cards.length).to.equal(5)
    })

    describe ('meta', () => {
      it ('exists', () => expect(meta).to.not.be.undefined)
      it ('contains chart_from_date', () => expect(meta.chart_from_date).to.not.be.undefined)
      it ('contains chart_to_date',   () => expect(meta.chart_to_date).to.not.be.undefined)
    })
  })
}
catch(err) {
  console.log(`error: ${err.message}`)
  // throw err
}
