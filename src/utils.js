'use strict';

const dateComparator = (a1, a2) => {
  const d1 = new Date(a1)
  const d2 = new Date(a2)
  if (d1 < d2) {return -1}
  if (d1 > d2) {return 1}
  return 0
}

const byDate = dateComparator

const deployedToProd = (action) => {
  return action.listAfter.name == 'Deployed to Prod'
}

const find_latest_date = (json_data) => {
  return json_data.map((card) => {
    return card.actions
      .filter(deployedToProd)
      .map((action) => action.date)
      .sort(byDate)[0]
  }).sort(byDate)[0]
}

const startedDoing = (action) => {
  return action.listAfter.name.startsWith('DOING')
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
      earliest_date: find_earliest_date(json_data),
      latest_date:   find_latest_date(json_data)
    },
    cards: json_data.map((card) => {
      card.description = jsonEscape(card.description)
      return card
    })
  }
}

module.exports.prepare = prepare
module.exports.jsonEscape = jsonEscape
module.exports.dateComparator = dateComparator
