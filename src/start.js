
d3.json('archived_cards.json', (err, data) => {
  if (err) throw err

  Window.Trillo = {
    chart: new Chart(data[0]).show()
  }
})
