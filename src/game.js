var Player = require('./player.js');
var Piece = require('./piece.js');
var Move = require('./move.js');
var Board = require('./board.js');
var Square = require('./square.js');
var Spot = require('./spot.js');

module.exports = class Game {

  constructor (whiteName = "white", blackName = "black", description = "") {
    this.players = [
      new Player(0, whiteName),
      new Player(1, blackName)
    ];
    this.pieces = [
      new Piece(0, 'bishop', [1, 0, 0, 0]),
      new Piece(0, 'king', [1, 0, 1, 0]),
      new Piece(0, 'king', [1, 0, 2, 0]),
      new Piece(0, 'bishop', [1, 0, 3, 0]),
      new Piece(0, 'pawn', [1, 0, 0, 1]),
      new Piece(0, 'pawn', [1, 0, 1, 1]),
      new Piece(0, 'pawn', [1, 0, 2, 1]),
      new Piece(0, 'pawn', [1, 0, 3, 1]),
      new Piece(0, 'knight', [2, 0, 0, 0]),
      new Piece(0, 'rook', [2, 0, 1, 0]),
      new Piece(0, 'rook', [2, 0, 2, 0]),
      new Piece(0, 'knight', [2, 0, 3, 0]),
      new Piece(0, 'pawn', [2, 0, 0, 1]),
      new Piece(0, 'pawn', [2, 0, 1, 1]),
      new Piece(0, 'pawn', [2, 0, 2, 1]),
      new Piece(0, 'pawn', [2, 0, 3, 1]),
      new Piece(1, 'pawn', [1, 3, 0, 2]),
      new Piece(1, 'pawn', [1, 3, 1, 2]),
      new Piece(1, 'pawn', [1, 3, 2, 2]),
      new Piece(1, 'pawn', [1, 3, 3, 2]),
      new Piece(1, 'knight', [1, 3, 0, 3]),
      new Piece(1, 'rook', [1, 3, 1, 3]),
      new Piece(1, 'rook', [1, 3, 2, 3]),
      new Piece(1, 'knight', [1, 3, 3, 3]),
      new Piece(1, 'pawn', [2, 3, 0, 2]),
      new Piece(1, 'pawn', [2, 3, 1, 2]),
      new Piece(1, 'pawn', [2, 3, 2, 2]),
      new Piece(1, 'pawn', [2, 3, 3, 2]),
      new Piece(1, 'bishop', [2, 3, 0, 3]),
      new Piece(1, 'king', [2, 3, 1, 3]),
      new Piece(1, 'king', [2, 3, 2, 3]),
      new Piece(1, 'bishop', [2, 3, 3, 3])
    ];
    this.moves = [];
    this.check = false;
    this.mate = false;
    this.turn = 0;
    this.description = description;
    this.board = new Board();
    this.board.update(this);
  }

  makeMove (move) {
    throw "Not a valid move!"
    return false;
  }

  possibleMoves (piece) {
    let moves = [];
    if (piece.constructor.name == "Piece") {
      if (piece.side != this.turn) {
        return [];
      }
      if (piece.type == 'king') {
        let trySpots = Spot.getSpotsFor('king');
        while (trySpots.length > 0) {
          let trySpot = trySpots.pop();
          let trySquare = this.board.at(trySpot);
          if (!trySquare.out && !trySquare.attacked[piece.side == 0 ? 1 : 0]) {
            if (trySquare.occupied) {
              if (trySquare.piece.side != piece.side) {
                moves.push(new Move(piece, trySpot));
              } else if (trySquare.piece.type == 'rook'
                  && !trySquare.piece.moved
                  && !piece.moved) {
                moves.push(new Move(piece, trySpot));
              }
            } else {
              moves.push(new Move(piece, trySpot));
            }
          }
        }
      }
      if (piece.type == 'bishop' || piece.type == 'queen' || piece.type == 'rook') {
        let trySpots = Spot.getSpotsFor(piece.type);
        for (let i = 0; i < trySpots.length; i++) {
          while (trySpots[i].length > 0) {
            let trySpot = trySpots[i].pop();
            let trySquare = this.board.at(Spot.add(piece.spot, trySpot));
            if (!trySquare.out) {
              if (trySquare.occupied) {
                if (trySquare.piece.side != piece.side) {
                  moves.push(new Move(piece, trySpot));
                }
                break;
              } else {
                moves.push(new Move(piece, trySpot));
              }
            } else {
              break;
            }
          }
        }
      }
      if (piece.type == 'knight') {
        let trySpots = Spot.getSpotsFor('knight');
        while (trySpots.length > 0) {
          let trySpot = trySpots.pop();
          let trySquare = this.board.at(Spot.add(piece.spot, trySpot));
          if (!trySquare.out) {
            if (trySquare.occupied) {
              if (trySquare.piece.side != piece.side) {
                moves.push(new Move(piece, trySpot));
              }
            } else {
              moves.push(new Move(piece, trySpot));
            }
          }
        }
      }
      if (piece.type == 'pawn') {
        let trySpots = [];
        if (!piece.moved) {
          let trySpotSets = Spot.getSpotsFor('pawn double step')[piece.side];
          while (trySpotSets.length > 0) {
            let trySpotSet = trySpotSets.pop();
            if (!this.board.at(trySpotSet[0]).occupied &&
                !this.board.at(trySpotSet[1]).occupied) {
              moves.push(new Move(piece, trySpotSet[1]));
            }
          }
        }
        trySpots = Spot.getSpotsFor('pawn step')[piece.side];
        while (trySpots.length > 0) {
          let trySpot = trySpots.pop();
          if (!this.board.at(trySpot).occupied) {
            moves.push(new Move(piece, trySpot));
          }
        }
        trySpots = Spot.getSpotsFor('pawn capture')[piece.side];
        while (trySpots.length > 0) {
          let trySpot = trySpots.pop();
          let trySquare = this.board.at(trySpot);
          if (trySquare.occupied &&
              !trySquare.out &&
              trySquare.piece.side != piece.side) {
            moves.push(new Move(piece, trySpot));
          }
        }
        // TODO: en passant and promotion
      }
      if (piece.type != 'king'
          && this.board.at(piece.spot).attacked[piece.side == 0 ? 1 : 0]) {
        // TODO: check if move puts or keeps king(s) in check
        let kings = () => {
          let ks = []
          for (let p of this.pieces) {
            if (p.side == piece.side && p.type == 'king') {
              ks.push(p);
            }
          }
          return ks;
        }
        let typesToTest = ['bishop', 'rook'];
        for (let k = 0; k < kings.length; k++) {
          for (let j = 0; j < typesToTest.length; j++) {
            let tryType = typesToTest[j];
            let trySpots = Spot.getSpotsFor(tryType);
            for (let i = 0; i < trySpots.length; i++) {
              while (trySpots[i].length > 0) {
                let trySpot = trySpots[i].pop();
                let trySquare = this.board.at(Spot.add(piece.spot, trySpot));
                if (!trySquare.out) {
                  if (trySquare.occupied) { // TODO: check that piece in question is the one moving to mark current position as unoccupied and new position as occupied
                    let tryPiece = trySquare.piece;
                    if (tryPiece.side != piece.side
                        && (tryPiece.type == tryType || tryPiece.type == 'queen')) {
                      tryMove.pop(); // TODO: setup loop to iterate through each possible piece move
                    }
                    break;
                  } else {
                    // TODO: ???
                  }
                } else {
                  break;
                }
              }
            }
          }
        }
      }
    }
    return moves;
  }

  undo (times = 1) {
    if (this.moves.length > 0) {
      let lastMove = this.moves.pop();
      if (lastMove.capture) {
        this.pieces.push(lastMove.capturedPiece);
      }
    }
  }
}
