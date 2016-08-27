'use strict'

// list cards bounced from TESTING back to DOING

class Bouncebox {
  update(month) {
    this.cards = _(this.countTheBounce(month.cards))
                   .filter((card) => card.bouncedBack > 0)
                   .sortBy(['bouncedBack'])
                   .reverse()
    this.update_html(this.cards)
  }

  countTheBounce(cards) {
    return _.forEach(cards, (card) => {
      card.bouncedBack = card.bouncedBack ||
        card.actions.filter(this.cardWasBounced).length
    })
  }

  cardWasBounced(action) {
    return !!(action.listBefore &&
              action.listBefore.name.match(/testing/i) &&
              action.listAfter &&
              action.listAfter.name.match(/doing/i))
  }

  update_html(bouncedcards) {
    $('#bouncebox').remove()
    $('#sidebar').append($(
      `<table id='bouncebox'>
         <tr><th colspan='2'>Count: from Testing back to Doing</th></tr>
       </table>`))

    bouncedcards.forEach((card) => {
      $(`
        <tr class='bounced_card'>
          <td>${card.bouncedBack}</td>
          <td>${card.name}</td>
        </tr>
      `).data('card_id', card.id)
        .appendTo($('#bouncebox'))
    })
  }
}
