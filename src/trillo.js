'use strict';

const config   = require('../config.json'),
      jsonfile = require('jsonfile'),
      Trello   = require('./trello').Trello,
      _        = require('lodash')

const parseCardActions = (actions) => ({
  card: {
    id:   actions[0].data.card.id,
    name: actions[0].data.card.name
  },
  actions: _.map(
    _.filter(actions, (a) => a.type == 'updateCard'),
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
    }))})

const run = function() {
  const listId = config.lists[3].id
  const trello = new Trello(config)

  trello.getCardsOnList(listId).then((cards) => {
    console.log('Deployed to Prod')
    console.log('----------------')
    cards.forEach((card) => console.log('* ' + card.name))
  })
}

module.exports.run = run
module.exports.parseCardActions = parseCardActions
