'use strict'

const {expect, fixture} = require('./spec_helper')

const utils = require('../dist/utils.js')

try {
  describe ('utils', () => {
    const chart_data = utils.prepare(fixture('archived_cards_dump.json'))

    it ('for cards deployed to prod', () => {
      const deployedCards = utils.deployedCards(chart_data.cards)
      expect(deployedCards.length).to.equal(42)
    })

    it ('for date deployed', () => {
      expect(utils.dateDeployed(chart_data.cards[3])).to.equal('2016-06-23T09:46:07.210Z')
    })

    it ('for date started Doing', () => {
      expect(utils.dateStartedDoing(chart_data.cards[0])).to.equal('2016-06-17T01:16:32.405Z')
    })

    it ('for dateFirstActivity', () => {
      expect(utils.dateFirstActivity(chart_data.cards[0])).to.equal('2016-06-17T01:16:32.405Z')
    })

    it ('for determining previous month', () => {
      const monthDates = utils.monthPreviousTo(new Date('2016-08-10 0:00 UTC'))
      expect(monthDates).to.deep.equal([new Date('2016-07-01'), new Date('2016-07-31')])
    })
  })
}
catch(err) {
  console.error(`error: ${err.message}`)
  throw err.message
  // throw err
}
