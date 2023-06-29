function GameBoard () {
    const board = Array(9).fill("");
    
    const updateBoard = (index, token) => {
        board[index] = token;
    }

    const getBoard = () => board;

    return {getBoard, updateBoard}
}

function GameController() {
    const board = GameBoard();
    const currentBoard = board.getBoard();

    const players = [
        {name: "Player One", token: 1},
        {name: "Player Two", token: 2}
    ]

    let activePlayer = players[0];
    let winner = 0;

    const switchTurn = () => {
        activePlayer === players[0] ? activePlayer = players[1] : activePlayer = players[0];
    }

    const checkWin = () => {
        const winConditions = [ [0,1,2],[3,4,5],[6,7,8],
                                [0,3,6],[1,4,7],[2,5,8],
                                [0,4,8],[2,4,6]]
        winConditions.forEach(condition => {
            if( currentBoard[condition[0]] === currentBoard[condition[1]] &&
                currentBoard[condition[1]] === currentBoard[condition[2]] &&
                currentBoard[condition[0]] === activePlayer.token &&
                currentBoard[condition[1]] === activePlayer.token &&
                currentBoard[condition[2]] === activePlayer.token) {
                    winner = activePlayer.name;
                }
        });
    }

    let moveNumber = 0;
    const makeMove = (index) => {
        if(currentBoard[index] === "" && winner === 0) {
            //update board
            board.updateBoard(index, activePlayer.token);
            moveNumber = moveNumber + 1;
            //check win
            checkWin()
            //switch turn
            switchTurn();
        }
        return currentBoard;
    }

    const getActivePlayer = () => activePlayer;

    const getWinner = () => winner;

    const getMoveNumber = () => moveNumber;

    return {getActivePlayer, switchTurn, makeMove, getWinner, getMoveNumber}
}

function screenController() {
    const game = GameController();
    const board = GameBoard();
    const currentBoard = board.getBoard();
    const body = document.querySelector("body");
    const boardDiv = document.querySelector(".container");

    const clearBoardDiv = () => {
        while (boardDiv.firstChild) {
            boardDiv.removeChild(boardDiv.lastChild);
        }
    }

    const updateScreen = (newBoard) => {
        for(let i = 0; i < newBoard.length; i++) {
            const cellDiv = document.createElement('div');
            cellDiv.id = i;
            if(newBoard[i] === 1) {
                cellDiv.textContent = "O";
            }
            if(newBoard[i] === 2) {
                cellDiv.textContent = "X";
            }
            cellDiv.addEventListener('click', function() {
                newBoard = game.makeMove(i);

                clearBoardDiv();
                updateScreen(newBoard);
                makeAnnouncement();
            })
            boardDiv.appendChild(cellDiv);
        }
    }

    const makeAnnouncement = () => {
        const announcementTxt = document.createElement('h1');
        const winner = game.getWinner();
        const moveNumber = game.getMoveNumber();
        if(winner !== 0) {
            announcementTxt.textContent = winner + " won!";
        }
        if(moveNumber === 9) {
            announcementTxt.textContent = "Draw!";
        }
        body.appendChild(announcementTxt);
    }

    //initial render
    updateScreen(currentBoard);
}

screenController();