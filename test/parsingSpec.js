'use strict'

const {_, expect, jsonf, trello, trillo} = require('./spec_helper')

const inputActions = jsonf.readFileSync(__dirname+'/fixtures/example_card_actions.json')
const cardActions  = trillo.parseCardActions(inputActions)

describe('parsing card actions', () => {
  it ('gets the action count', () => {
    expect(cardActions.length).toEqual(4)
  })

  it ('gets the action IDs', () => {
    expect(_.map(cardActions, (action) => action.id)).toEqual([
      "577cc0528fe1e57585963024",
      "577bd6b69f353352d6d5ac90",
      "577bd5df0e95b6bcf0631988",
      "577bc5859e884837269c4240"
    ])})

  it ('gets the main properties', () => {
    expect(_.keys(cardActions[0])).toEqual([
      "id",
      "date",
      "type",
      "listAfter",
      "listBefore",
      "memberCreator"
    ])})
})

describe('parsing card labels', () => {
  const inputLabels = jsonf.readFileSync(__dirname+'/fixtures/57174a04af4e40dea638e79f_labels.json')
  const cardLabels  = trillo.parseCardLabels(inputLabels)

  it ('gets the label count', () => {
    expect(cardLabels.length).toEqual(2)
  })

  it ('gets the right labels', () => {
    expect(cardLabels).toInclude('SPP')
    expect(cardLabels).toInclude('Bug or Minor Feature')
  })
})

describe('parsing card members', () => {
  const inputMembers = jsonf.readFileSync(__dirname+'/fixtures/57174a04af4e40dea638e79f_members.json')
  const cardMembers  = trillo.parseCardMembers(inputMembers)

  it ('gets the member count', () => {
    expect(cardMembers.length).toEqual(2)
  })

  it ('gets the right members', () => {
    expect(cardMembers).toInclude({avatarHash: '3b492718da8409aae8ecbf715ea17d6e', fullName: 'spp_kicked_off'})
    expect(cardMembers).toInclude({avatarHash: '1d027b05589ea204bf493f0bbb11366a', fullName: 'spp_peer_reviewed'})
  })
})
