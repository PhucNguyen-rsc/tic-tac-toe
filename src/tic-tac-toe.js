function repeat(initVal, length) {
    return Array(length).fill(initVal);
}    

function generateBoard(rows, cols, initialValue) {
    const blankValue = initialValue || " ";
    return repeat(blankValue, rows * cols);
}

function boardFromString(s){
    const arr = s.split('');
    let flag = true;
    const checkLength = Math.sqrt(arr.length);
    if (Number.isInteger(checkLength) && checkLength > 0){
        for (const char of arr) {
            if ((char !== "X") && (char !== "O") && (char !== " ") ) {
                flag = false;
                break;
            }
          }
    }
    else{
        flag = false;
    }
    if (flag) {
        return arr;
    }
    else{
        return null;
    }
}

function rowColToIndex(board, row, col){
    const rowLength = Math.sqrt(board.length);
    return rowLength * row + col;
}

function indexToRowCol(board, i){
    const rowLength = Math.sqrt(board.length);
    const row = Math.floor(i / rowLength);
    const col = i % rowLength;
    return {row, col};
}

function setBoardCell(board, letter, row, col){
    const rowLength = Math.sqrt(board.length);
    const idx = rowLength * row + col;
    const newBoard = [...board];
    newBoard[idx] = letter;
    return newBoard;

}

function algebraicToRowCol(algebraicNotation){
    const placementArr = algebraicNotation.split("");
    let flag = true;
    const rowChar = placementArr[0].toUpperCase();;
    const colChar = placementArr.slice(1, placementArr.length);
    
    let row;
    // let col;
    
    for (let i = 0; i < colChar.length; i++){
        if (isNaN(parseInt(colChar[i]))){
            flag = false;
        }
    }
    
    const col = parseInt(colChar.join("")) - 1;
    
    if ((isNaN(col)) || (col === null) || (col === undefined)){
        flag = false;
    }  
    
    if (/^[A-Z]$/.test(rowChar)){
        row = rowChar.charCodeAt(0) - 'A'.charCodeAt(0);
    }
    else{
        flag = false;
    }
    
    if (flag){
        return {row, col};
    }
    else{
        return undefined;
    }
}

function arraysEqual(arr1, arr2){
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
          return false;
        }
      }
    
      return true;
}

function placeLetter(board, letter, algebraicNotation){
    const rowCol = algebraicToRowCol(algebraicNotation);
    const newBoard = setBoardCell(board, letter, rowCol.row, rowCol.col);
    return newBoard;
}

function getWinner(board){
    let xFlag = false;
    let oFlag = false;

    const rowLength = Math.sqrt(board.length);

    const xPatterns = new Array(rowLength).fill("X");
    const oPatterns = new Array(rowLength).fill("O");

    // pattern checking
    for (let i = 0; i < rowLength; i++){
        const horizontalPattern = board.slice(rowLength*i, rowLength*(i+1));
        const verticalPattern = board.filter((_, index) => index % rowLength === i);

        if (arraysEqual(xPatterns, horizontalPattern) || arraysEqual(xPatterns, verticalPattern)){
            xFlag = true;
            break;
        }
        else if (arraysEqual(oPatterns, horizontalPattern) || arraysEqual(oPatterns, verticalPattern)){
            oFlag = true;
            break;  
        }
    }

    if (!xFlag && !oFlag){
        const rightDiagonal = board.filter((_, index) => index % (rowLength+1) === 0);
        const leftDiagnonal = board.filter((_, index) => (index % (rowLength-1) === 0) && (index!==0));
        if (arraysEqual(xPatterns, rightDiagonal) || arraysEqual(xPatterns, leftDiagnonal)){
            xFlag = true;
        }
        else if (arraysEqual(oPatterns, rightDiagonal) || arraysEqual(oPatterns, leftDiagnonal)){
            oFlag = true;
        }
    }

    if (xFlag){
        return "X";
    }
    else if (oFlag){
        return "O";
    }
    else{
        return undefined;
    }
}


function boardToString(board){
    let visualizeBoard = "  ";
    const rowLength = Math.sqrt(board.length);
    const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 65));
    
    // row_number init at the top
    for (let i = 0; i < rowLength; i++){ 
        visualizeBoard+="   ";
        visualizeBoard+=(i+1);
    }
    // first row barrier init at the top
    visualizeBoard+="  \n   ";
    for (let i = 0; i < rowLength; i++){ 
        visualizeBoard+="+---";
    }
    for (let rowIdx = 0; rowIdx < rowLength; rowIdx++){ // row-wise for whole board
        visualizeBoard+="+\n ";
        visualizeBoard+=letters[rowIdx];
        visualizeBoard+=" ";
        for (let colIdx = 0; colIdx < rowLength; colIdx++){ // col-wise for each row
            if (board[rowIdx*rowLength + colIdx] === "X"){
                visualizeBoard+="| X ";
            }
            else if (board[rowIdx*rowLength + colIdx] === "O"){
                visualizeBoard+="| O ";
            }
            else{
                visualizeBoard+="|   ";
            }
        }

        visualizeBoard+="|\n   ";
        for (let i = 0; i < rowLength; i++){ 
            visualizeBoard+="+---";
        }
    //
    }
    visualizeBoard+="+\n";
    
    return visualizeBoard;
}

function isBoardFull(board){
    for (const element of board){
        if (element === " "){
            return false;
        }
    }
    return true;
}

function isValidMove(board, algebraicNotation){
    const coor = algebraicToRowCol(algebraicNotation);
    const rowLength = Math.sqrt(board.length);
    if (coor === undefined){
        return false;
    }
    else {
        if (coor.row >= rowLength || coor.col >= rowLength){
            return false;
        }
        const idx = rowColToIndex(board, coor.row, coor.col);
        if (board[idx] !== " "){
            return false;
        }

        return true;
    }
}

export {generateBoard, 
        boardFromString,
        rowColToIndex,
        indexToRowCol,
        setBoardCell,
        algebraicToRowCol,
        placeLetter,
        boardToString,
        isBoardFull,
        isValidMove,
        getWinner};