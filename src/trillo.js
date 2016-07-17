'use strict';

require('dotenv').config()

const _        = require('lodash'),
      jsonfile = require('jsonfile'),
      db_query = require('./trillo_pg_query').query,
      Trello   = require('./trello').Trello,
      trello   = new Trello({
        key:   process.env.TRELLO_API_KEY,
        token: process.env.TRELLO_API_TOKEN
      })

const parseCardActions = (actions) => {
  return _.map(actions,
    (action) => ({
      id:         action.id,
      date:       action.date,
      type:       action.type,
      listAfter:  action.data.listAfter,
      listBefore: action.data.listBefore,
      memberCreator: {
        id:       action.memberCreator.id,
        fullName: action.memberCreator.fullName
      },
    }))
}

const parseCardLabels = (labels) => {
  return _.map(labels, (label) => label.name)
}

const parseCardMembers = (members) => {
  return _.map(members, (member) => ({
    fullName:   member.fullName,
    avatarHash: member.avatarHash
  }))
}

const parseCardDescription = (description) => {
  return description._value
}

const updateDb = (card) => {
  db_query("SELECT * FROM cards WHERE id = $1::varchar(24)", [card.id], (err, rows) => {
    if (err) throw err

    const sql = (rows.length > 0)
      ? "UPDATE cards SET name = $2::varchar(255), data = $3::json WHERE id = $1::varchar(24)"
      : "INSERT INTO cards (id, name, data) VALUES ($1::varchar(24), $2::varchar(255), $3::json)"

    db_query(sql, [card.id, card.name, card], (err, rows) => {if (err) throw err})
  })
}

const gatherCardsFromList = (listId) => {
  trello.getCardsOnList(listId).then((cards) => {
    _.map(cards, (c) => {
      trello.getCard(c.id, {
        actions: 'updateCard',
        members: 'true',
        fields:  'desc,labels,name,'
      }).then((card) => {
        updateDb({
          id:      card.id,
          name:    card.name,
          labels:  parseCardLabels(card.labels),
          members: parseCardMembers(card.members),
          actions: parseCardActions(card.actions),
          description: parseCardDescription(card.desc)
        })
      })
    })
  })
}

const run = function() {
  gatherCardsFromList(process.env.TRELLO_DOING_LIST_ID)
}

module.exports.run = run
module.exports.parseCardActions = parseCardActions
module.exports.parseCardLabels  = parseCardLabels
module.exports.parseCardMembers = parseCardMembers
module.exports.parseCardDescription = parseCardDescription
