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

const doingListId = process.env.TRELLO_DOING_LIST_ID

const run = function() {
  trello.getCardsOnList(doingListId).then((cards) => {
    _.map(cards, (card) => {
      trello.getCardActions(card.id, {filter:'updateCard'}).then((actions) => {
        trello.getCardLabels(card.id).then((labels) => {
          trello.getCardMembers(card.id).then((members) => {
            trello.getCardDescription(card.id).then((description) => {
              const card_data = {
                id:      card.id,
                name:    card.name,
                labels:  parseCardLabels(labels),
                members: parseCardMembers(members),
                actions: parseCardActions(actions),
                description: parseCardDescription(description)
              }

              db_query("SELECT * FROM cards WHERE id = $1::varchar(24)", [card.id], (err, rows) => {
                if (err) throw err

                if (rows.length > 0) {
                  db_query("UPDATE cards SET name = $1::varchar(255), data = $2::json WHERE id = $3::varchar(24)",
                    [card.name, card_data, card.id], (err, rows) => {if (err) throw err})
                }
                else {
                  db_query("INSERT INTO cards (id, name, data) VALUES ($1::varchar(24), $2::varchar(255), $3::json)",
                    [card.id, card.name, card_data], (err, rows) => {if (err) throw err})
                }
              })
            })
          })
        })
      })
    })
  })
}

module.exports.run = run
module.exports.parseCardActions = parseCardActions
module.exports.parseCardLabels  = parseCardLabels
module.exports.parseCardMembers = parseCardMembers
module.exports.parseCardDescription = parseCardDescription
