'use strict'

const {expect, fixture, _} = require('./spec_helper')

const utils = require('../dist/utils.js')

try {
  describe ('utils', () => {
    const chart_data = utils.prepare(fixture('rows_dump.json'))

    it ('deployedCards', () => {
      expect(utils.deployedCards(chart_data.cards).length).to.equal(44)
    })

    it ('dateDeployed', () => {
      expect(utils.dateDeployed(chart_data.cards[3])).to.equal('2016-07-04T12:48:20.520Z')
    })

    it ('dateStartedDoing', () => {
      expect(utils.dateStartedDoing(chart_data.cards[0])).to.equal('2016-06-27T11:56:29.420Z')
    })

    it ('dateFirstActivity', () => {
      expect(utils.dateFirstActivity(chart_data.cards[0])).to.equal('2016-06-27T11:56:29.420Z')
    })

    it ('monthPreviousTo', () => {
      const monthDates = utils.monthPreviousTo(new Date('2016-08-10 0:00 UTC'))
      expect(monthDates).to.deep.equal([new Date('2016-07-01'), new Date('2016-07-31')])
    })

    it ('card sort order', () => {
      expect(_.take(chart_data.cards.map((card) => card.dateFinished), 6))
        .to.deep.equal([
        '2016-07-04T00:50:58.636Z',
        '2016-07-04T08:57:36.527Z',
        '2016-07-04T09:10:35.359Z',
        '2016-07-04T12:48:20.520Z',
        '2016-07-05T00:03:10.450Z',
        '2016-07-05T00:33:27.602Z'])
    })
  })
}
catch(err) {
  console.error(`error: ${err.message}`)
  throw err.message
  // throw err
}
