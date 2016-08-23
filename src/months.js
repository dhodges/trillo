'use strict'

class Months {
  constructor(months) {
    this.months = months
    this.current_ndx = this.months.length-1
  }

  current() {
    return this.months[this.current_ndx]
  }

  next() {
    if (this.current_ndx < this.months.length-1) {
      this.current_ndx += 1
    }
    return this.months[this.current_ndx]
  }

  previous() {
    if (this.current_ndx > 0) {
      this.current_ndx -= 1
    }
    return this.months[this.current_ndx]
  }
}
