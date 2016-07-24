'use strict'

const {expect, fixture} = require('./spec_helper')

const utils = require('../dist/utils.js')

try {
  describe ('filtering data', () => {
    const chart_data = utils.prepare(fixture('archived_cards_dump.json'))

    it ('for cards deployed to prod', () => {
      const deployedCards = utils.deployedCards(chart_data.cards)
      expect(deployedCards.length).to.equal(4)
    })
  })
}
catch(err) {
  console.error(`error: ${err.message}`)
  throw err
}
