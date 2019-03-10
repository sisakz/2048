
class Game {
  constructor () {
	this.initBoard()
	console.log(this.board)
	this.display()
	//debugger
	//this.step("left")
	this.display()
  }

  initBoard () {
	const dimension = 4 * 4
	this.board = Array(dimension)
	for (let i = 0; i < dimension; i++) {
		const row = Math.floor(i / 4)
		const col = i % 4
	  	const cell = { row, col, value: 0 }
	  	this.board[i] = cell
	}
	/* this.setCell(1,0, 4) 
	this.setCell(3,0, 2)
	this.setCell(0,3, 4) 
	this.setCell(0,1, 4)  */
	this.addNewValue()
	this.addNewValue()
  }

  display () {
	const dimension = 4 * 4
	for (let i = 0; i < dimension; i++) {
		const cell = this.board[i]
	  	const id = cell.row + '-' + cell.col
		const cellElement = document.getElementById(id)
		cellElement.innerHTML = this.board[i].value
	}
  }

  setCell (i, j, value, transposing) {
	if (!transposing) this.board[i * 4 + j] = { row: i, col: j, value }
	else this.board[j * 4 + i] = { row: j, col: i, value }
  }

  getCell (i, j, transposing) {
	if (!transposing) return this.board[i * 4 + j]
	else return this.board[j * 4 + i]
  }

  addNewValue () {
	  const emptyCells = this.board.filter(cell => cell.value==0)
	  const numberOfEmptyCells = emptyCells.length
	  const rdnIndex = Math.floor(numberOfEmptyCells * Math.random())
	  const emptyCell = emptyCells[rdnIndex]
	  const newValue = (Math.floor(Math.random()*2)+1) * 2
	  this.setCell(emptyCell.row, emptyCell.col, newValue)
  }

  step(direction) {
	let iDiff, jDiff, iStart, jStart, iEnd, jEnd, transposing = false
	this.changed = false
	switch (direction) {
		case "left":
			transposing=true
		case "up":
			// i: col, j: row
			iStart = 0, iEnd = 4, iDiff = 1
			jStart = 0, jEnd = 3, jDiff = 1
			// i: row, j: col
			break
		case "right":
			transposing=true
			iStart = 0, iEnd = 4, iDiff = 1
			jStart = 3, jEnd = 0, jDiff = -1
			break			
		case "down":
			// i: col, j: row
			iStart = 0, iEnd = 4, iDiff = 1
			jStart = 3, jEnd = 0, jDiff = -1
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

  //Shift 
  shift(iDiff, jDiff, iStart, jStart, iEnd, jEnd, transposing) {
	let notReady = true
	const t = transposing
	while (notReady) {
		notReady = false
		for (let i=iStart; i<iEnd; i+=iDiff) {
			for (let j=jStart; jDiff * j< jDiff * jEnd; j+=jDiff) {
				if (!this.getCell(j+jDiff,i,t).value == 0 && this.getCell(j,i,t).value == 0) {
					// Shift up
					this.setCell(j,i, this.getCell(j+jDiff,i,t).value, t)
					this.setCell(j+jDiff,i, 0, t)
					this.changed = true
					notReady = true
				}
			}
		}
	}
  }

  merge(iDiff, jDiff, iStart, jStart, iEnd, jEnd, transposing) {
	const t = transposing
	for (let i=iStart; i<iEnd; i+=iDiff) {
		for (let j=jStart; jDiff * j< jDiff * jEnd; j+=jDiff) {
			if (this.getCell(j,i,t).value>0 && this.getCell(j,i,t).value==this.getCell(j+jDiff, i,t).value){
				// Merge
				this.setCell(j,i, 2 * this.getCell(j,i,t).value, t)
				this.setCell(j+jDiff,i, 0, t)
				this.changed = true
			}
		}
	}

  }

}

let game = new Game()
document.onkeyup = (e) => {
	console.log(e)
	switch (e.key) {
		case "ArrowUp": 
			game.step("up")
			break
		case "ArrowDown": 
			game.step("down")
			break
		case "ArrowLeft": 
			game.step("left")
			break
		case "ArrowRight": 
			game.step("right")
			break
	}
}
