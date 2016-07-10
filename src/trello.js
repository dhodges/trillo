'use strict';
require('es6-promise').polyfill()

const rest = require('restler'),
         _ = require('lodash')

class Trello {
  constructor(opts) {
    this.auth = {key: opts.key, token: opts.token}
    this.uri  = 'https://api.trello.com'
  }

  request(fn, path, opts={}) {
    const options = {query: _.merge(opts, this.auth)}
    return new Promise((resolve, reject) => {
      fn(this.uri + path, options).once('complete', (result) => {
        (result instanceof Error) && reject(result) || resolve(result)
      })
    })
  }

  get(path, opts={}) {
    return this.request(rest.get, path, opts)
  }

  getCard(boardId, cardId) {
    return this.get(`/1/boards/${boardId}/cards/${cardId}`)
  }

  getCardsOnList(listId) {
    return this.get(`/1/lists/${listId}/cards`)
  }

  getCardActions(cardId) {
    return this.get(`/1/cards/${cardId}/actions`)
  }
}

module.exports.Trello = Trello
