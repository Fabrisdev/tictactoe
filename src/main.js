const { invoke } = window.__TAURI__.tauri
const player_turn_text = document.querySelector('#player_turn_text')
const square_0_0 = document.querySelector('#sq-0-0')
const square_0_1 = document.querySelector('#sq-0-1')
const square_0_2 = document.querySelector('#sq-0-2')
const square_1_0 = document.querySelector('#sq-1-0')
const square_1_1 = document.querySelector('#sq-1-1')
const square_1_2 = document.querySelector('#sq-1-2')
const square_2_0 = document.querySelector('#sq-2-0')
const square_2_1 = document.querySelector('#sq-2-1')
const square_2_2 = document.querySelector('#sq-2-2')
const squares = [
  [square_0_0, square_0_1, square_0_2],
  [square_1_0, square_1_1, square_1_2],
  [square_2_0, square_2_1, square_2_2],
]

class Game {
  #player_turn = 1
  #table = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]
  #finished = false

  #nextTurn() {
    this.#goToNextTurn()
    player_turn_text.textContent = `Turno del jugador ${this.get_turn()}`
  }

  #goToNextTurn() {
    if (this.#player_turn === 1) {
      this.#player_turn = 2
      return
    }
    this.#player_turn = 1
  }

  #getPlayerCharacter() {
    if (this.#player_turn === 1) return 'X'
    return 'O'
  }

  #update_square(column, row) {
    if (this.#table[column][row] !== null) return
    this.#table[column][row] = this.#getPlayerCharacter()
    squares[column][row].textContent = this.#getPlayerCharacter()
    this.#nextTurn()
  }

  is_full() {
    return !this.#table[0].includes(null) && !this.#table[1].includes(null) && !this.#table[2].includes(null)
  }

  update_game_table(column, row) {
    this.#check_if_winner()
    if (this.#finished) return
    this.#update_square(column, row)
    this.#check_if_winner()
    invoke('print', {
      name: "-----------------"
    })
    invoke('print', {
      name: JSON.stringify(this.#table[0])
    })
    invoke('print', {
      name: JSON.stringify(this.#table[1])
    })
    invoke('print', {
      name: JSON.stringify(this.#table[2])
    })
  }

  #check_if_winner() {
    //rows (horizontal)
    for (let i = 0; i < this.#table.length; i++) {
      if (this.#table[i].every(value => value === this.#table[i][0]) && this.#table[i][0] !== null) {
        const lastPlayer = this.get_turn() === 1 ? 2 : 1
        player_turn_text.textContent = 'El ganador es el jugador: ' + lastPlayer
        this.#finished = true
        return
      }
    }
    //columns (vertical)
    for (let i = 0; i < this.#table.length; i++) {
      if (this.#table[0][i] === this.#table[1][i] && this.#table[0][i] === this.#table[2][i] && this.#table[0][i] !== null) {
        const lastPlayer = this.get_turn() === 1 ? 2 : 1
        player_turn_text.textContent = 'El ganador es el jugador: ' + lastPlayer
        this.#finished = true
        return
      }
    }
    //diagonal
    if (this.#table[0][0] === this.#table[1][1] && this.#table[0][0] === this.#table[2][2] && this.#table[0][0] !== null) {
      const lastPlayer = this.get_turn() === 1 ? 2 : 1
      player_turn_text.textContent = 'El ganador es el jugador: ' + lastPlayer
      this.#finished = true
      return
    }
    if (this.#table[0][2] === this.#table[1][1] && this.#table[0][2] === this.#table[2][0] && this.#table[0][2] !== null) {
      const lastPlayer = this.get_turn() === 1 ? 2 : 1
      player_turn_text.textContent = 'El ganador es el jugador: ' + lastPlayer
      this.#finished = true
      return
    }
    if (this.is_full()) {
      player_turn_text.textContent = 'Empate'
      this.#finished = true
    }
  }

  get_square(column, row) {
    return this.#table[column][row]
  }

  get_turn() {
    return this.#player_turn
  }

  get_table() {
    return this.#table
  }

  get_player_by_character(character) {
    if (character === 'X') return 1
    return 2
  }
}

let game = new Game()



function update_table(column, row) {

  game.update_game_table(column, row)
}

function restart_game() {
  for (let i = 0; i < squares.length; i++) {
    for (let j = 0; j < squares[i].length; j++) {
      squares[i][j].textContent = ''
    }
  }
  game = new Game()
  player_turn_text.textContent = 'Turno del jugador 1'
}