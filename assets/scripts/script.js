const mathOperations = {
  add( a, b ) {
    return parseInt( a ) + parseInt( b );
  },
  
  subtract( a, b ) {
    return parseInt( a ) - parseInt( b );
  },

  multiply( a, b ) {
    return parseInt( a ) * parseInt( b );
  },

  divide ( a, b ) {
    return parseInt( a ) / parseInt( b );
  },
}

const operate = ( operator, a, b ) => {
  return mathOperations[operator]( a, b );   
}; 

const displayNumber = event => {
  const text = event.target.textContent; 
  numberEntered = true;
  operands += text;
  display.textContent += text;
};

const registerOperator = event => {
  if ( event.target.value === "equals" || ! numberEntered ) {
    return;
  } 
  
  const operator = event.target.value;

  display.textContent += ' ' + event.target.textContent + ' ';
  operations.push( operands, operator ); 
  operands = '';
  numberEntered = false;
}

const performCalculation = event => {
  operations.push( operands ); 

  while ( operations.includes( "multiply" ) || operations.includes( "divide" ) ) {
    operations = parseOperations( operations, "multiply", "divide" );
  }
  
  while ( operations.includes( "add" ) || operations.includes( "subtract" ) ) {
    operations = parseOperations( operations, "add", "subtract" );
  }
  
  display.textContent = operations;
  operands = operations[0];
  operations = [];
};   

const parseOperations = ( operations, firstOp, secondOp ) => {
  let operatorIndex = operations.findIndex( element => {
    return element === firstOp || element === secondOp;
  });

  if ( operatorIndex !== -1 ) {
    let newValue = operate( operations[ operatorIndex ], operations[ operatorIndex - 1 ], operations [ operatorIndex + 1 ] );
    operations.splice( operatorIndex - 1, 3, newValue);
  }
  return operations;
};

const clearAll = event => {
  numberEntered = false;
  operations    = [];
  operands      = '';

}

const display         = document.getElementsByClassName( "calculator__display__text" )[0];
const numberButtons   = document.getElementsByClassName( "calculator__button--number" );
const operatorButtons = document.getElementsByClassName( "calculator__button--operator" );
const equalButton     = document.getElementsByClassName( "calculator__button--equal" )[0];
const clearButton     = document.getElementsByClassName( "calculator__button--clear" )[0]; 

let operands        = '';
let operations      = [];
let numberEntered   = false;

// Register event listeners
[ ...numberButtons ].forEach( number => {
  number.addEventListener( "click", displayNumber );
});

[ ...operatorButtons ].forEach( operator => {
  operator.addEventListener( "click", registerOperator );
});

equalButton.addEventListener( "click", performCalculation );

clearButton.addEventListener( "click", clearAll );

