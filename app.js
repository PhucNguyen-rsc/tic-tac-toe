// app.js
import * as tic from './src/tic-tac-toe.js';
import { question } from 'readline-sync';
import { readFile } from 'node:fs';

let boardInfo;
let displayString;

function getUserMove(board) {
    let playerMoveStr;
    while (true) {
      playerMoveStr = question("What's your move? \n");
      if (tic.isValidMove(board, playerMoveStr)) {
        console.log(`You chose: ${playerMoveStr}`);
        const newBoard = tic.placeLetter(board, "X", playerMoveStr);
        return newBoard;
      } else {
        console.log("Your move must be in a format, and it must specify an existing empty cell!");
      }
    }
}

function getComputerMove(board, computerMoves){
    question('Press <ENTER> to show computer\'s move...');
    let useDefault = false;
    let defaultMove;

    for (let i = 0; i<computerMoves.length; i++){
        if (tic.isValidMove(board, computerMoves[i])){
            useDefault = true;
            defaultMove = computerMoves[i];
            break;
        }
    }

    if (useDefault){
        const newBoard = tic.placeLetter(board, "O", defaultMove);
        return newBoard;
    } 
    else {
        const indexes = [];
        board.forEach((cell, index) => {
        if (cell === " ") {
            indexes.push(index);
        }
        });

        const chosenIndex = indexes[Math.floor(Math.random() * indexes.length)];
        const {row, col} = tic.indexToRowCol(board, chosenIndex);
        const newBoard = tic.setBoardCell(board, "O", row, col);
        return newBoard;
    }
}

if (process.argv.length < 3){
    let board = tic.boardFromString('         ');
    console.log("Player is X, Computer is O\n");
    console.log(tic.boardToString(board));

    while (true){
        board = getUserMove(board);
        console.log(tic.boardToString(board));
        if (tic.getWinner(board)!== undefined){
            console.log("You win! \n");
            break;
        }

        board = getComputerMove(board, ["A1"]);
        console.log(tic.boardToString(board));
        if (tic.getWinner(board)!== undefined){
            console.log("Computer wins! \n");
            break;
        }

        if (tic.isBoardFull(board)){
            console.log("It's a draw! \n");
            break;
        }

    }
    
}
else {
    readFile(process.argv[2], 'utf8', (err, data) => {
        if (err) {throw err;};

        boardInfo = JSON.parse(data);
        displayString = "\n";
        displayString += `Computers will make the following moves: [${boardInfo.computerMoves}]\n`;
        displayString += "Player is X, Computer is O\n";

        let board = tic.boardFromString(boardInfo.board);
        displayString += tic.boardToString(board);
        console.log(displayString);

        while (true){
            board = getUserMove(board);
            console.log(tic.boardToString(board));
            if (tic.getWinner(board)!== undefined){
                console.log("You win! \n");
                break;
            }

            board = getComputerMove(board, boardInfo.computerMoves);
            console.log(tic.boardToString(board));
            if (tic.getWinner(board)!== undefined){
                console.log("Computer wins! \n");
                break;
            }

            if (tic.isBoardFull(board)){
                console.log("It's a draw! \n");
                break;
            }

        }

    });
}

