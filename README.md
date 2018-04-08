
<p align="center"><img src="https://felixpitau.github.io/img/projects/hyperchess/hyperchess-logo.svg"</p>
<h3 align="center">The core engine to a four dimensional chess game</h3>
<p align="center">
  <img src="https://img.shields.io/badge/test-32%20passing%2C%2015%20failing-red.svg">
  <img src="https://img.shields.io/badge/license-MIT-lightgrey.svg">
  <img src="https://img.shields.io/badge/npm%20package-0.1.1-brightgreen.svg">
  <img src="https://img.shields.io/badge/code%20style-standard-lightgrey.svg">
</p>
<p align="center">
  <img src="https://nodei.co/npm/hyperchess.png">
</p>

---

## Basic Usage
```js
import Hyperchess, { Game } from 'hyperchess'

// new game instance
let game = new Game('Magnus Carlsen', 'Felix')

// get first player (white)
let whitePlayer = game.players[0]

// log the possible moves
whitePlayer.possibleMoves.forEach(m => {
  console.log(m.description)
})
```
