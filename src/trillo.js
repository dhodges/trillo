'use strict';

require('dotenv').config()

const db_query = require('./trillo_pg_query').query,
      jsonf    = require('jsonfile'),
      _        = require('lodash'),
      Trello   = require('./trello').Trello,
      utils    = require('./utils'),
      fmt      = require('dateformat'),
      trello   = new Trello({
        key:   process.env.TRELLO_API_KEY,
        token: process.env.TRELLO_API_TOKEN
      })

const selectLabelFields = (label) => ({
  name:  label.name,
  color: label.color
})

const selectMemberFields = (member) => ({
  id:         member.id,
  fullName:   member.fullName,
  avatarHash: member.avatarHash
})

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

const selectFields = (card) => ({
  id:      card.id,
  name:    card.name,
  description:      card.desc,
  dateLastActivity: card.dateLastActivity,
  labels:  card.labels.map(selectLabelFields),
  members: card.members.map(selectMemberFields),
  actions: selectActionFields(card.actions)
})

const updateDb = (card) => {
  db_query(`SELECT * FROM archived_cards
            WHERE id = $1::varchar(24)`,
           [card.id], (err, rows) => {
    if (err) throw err

    const sql = (rows.length > 0)
      ? `UPDATE archived_cards
         SET name = $2::varchar(255),
         archived = $3::timestamp,
             data = $4::json
         WHERE id = $1::varchar(24)`

      : `INSERT INTO archived_cards (id, name, archived, data)
              VALUES ($1::varchar(24),
                      $2::varchar(255),
              $3::timestamp, $4::json)`

    db_query(sql, [card.id, card.name, card.dateLastActivity, card], (err, rows) => {
      if (err) throw err
    })
  })
}

const getCardsInDateRange = (fromDate, toDate) => {
  console.log(`gathering cards from db: ${fmt(fromDate, 'yyyy-mm-dd')} to ${fmt(toDate, 'yyyy-mm-dd')}...`)
  return db_query(`SELECT data FROM archived_cards
                    WHERE $1::timestamp <= archived
                      AND archived <= $2::timestamp`,
                  [fromDate.toISOString(), toDate.toISOString()])
}

const dumpPreviousMonthJson = () => {
  const [fromDate, toDate] = utils.monthPreviousTo(new Date())
  getCardsInDateRange(fromDate, toDate)
    .then((result) => {
      console.log(`writing cards to 'archived_cards.json'...`)
      jsonf.writeFileSync('archived_cards.json', utils.prepare(result[0]), {spaces: 2})
  })
}

const dumpPreviousMonthsJson = (numMonths) => {
  let toDate   = new Date()
  let fromDate = utils.monthsAgo(numMonths)
  fromDate.setDate(1)
  getCardsInDateRange(fromDate, toDate)
    .then((result) => {
      console.log(`partitioning ${result[0].length} cards...`)
      const cards_by_month = _.groupBy(result[0], (card) => fmt(card.data.dateLastActivity, 'mmmm yyyy'))
      const filtered_cards = _.mapValues(cards_by_month, (value) => utils.prepare(value))

      const cards = _.keys(filtered_cards).map((key) => ({
        label: key,
        meta:  filtered_cards[key].meta,
        cards: filtered_cards[key].cards
      })).sort((a, b) => utils.dateComparator(new Date(a.label), new Date(b.label)))

      console.log(`writing partitioned cards to 'archived_cards.json'...`)
      jsonf.writeFileSync('archived_cards.json', cards, {spaces: 2})
    })
}

const dumpjson = () => dumpPreviousMonthsJson(8)

const gatherArchivedCards = (boardId) => {
  return trello.getArchivedCards(boardId, {
    actions: 'updateCard',
    members: 'true',
    fields:  'desc,labels,name,dateLastActivity,idMembers',
    since:   utils.dateOneMonthAgoStr()
  })
}

const updateDbWithArchivedCards = function() {
  console.log(`gathering archived trello cards since ${utils.dateOneMonthAgoStr()}...`)

  gatherArchivedCards(process.env.TRELLO_BOARD_ID).then((cards) => {
    console.log('updating the db...')
    cards.forEach((card) => updateDb(selectFields(card)))
  })
}

module.exports.updateDbWithArchivedCards = updateDbWithArchivedCards
module.exports.selectFields = selectFields
module.exports.dumpjson = dumpjson
