'use strict'

const {expect, fixture, _} = require('./spec_helper')

const utils = require('../dist/utils.js')

try {
  describe ('utils', () => {
    const chart_data = utils.prepare(fixture('rows_dump.json'))

    it ('deployedCards', () => {
      expect(utils.deployedCards(chart_data.cards).length).to.equal(47)
    })

    it ('dateDeployed', () => {
      expect(utils.dateDeployed(chart_data.cards[3])).to.equal('2016-07-04T00:50:58.636Z')
    })

    it ('dateStartedDoing', () => {
      expect(utils.dateStartedDoing(chart_data.cards[0])).to.equal(null)
    })

    it ('dateFirstActivity', () => {
      expect(utils.dateFirstActivity(chart_data.cards[0])).to.equal('2016-06-28T19:50:37.748Z')
    })

    it ('monthPreviousTo', () => {
      const monthDates = utils.monthPreviousTo(new Date('2016-08-10 0:00 UTC'))
      expect(monthDates).to.deep.equal([new Date('2016-07-01'), new Date('2016-07-31')])
    })

    it ('card sort order', () => {
      expect(_.take(chart_data.cards.map(
        (card) => card.dateDeployed || card.dateLastActivity
      ), 6)).to.deep.equal([
        '2016-06-30T08:45:21.629Z',
        '2016-06-30T08:45:23.515Z',
        '2016-06-30T08:45:24.660Z',
        '2016-07-04T00:50:58.636Z',
        '2016-07-04T08:57:36.527Z',
        '2016-07-04T09:10:35.359Z'
      ])
    })
  })
}
catch(err) {
  console.error(`error: ${err.message}`)
  throw err.message
  // throw err
}
