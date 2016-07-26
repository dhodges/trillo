'use strict'

const {_, expect, fixture} = require('./spec_helper')

const utils = require('../dist/utils.js')

try {
  describe ('preparing the data', () => {
    const chart_data = utils.prepare(fixture('archived_cards_dump.json'))

    describe ('gets the cards', () => {
      expect(chart_data.cards.length).to.equal(5)
    })
  })
}
catch(err) {
  console.log(`error: ${err.message}`)
  throw err
}
