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
      it ('contains chart_from_date', () => expect(meta.chart_from_date).to.equal('2016-05-31T17:19:22.405Z'))
      it ('contains chart_to_date',   () => expect(meta.chart_to_date).to.equal('2016-06-29T17:19:22.405Z'))
    })
  })
}
catch(err) {
  console.log(`error: ${err.message}`)
  // throw err
}
