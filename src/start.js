
d3.json('archived_cards.json', (err, data) => {
  if (err) throw err

  new Chart(data).show()
})
