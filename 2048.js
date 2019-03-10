class Game {
  constructor () {
	this.score = 0
    this.initBoard()
    this.display()
  }

  // Init board with 0 and add two 2 or 4 values randomly
  initBoard () {
    const dimension = 4 * 4
    this.board = Array(dimension)
    for (let i = 0; i < dimension; i++) {
      const row = Math.floor(i / 4)
      const col = i % 4
      const cell = { row, col, value: 0 }
      this.board[i] = cell
    }
    this.addNewValue()
	this.addNewValue()
  }

  // Display the board
  display () {
    const dimension = 4 * 4
    for (let i = 0; i < dimension; i++) {
      const cell = this.board[i]
      const id = cell.row + '-' + cell.col
      const cellElement = document.getElementById(id)
      cellElement.innerHTML = this.board[i].value
	}
	const scoreElement = document.getElementById("score")
	scoreElement.innerHTML = this.score
  }

  // Set a cell value using x,y coordinates
  // If trasposing row and col will transpose
  setCell (i, j, value, transposing) {
    if (!transposing) this.board[i * 4 + j] = { row: i, col: j, value }
    else this.board[j * 4 + i] = { row: j, col: i, value }
  }

  // Get a cell value using x,y coordinates
  // If trasposing row and col will transpose
  getCell (i, j, transposing) {
    if (!transposing) return this.board[i * 4 + j]
    else return this.board[j * 4 + i]
  }

  // Add a new value to an empty cell
  addNewValue () {
    const emptyCells = this.board.filter(cell => cell.value == 0)
    const numberOfEmptyCells = emptyCells.length
    const rdnIndex = Math.floor(numberOfEmptyCells * Math.random())
    const emptyCell = emptyCells[rdnIndex]
    const newValue = (Math.floor(Math.random() * 2) + 1) * 2
    this.setCell(emptyCell.row, emptyCell.col, newValue)
  }

  // One step indicated by user
  step (direction) {
    let iDiff
    let jDiff
    let iStart
    let jStart
    let iEnd
    let jEnd
    let transposing = false
	this.changed = false
    switch (direction) {
      case 'left':
        transposing = true
      case 'up':
        ;(iStart = 0), (iEnd = 4), (iDiff = 1)
        ;(jStart = 0), (jEnd = 3), (jDiff = 1)
        break
      case 'right':
        transposing = true
      case 'down':
        ;(iStart = 0), (iEnd = 4), (iDiff = 1)
        ;(jStart = 3), (jEnd = 0), (jDiff = -1)
        break
    }
    this.shift(iDiff, jDiff, iStart, jStart, iEnd, jEnd, transposing)
    this.merge(iDiff, jDiff, iStart, jStart, iEnd, jEnd, transposing)
    this.shift(iDiff, jDiff, iStart, jStart, iEnd, jEnd, transposing)
    if (this.changed) {
      this.addNewValue()
      this.display()
    }
  }

  // Shifting into one direction
  shift (iDiff, jDiff, iStart, jStart, iEnd, jEnd, transposing) {
    let notReady = true
    const t = transposing
    while (notReady) {
      notReady = false
      for (let i = iStart; i < iEnd; i += iDiff) {
        for (let j = jStart; jDiff * j < jDiff * jEnd; j += jDiff) {
          if (
            !this.getCell(j + jDiff, i, t).value == 0 &&
            this.getCell(j, i, t).value == 0
          ) {
            // Shift up
            this.setCell(j, i, this.getCell(j + jDiff, i, t).value, t)
            this.setCell(j + jDiff, i, 0, t)
            this.changed = true
            notReady = true
          }
        }
      }
    }
  }
  
  // Merge cells
  merge (iDiff, jDiff, iStart, jStart, iEnd, jEnd, transposing) {
    const t = transposing
    for (let i = iStart; i < iEnd; i += iDiff) {
      for (let j = jStart; jDiff * j < jDiff * jEnd; j += jDiff) {
        if (
          this.getCell(j, i, t).value > 0 &&
          this.getCell(j, i, t).value == this.getCell(j + jDiff, i, t).value
        ) {
		  // Merge cells
		  const newValue = 2 * this.getCell(j, i, t).value
          this.setCell(j, i, newValue, t)
		  this.setCell(j + jDiff, i, 0, t)
		  this.score += newValue
          this.changed = true
        }
      }
    }
  }
}

let game = new Game()
document.onkeyup = e => {
  switch (e.key) {
    case 'ArrowUp':
      game.step('up')
      break
    case 'ArrowDown':
      game.step('down')
      break
    case 'ArrowLeft':
      game.step('left')
      break
    case 'ArrowRight':
      game.step('right')
      break
  }
}
