'use strict';

const _ = require('lodash')

const dateComparator = (a1, a2) => {
  const d1 = new Date(a1)
  const d2 = new Date(a2)
  if (d1 < d2) {return -1}
  if (d1 > d2) {return 1}
  return 0
}

const byDate = dateComparator

const deployedToProd = (action) => {
  return action.listAfter &&
    action.listAfter.name == 'Deployed to Prod'
}

const startedDoing = (action) => {
  return action.listAfter &&
    action.listAfter.name.startsWith('DOING')
}

const deployedCards = (cards) => {
  return cards.filter((card) => _.some(card.actions, deployedToProd))
}

const dateDeployed = (card) => {
  const action = card.actions.filter(deployedToProd)[0]
  return action ? action.date : null
}

const dateStartedDoing = (card) => {
  const action = card.actions.filter(startedDoing)[0]
  return action ? action.date : null
}

const dateFirstActivity = (card) => {
  return card.actions.map((a) => a.date)
    .sort(byDate)[0]
}

const find_latest_date = (json_data) => {
  return json_data.map((card) => {
    return card.actions
      .filter(deployedToProd)
      .map((action) => action.date)
      .sort(byDate)[0]
  }).sort(byDate)[0]
}

const find_earliest_date = (json_data) => {
  return json_data.map((card) => {
    return card.actions
      .filter(startedDoing)
      .map((action) => action.date)
      .sort(byDate)[0]
  }).sort(byDate)[0]
}

const jsonEscape = (str) =>  {
  return str.replace(/\n/g, "\\\\n")
            .replace(/\r/g, "\\\\r")
            .replace(/\t/g, "\\\\t")
}

const gatherLabels = (rows) => {
  return _.uniq(
    _.flatten(rows.map((r) => r.data.labels)))
      .map(_.lowerCase).sort()
}

const prepare = (rows) => ({
  meta: {
    dateFrom: rows[0].fromdate,
    dateTo:   rows[0].todate,
    labels:   gatherLabels(rows),
  },
  cards: rows.map((row) => _.merge({
    name:             row.data.name,
    id:               row.data.id,
    description:      jsonEscape(row.data.description),
    dateFirstActivity: dateFirstActivity(row.data),
    dateStartedDoing:  dateStartedDoing(row.data),
    dateDeployed:      dateDeployed(row.data),
    dateLastActivity: row.data.dateLastActivity
  }, row.data)).sort((a,b) => byDate(
    a.dateDeployed || a.dateLastActivity,
    b.dateDeployed || b.dateLastActivity
  ))
})

const monthsAgo = (n) => {
  let d = new Date()
  d.setMonth(d.getMonth() - n)
  return d
}

const monthPreviousTo = (thisDate) => {
  const endDay   = new Date(thisDate.setDate(0))
  const startDay = new Date(endDay)
  startDay.setDate(1)
  return [startDay, endDay]
}

module.exports.byDate  = byDate
module.exports.prepare = prepare
module.exports.jsonEscape = jsonEscape
module.exports.dateComparator = dateComparator
module.exports.deployedCards  = deployedCards
module.exports.dateDeployed   = dateDeployed
module.exports.dateStartedDoing = dateStartedDoing
module.exports.monthsAgo        = monthsAgo
module.exports.monthPreviousTo  = monthPreviousTo
module.exports.dateFirstActivity = dateFirstActivity
