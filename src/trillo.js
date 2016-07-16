'use strict';

require('dotenv').config()

const _        = require('lodash'),
      jsonfile = require('jsonfile'),
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

const run = function() {
  const doingListId = process.env.TRELLO_DOING_LIST_ID

  trello.getCardsOnList(doingListId).then((cards) => {
    _.map(cards, (card) => {
      trello.getCardActions(card.id, {filter:'updateCard'}).then((actions) => {
        trello.getCardLabels(card.id).then((labels) => {
          trello.getCardMembers(card.id).then((members) => {
            jsonfile.writeFileSync(__dirname+`/${card.id}.json`, {
              card: {
                id:      card.id,
                name:    card.name,
                labels:  parseCardLabels(labels),
                members: parseCardMembers(members),
                actions: parseCardActions(actions)
              }
            }, {spaces:2})
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
