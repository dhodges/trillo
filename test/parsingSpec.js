'use strict'

const {_, expect, jsonf, trillo} = require('./spec_helper')

const fixture = (fname) => {
  return jsonf.readFileSync(__dirname+'/fixtures/'+fname)
}

describe ('selecting fields', () => {
  const card = trillo.selectFields(fixture('example_card_fields.json'))

  it ('gets the action count', () => {
    expect(card.actions.length).to.equal(5)
  })

  it ('gets the action IDs', () => {
    expect(card.actions.map((action) => action.id)).to.deep.equal([
      '57833c62cd950e7e15457953',
      '578439d58c96e01ba3bf7494',
      '578492348282ec24d843e391',
      '5786d12fe8d60c0af241e15a',
      '5786d1362ae470b9c1fe2f12'
    ])
  })

  it ('sorts the actions', () => {
    const dates = card.actions.map((action) => action.date)
    expect(dates[0]).to.be.below(dates[1])
    expect(dates[1]).to.be.below(dates[2])
    expect(dates[2]).to.be.below(dates[3])
    expect(dates[3]).to.be.below(dates[4])
  })

  it ('only returns actions with "listBefore" and "listAfter"', () => {
    const actions = card.actions.filter((action) => (action.listBefore && action.listAfter))
    expect(actions.length).to.equal(5)
  })

  it ('gets the main properties', () => {
    expect(_.keys(card.actions[0])).to.deep.equal([
      'id',
      'date',
      'type',
      'listBefore',
      'listAfter',
      'member'
    ])
  })

  it ('gets the label count', () => {
    expect(card.labels.length).to.equal(1)
  })

  it ('gets the labels', () => {
    expect(card.labels).to.include('Tech')
  })

  it ('gets the member count', () => {
    expect(card.members.length).to.equal(2)
  })

  it ('gets the members', () => {
    expect(card.members).to.include({
      avatarHash: '0ff01919582c01e27a00a52efa8c44c3',
      fullName:   'Spaceman Bob',
      id:         '56a0366d1c8b64d1d477d604'
    })
    expect(card.members).to.include({
      avatarHash: 'abd86914d8819e57f2255bff9e84cf14',
      fullName:   'Minnie Mouse',
      id:         '576778eb76ced9768807e083'
    })
  })

  it ('gets the description', () => {
    expect(card.description).to.equal('https://github.com/lonelyplanet/spp_dashboard/issues/15\nhttps://github.com/lonelyplanet/spp_aws/issues/34\n\nThe auto shutdown script may cause devbox update to fail.\n\nDevelop a new way to maintain devbox `running` status for devbox update')
  })
})
