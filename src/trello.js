'use strict';
require('es6-promise').polyfill()

const rest = require('restler'),
         _ = require('lodash')

const {validFields, validActions} = require('./trello_arguments')


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

  getCard(cardId, opts={}) {
    return this.get(`/1/cards/${cardId}`, opts)
  }

  getCardsOnList(listId) {
    return this.get(`/1/lists/${listId}/cards`)
  }

  getCardActions(cardId, opts={}) {
    return this.get(`/1/cards/${cardId}/actions`, opts)
  }

  getCardMembers(cardId) {
    return this.get(`/1/cards/${cardId}/members`)
  }

  getCardField(cardId, field) {
    if (!validFields.includes(field)) {
      throw(new Error(`field: '${field}' is invalid.`))
    }
    return this.get(`/1/cards/${cardId}/${field}`)
  }

  getCardLabels(cardId) {
    return this.getCardField(cardId, 'labels')
  }

  getCardDescription(cardId) {
    return this.getCardField(cardId, 'desc')
  }
}

module.exports.Trello = Trello
