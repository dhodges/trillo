'use strict';

require('dotenv').config()

const db_query = require('./trillo_pg_query').query,
      jsonf    = require('jsonfile'),
      _        = require('lodash'),
      Trello   = require('./trello').Trello,
      utils    = require('./utils'),
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
  return actions.filter((action) => {
    // only want actions that move cards between lists
    return (action.data.listBefore && action.data.listAfter)
  }).map((action) => ({
    id:         action.id,
    date:       action.date,
    type:       action.type,
    listBefore: action.data.listBefore,
    listAfter:  action.data.listAfter,
    member:     selectMemberFields(action.memberCreator)
  })).sort((a1, a2) => utils.dateComparator(a1.date, a2.date))
}

const selectFields = (card) => {
  return {
    id:      card.id,
    name:    card.name,
    description: card.desc,
    dateLastActivity: card.dateLastActivity,
    labels:  card.labels.map((label) => label.name),
    members: card.members.map((member) => selectMemberFields(member)),
    actions: selectActionFields(card.actions)
  }
}

const updateDb = (card) => {
  db_query("SELECT * FROM archived_cards WHERE id = $1::varchar(24)", [card.id], (err, rows) => {
    if (err) throw err

    const sql = (rows.length > 0)
      ? "UPDATE archived_cards SET name = $2::varchar(255), archived = $3::timestamp, data = $4::json WHERE id = $1::varchar(24)"
      : "INSERT INTO archived_cards (id, name, archived, data) VALUES ($1::varchar(24), $2::varchar(255), $3::timestamp, $4::json)"

    db_query(sql, [card.id, card.name, card.dateLastActivity, card], (err, rows) => {if (err) throw err})
  })
}

const dumpPreviousMonthJson = (fromDate, toDate) => {
  db_query(`SELECT data FROM archived_cards
            WHERE $1::timestamp <= archived AND archived <= $2::timestamp`,
           [fromDate.toISOString(), toDate.toISOString()], (err, rows) => {
    if (err) throw err
    let cards = utils.prepare(rows.map((row) => row.data))
    _.merge(cards.meta, {
      chart_from_date: fromDate.toISOString(),
      chart_to_date:   toDate.toISOString()
    })
    jsonf.writeFileSync('archived_cards.json', cards, {spaces: 2})
  })
}

const dumpjson = () => {
  const [fromDate, toDate] = utils.monthPreviousTo(new Date())
  dumpPreviousMonthJson(fromDate, toDate)
}

const gatherArchivedCards = (boardId) => {
  return trello.getArchivedCards(boardId, {
    actions: 'updateCard',
    members: 'true',
    fields:  'desc,labels,name,dateLastActivity,idMembers',
    since:   '2016-01-01'
  })
}

const updateDbWithArchivedCards = function() {
  console.log('gathering archived cards from trello...')

  gatherArchivedCards(process.env.TRELLO_BOARD_ID).then((cards) => {
    console.log('updating the db...')
    cards.forEach((card) => updateDb(selectFields(card)))
  })
}

module.exports.updateDbWithArchivedCards = updateDbWithArchivedCards
module.exports.selectFields = selectFields
module.exports.dumpjson = dumpjson
