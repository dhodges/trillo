'use strict'
import 'babel-polyfill'

let expect = require('expect'),
    trillo = require('../dist/trillo'),
    jsonf  = require('jsonfile'),
    _      = require('lodash')

const inputActions = jsonf.readFileSync(__dirname+'/fixtures/example_card_actions.json')
const card         = trillo.parseCardActions(inputActions).card
const cardActions  = trillo.parseCardActions(inputActions).actions

describe('parsing card actions', () => {

  it('gets the card id',  () => expect(card.id).toEqual('5772734392df14cd7100c08a'))
  it('gets the card name',  () => expect(card.name).toEqual('[SPP_AWS] Enable long resource IDs'))
  it('gets the action count', () => expect(cardActions.length).toEqual(4))

  it('gets the action IDs', () => {
    expect(_.map(cardActions, (action) => action.id)).toEqual([
      "577cc0528fe1e57585963024",
      "577bd6b69f353352d6d5ac90",
      "577bd5df0e95b6bcf0631988",
      "577bc5859e884837269c4240"
    ])})

  it('gets the main properties', () => {
    expect(_.keys(cardActions[0])).toEqual([
      "id",
      "date",
      "type",
      "listAfter",
      "listBefore",
      "memberCreator"
    ])})
})
