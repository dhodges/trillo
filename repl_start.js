json_data = jsonf.readFileSync('archived_cards.json')
deployed_cards = utils.deployedCards(json_data.cards)
card_dates = deployed_cards.map((card) => {
  return {
    dateLastActivity: card.dateLastActivity,
    deployedDate: utils.deployedDate(card)
  }})
