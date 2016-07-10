'use strict';

const config   = require('../config.json'),
      jsonfile = require('jsonfile'),
      Trello   = require('./trello').Trello

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
