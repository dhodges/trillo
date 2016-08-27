'use strict'

// list cards bounced from TESTING back to DOING

class Bouncebox {
  update(month) {
    this.update_html(
      _(this.countTheBounce(month.cards))
        .filter((card) => card.bouncedBack > 0)
        .sortBy(['bouncedBack'])
        .reverse()
    )
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
        <tr>
          <td>${card.bouncedBack}</td>
          <td>${card.name}</td>
        </tr>
      `).appendTo($('#bouncebox'))
    })
  }
}
