'use strict';

require('dotenv').config()

const jsonfile = require('jsonfile'),
      db_query = require('./trillo_pg_query').query,
      Trello   = require('./trello').Trello,
      trello   = new Trello({
        key:   process.env.TRELLO_API_KEY,
        token: process.env.TRELLO_API_TOKEN
      })

const selectMemberFields = (member) => {
  return {
    id:         member.id,
    fullName:   member.fullName,
    avatarHash: member.avatarHash
  }
}

const selectActionFields = (actions) => {
  return actions.map((action) => ({
    id:         action.id,
    date:       action.date,
    type:       action.type,
    listBefore: action.data.listBefore,
    listAfter:  action.data.listAfter,
    member:     selectMemberFields(action.memberCreator)
  }))
}

const selectFields = (card) => {
  return {
    id:      card.id,
    name:    card.name,
    description: card.desc,
    labels:  card.labels.map((label) => label.name),
    members: card.members.map((member) => selectMemberFields(member)),
    actions: selectActionFields(card.actions)
  }
}

const updateDb = (card) => {
  db_query("SELECT * FROM cards WHERE id = $1::varchar(24)", [card.id], (err, rows) => {
    if (err) throw err

    const sql = (rows.length > 0)
      ? "UPDATE cards SET name = $2::varchar(255), data = $3::json WHERE id = $1::varchar(24)"
      : "INSERT INTO cards (id, name, data) VALUES ($1::varchar(24), $2::varchar(255), $3::json)"

    db_query(sql, [card.id, card.name, card], (err, rows) => {if (err) throw err})
  })
}

const gatherCardsFromList = (listId) => {
  trello.getCardsOnList(listId).then((cards) => {
    cards.map((c) => {
      trello.getCard(c.id, {
        actions: 'updateCard',
        members: 'true',
        fields:  'desc,labels,name,'
      }).then((card) => {
        updateDb(selectFields(card))
      })
    })
  })
}

const run = function() {
  gatherCardsFromList(process.env.TRELLO_DOING_LIST_ID)
}

module.exports.run = run
module.exports.selectFields = selectFields
