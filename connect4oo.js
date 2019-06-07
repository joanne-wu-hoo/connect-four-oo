class Game{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.board = this.makeBoard();
        this.currPlayer = 1;
        this.makeHTMLBoard();
    }

    makeBoard(){
        let board = [];
        for (let y = 0; y < this.height; y++) {
            board.push(Array.from({ length: this.width }));
        }
        return board;
    }

    makeHTMLBoard(){
        const boardHTML = document.getElementById('board');

        // make column tops (clickable area for adding a piece to that column)
        const top = document.createElement('tr');
        top.setAttribute('id', 'column-top');
        // ** FIXED ** bind handleClick to game instance, else "this" will refer to the clicked column-top div
        top.addEventListener('click', this.handleClick.bind(this));       

        for (let x = 0; x < this.width; x++) {
        const headCell = document.createElement('td');
        headCell.setAttribute('id', x);
        top.append(headCell);
        }

        boardHTML.append(top);

        for (let y = 0; y < this.height; y++) {
            const row = document.createElement('tr');
        
            for (let x = 0; x < this.width; x++) {
              const cell = document.createElement('td');
              cell.setAttribute('id', `${y}-${x}`);
              row.append(cell);
            }
  
            boardHTML.append(row);
        }
    }

    findSpotForCol(x) {
        for (let y = this.height - 1; y >= 0; y--) {
          if (!this.board[y][x]) {
            return y;
          }
        }
        return null;
    }

    placeInTable(y, x) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.classList.add(`p${this.currPlayer}`);
        piece.style.top = -50 * (y + 2);
      
        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
    }

    endGame(msg) {
        setTimeout(function(){alert(msg);},500);
    }

    handleClick(evt) {
        // get x from ID of clicked cell
        const x = +evt.target.id;
      
        // get next spot in column (if none, ignore click)
        const y = this.findSpotForCol(x);
        if (y === null) {
          return;
        }
      
        // place piece in board and add to HTML table
        this.board[y][x] = this.currPlayer;
        this.placeInTable(y, x);
        
        // check for win
        if (this.checkForWin()) {
          return this.endGame(`Player ${this.currPlayer} won!`);
        }
        
        // check for tie
        if (this.board.every(row => row.every(cell => cell))) {
          return this.endGame('Tie!');
        }
          
        // switch players
        this.currPlayer = this.currPlayer === 1 ? 2 : 1;
    }

    checkForWin() {
        // ** FIXED ** Bind _win to instantiated game
        let _boundWin = _win.bind(this);

        function _win(cells) {
          // Check four cells to see if they're all color of current player
          //  - cells: list of four (y, x) cells
          //  - returns true if all are legal coordinates & all match currPlayer
      
          // ** FIXED ** Change arrow function to normal function (checkValidCoordinates) and bind to the instantiated game instance
          return cells.every(
            // function(){console.log("my function thinks 'this' is: ", this)})
            ([y, x]) =>
              y >= 0 &&
              y < this.height &&
              x >= 0 &&
              x < this.width &&
              this.board[y][x] === this.currPlayer
          );

          /* 
          Option 1
            - Bind "win" function to instantiated game instance
            - Win function has an arrow function in it. That arrow function will use whatever the win function is referecing as "this"

          Option 2
          - Bind "win" function to instantiated game instance
          - Win function has a normal non-arrow function in it. We also bind that normal function to the game.

          Option 3
          - Change win function to an arrow function, that way it will look at what checkForWin is considering "this" (which is the game)
          */
         
          // let checkValidCoordinates = function([y,x]){
          //   return (y >= 0 && y < this.height && x >= 0 && x < this.width &&  this.board[y][x] === this.currPlayer)
          // };
          // // ** FIXED ** Bind to the instantiated game instance
          // return cells.every(checkValidCoordinates.bind(this));
        }

        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            // get "check list" of 4 cells (starting here) for each of the different
            // ways to win
            const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
            const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
            const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
            const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      
            // find winner (only checking each win-possibility as needed)
            // Call version of win function that is bound to the instantiated game instance
            if (_boundWin(horiz) || _boundWin(vert) || _boundWin(diagDR) || _boundWin(diagDL)) {
              return true;
            }
          }
        }
      }

    // reset(){
    //     this.board = makeBoard();
    //     //remove HTML stuff
    // }
}

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let connectFour = new Game(7,6);

 