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

const dateFinished = (card) => {
  return dateDeployed(card) || card.dateLastActivity
}

const dateStartedDoing = (card) => {
  const action = card.actions.filter(startedDoing)[0]
  return action ? action.date : null
}

const dateFirstActivity = (card) => {
  return card.actions.map((a) => a.date)
    .sort(byDate)[0]
}

const dateBegun = (card) => {
  return dateStartedDoing(card) || dateFirstActivity(card)
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

const gatherLabelsNameAndColor = (rows) => {
  return _.uniqBy(_.flatten(rows.map((r) => r.data.labels)), 'name')
    .map((label) => {
      let obj = {}
      obj[label.name.toLowerCase()] = label.color.toLowerCase()
      return obj
    }).reduce(((accum, obj) => _.merge(accum, obj)), {})
}

const gatherLabelsNameOnly = (labels) => {
  return _.uniq(labels.map((label) => label.name.toLowerCase()))
    .sort((a,b) => a.localeCompare(b))
}

const prepare = (rows) => ({
  meta: {
    dateFrom:     rows[0].fromdate,
    dateTo:       rows[0].todate,
    cardCount:    rows.length,
    labels:       gatherLabelsNameAndColor(rows),
  },
  cards: rows.map((row) => ({
    name:         row.data.name,
    id:           row.data.id,
    description:  jsonEscape(row.data.description),
    dateBegun:    dateBegun(row.data),
    dateFinished: dateFinished(row.data),
    labels:       gatherLabelsNameOnly(row.data.labels),
    actions:      row.data.actions
  })).sort((a,b) => byDate(a.dateFinished, b.dateFinished))
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
module.exports.dateBegun        = dateBegun
module.exports.dateFinished     = dateFinished
module.exports.monthsAgo        = monthsAgo
module.exports.monthPreviousTo  = monthPreviousTo
module.exports.dateFirstActivity = dateFirstActivity
