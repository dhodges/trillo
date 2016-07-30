'use strict'

const {expect, fixture, _} = require('./spec_helper')

const utils = require('../dist/utils.js')

try {
  describe ('utils', () => {
    const chart_data = utils.prepare(fixture('archived_cards_dump.json'))

    it ('deployedCards', () => {
      expect(utils.deployedCards(chart_data.cards).length).to.equal(42)
    })

    it ('dateDeployed', () => {
      expect(utils.dateDeployed(chart_data.cards[3])).to.equal('2016-06-07T13:29:47.374Z')
    })

    it ('dateStartedDoing', () => {
      expect(utils.dateStartedDoing(chart_data.cards[0])).to.equal('2016-05-26T10:24:04.211Z')
    })

    it ('dateFirstActivity', () => {
      expect(utils.dateFirstActivity(chart_data.cards[0])).to.equal('2016-05-26T10:24:04.211Z')
    })

    it ('monthPreviousTo', () => {
      const monthDates = utils.monthPreviousTo(new Date('2016-08-10 0:00 UTC'))
      expect(monthDates).to.deep.equal([new Date('2016-07-01'), new Date('2016-07-31')])
    })

    it ('card sort order', () => {
      expect(_.take(chart_data.cards.map(
        (card) => card.dateDeployed || card.dateLastActivity
      ), 6)).to.deep.equal([
        '2016-06-03T00:55:58.824Z',
        '2016-06-03T00:56:00.857Z',
        '2016-06-07T04:19:24.803Z',
        '2016-06-07T13:29:47.374Z',
        '2016-06-07T13:29:47.405Z',
        '2016-06-07T13:29:47.427Z'
      ])
    })
  })
}
catch(err) {
  console.error(`error: ${err.message}`)
  throw err.message
  // throw err
}
