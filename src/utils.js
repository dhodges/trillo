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

const prepare = (json_data) => {
  return {
    meta: {
    },
    cards: json_data.map((card) => _.merge({
      name:             card.name,
      description:      jsonEscape(card.description),
      dateDeployed:     dateDeployed(card),
      dateStartedDoing: dateStartedDoing(card),
      dateLastActivity: card.dateLastActivity
    }, card))
  }
}

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

module.exports.prepare = prepare
module.exports.jsonEscape = jsonEscape
module.exports.dateComparator = dateComparator
module.exports.deployedCards  = deployedCards
module.exports.dateDeployed   = dateDeployed
module.exports.dateStartedDoing = dateStartedDoing
module.exports.monthsAgo        = monthsAgo
module.exports.monthPreviousTo  = monthPreviousTo
