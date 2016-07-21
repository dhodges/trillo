'use strict'

const {_, expect, fixture} = require('./spec_helper')

const utils = require('../dist/utils.js')

try {
  describe ('preparing the data', () => {
    const chart_data = utils.prepare(fixture('archived_cards_dump.json'))

    describe ('gets the cards', () => {
      expect(chart_data.cards.length).to.equal(5)
    })

    describe ('gets the earliest "started DOING" date', () => {
      expect(chart_data.meta.earliest_date).to.equal("2016-06-07T14:43:27.978Z")
    })

    describe ('gets the latest "deployed to prod" date', () => {
      expect(chart_data.meta.latest_date).to.equal("2016-06-16T14:36:10.161Z")
    })
  })
}
catch(err) {
  console.log(`error: ${err.message}`)
  throw err
}
