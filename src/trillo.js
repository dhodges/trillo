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

const run = function() {
  const doingListId = process.env.TRELLO_DOING_LIST_ID

  trello.getCardsOnList(doingListId).then((cards) => {
    _.map(cards, (card) => {
  })
}

module.exports.run = run
module.exports.parseCardActions = parseCardActions
