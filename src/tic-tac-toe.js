function repeat(initVal, length) {
    return Array(length).fill(initVal);
}    

function generateBoard(rows, cols, initialValue) {
    const blankValue = initialValue || " ";
    return repeat(blankValue, rows * cols);
}

function boardFromString(s){
    const arr = s.split('')
    let flag = true;
    let check_length = Math.sqrt(arr.length);
    if (Number.isInteger(check_length) && check_length > 0){
        for (const char of arr) {
            if ((char != "X") && (char != "O") && (char != " ") ) {
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
    const row_length = Math.sqrt(board.length);
    return row_length * row + col;
}

function indexToRowCol(board, i){
    const row_length = Math.sqrt(board.length);
    const row = Math.floor(i / row_length);
    const col =  i % row_length;
    return {row, col};
}

function setBoardCell(board, letter, row, col){
    const row_length = Math.sqrt(board.length);
    const idx = row_length * row + col;
    const new_board = [...board];
    new_board[idx] = letter;
    return new_board;

}

function algebraicToRowCol(algebraicNotation){
    const placement_arr = algebraicNotation.split("");
    let flag = true;
    const row_char = placement_arr[0].toUpperCase();;
    const col_char = placement_arr.slice(1, placement_arr.length);
    
    let row;
    let col;
    
    for (let i = 0; i < col_char.length; i++){
        if (isNaN(parseInt(col_char[i]))){
            flag = false;
        }
    }
    
    col = parseInt(col_char.join("")) - 1;
    
    if ((isNaN(col)) || (col === null) || (col === undefined)){
        flag = false;
    }  
    
    if (/^[A-Z]$/.test(row_char)){
        row = row_char.charCodeAt(0) - 'A'.charCodeAt(0);
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

function arrays_equal(arr1, arr2){
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
          return false;
        }
      }
    
      return true;
}

function placeLetter(board, letter, algebraicNotation){
    const row_col = algebraicToRowCol(algebraicNotation);
    const new_board = setBoardCell(board, letter,  row_col.row, row_col.col);
    return new_board;
}

function getWinner(board){
    let x_flag = false;
    let o_flag = false;

    const row_length = Math.sqrt(board.length);

    const x_patterns = new Array(row_length).fill("X");
    const o_patterns = new Array(row_length).fill("O");

    // pattern checking
    for (let i = 0; i < row_length; i++){
        let horizontal_pattern = board.slice(row_length*i, row_length*(i+1));
        let vertical_pattern = board.filter((_, index) => index % row_length === i);

        if (arrays_equal(x_patterns, horizontal_pattern) || arrays_equal(x_patterns, vertical_pattern)){
            x_flag = true;
            break;
        }
        else if (arrays_equal(o_patterns, horizontal_pattern) || arrays_equal(o_patterns, vertical_pattern)){
            o_flag = true;
            break;  
        }
    }

    if (!x_flag && !o_flag){
        let right_diagonal = board.filter((_, index) => index % (row_length+1) === 0);
        let left_diagnonal = board.filter((_, index) => (index % (row_length-1) === 0) && (index!=0));
        if (arrays_equal(x_patterns, right_diagonal) || arrays_equal(x_patterns, left_diagnonal)){
            x_flag = true;
        }
        else if (arrays_equal(o_patterns, right_diagonal) || arrays_equal(o_patterns, left_diagnonal)){
            o_flag = true;
        }
    }

    // console("X flag: ", x_flag);
    // console("O flag: ", o_flag);

    if (x_flag){
        return "X";
    }
    else if (o_flag){
        return "O";
    }
    else{
        return undefined;
    }
}


function boardToString(board){
    let visualize_board = "  ";
    const row_length = Math.sqrt(board.length);
    const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 65));
    
    // row_number init at the top
    for (let i = 0; i < row_length; i++){ 
        visualize_board+="   ";
        visualize_board+=(i+1);
    }
    // first row barrier init at the top
    visualize_board+="  \n   ";
    for (let i = 0; i < row_length; i++){ 
        visualize_board+="+---";
    }
    for (let row_idx = 0; row_idx < row_length; row_idx++){ // row-wise for whole board
        visualize_board+="+\n ";
        visualize_board+=letters[row_idx];
        visualize_board+=" ";
        for (let col_idx = 0; col_idx < row_length; col_idx++){ // col-wise for each row
            if (board[row_idx*row_length + col_idx] == "X"){
                visualize_board+="| X ";
            }
            else if (board[row_idx*row_length + col_idx] == "O"){
                visualize_board+="| O ";
            }
            else{
                visualize_board+="|   ";
            }
        }

        visualize_board+="|\n   ";
        for (let i = 0; i < row_length; i++){ 
            visualize_board+="+---";
        }
    //
    }
    visualize_board+="+\n";
    
    return visualize_board;
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
    const row_length = Math.sqrt(board.length);
    if (coor === undefined){
        return false;
    }
    else {
        if (coor.row >= row_length || coor.col >= row_length){
            return false;
        }
        const idx =  rowColToIndex(board, coor.row, coor.col);
        if (board[idx] != " "){
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