const currentOperation = document.getElementsByClassName( "calculator__text--bottom" )[0];
const history          = document.getElementsByClassName( "calculator__text--top" )[0]; 
const numberButtons    = document.getElementsByClassName( "calculator__button--number" );
const operatorButtons  = document.getElementsByClassName( "calculator__button--operator" );
const equalButton      = document.getElementsByClassName( "calculator__button--equal" )[0];
const clearButton      = document.getElementsByClassName( "calculator__button--clear" )[0]; 
const decimalPoint     = document.getElementsByClassName( "calculator__button--dot" )[0];
const undoButton       = document.getElementsByClassName( "calculator__button--undo" )[0];

const booleans = {
  numberEntered : false,
  errorMessage : false,
  remainder: false,
};

let operands        = '';
let operations      = [];
let displayValue    = '';

const mathOperations = { 
  add( a, b ) {
    let result = Number( a ) + Number( b );

    return parseFloat( result.toFixed( 5 ) );
  },
  
  subtract( a, b ) {
    let result =  Number( a ) - Number( b );

    return parseFloat( result.toFixed( 5 ) );
  },

  multiply( a, b ) {
    let result =  Number( a ) * Number( b );

    return parseFloat( result.toFixed( 5 ) );
  },

  divide( a, b ) {
    if ( parseInt( b ) === 0 ) {
      booleans.errorMessage = true;
      errorText = "nope";
      return handleError( errorText );
    }
    let result = ( a ) / ( b );

    return parseFloat( result.toFixed( 5 ) );
  },
};

const operate = ( operator, a, b ) => {
  return mathOperations[operator]( a, b );   
}; 

const handleError = text => {
  displayValue = '';
  currentOperation.textContent = text;
};

const displayNumber = event => {
  let text = '';

  if ( event.type === "keyup" ) {
    text = event.key;
  } else {
    text = event.target.textContent; 
  }

  booleans.numberEntered = true;

  if ( booleans.remainder ) {
    booleans.remainder = false;
    operands  = '';
    displayValue = '';
    currentOperation.textContent = displayValue;
    history.textContent = '';
  }

  operands += text;

  displayValue += text;
  currentOperation.textContent = operands;
  history.textContent = displayValue;
};

const registerOperator = event => {
  if ( ! booleans.numberEntered ) {
    return;
  } 

  // means that if the user enters an operator after he has aleady received a result, the result will stay and become the first operand.
  // On the contrary, if the user enters another digit, we discard the previous result and start fresh
  booleans.remainder = false;  

  let operator = '';
  let text     = '';

  if ( event.type === "keyup" ) {
    switch ( event.key ) {
      case "+":
        operator = "add";
        text     = "+";
        break;
      case "-":
        operator = "subtract";
        text     = "-";
        break;
      case "*":
        operator = "multiply";
        text     = "\u00D7"; 
        break;
      case "/":
        operator = "divide";
        text     = "\u00F7";
        break;
    }
  } else {
    operator = event.target.value;
    text     = event.target.textContent;
  }
  
  displayValue += text;
  currentOperation.textContent = text;
  history.textContent = displayValue;

  if ( operands ) {
    operations.push( operands );
  }

  operations.push( operator ); 
  operands = '';
  booleans.numberEntered = false;
};

const addDecimal = event => {

  // There must be a digit already to add a decimal
  if ( ! operands ) {
    return;
  }

  let decimalSymbol = '';

  if ( event.type === "keyup" ) {
    decimalSymbol = event.key;
  } else {
    decimalSymbol = event.target.textContent;
  }

  // Only one decimal point per operand is allowed
  if ( operands.match( /\./g ) ) {
    return;
  }

  operands += decimalSymbol;
  displayValue += decimalSymbol;
  currentOperation.textContent = operands;
  history.textContent = displayValue;
};

const performCalculation = event => {
  if ( operands !== '' ) {
    operations.push( operands ); 
  }
  
  // Check if the person clicked "=" before submitting a full calculation => will return if the last operation is an operator i.e : "3 +"
  if ( isNaN( parseInt( operations[ operations.length - 1 ] ) ) ) {
    return;
  }

  while ( operations.includes( "multiply" ) || operations.includes( "divide" ) ) {
    operations = parseOperations( operations, "multiply", "divide" );
  }
  
  while ( operations.includes( "add" ) || operations.includes( "subtract" ) ) {
    operations = parseOperations( operations, "add", "subtract" );
  }
  
  if ( booleans.errorMessage ) {
    clearAll( null, false );
    return;   
  }

  displayValue = operations;
  currentOperation.textContent = displayValue;
  operands = operations[0].toString( 10 );
  booleans.remainder = true;
  operations = [];
};   

const parseOperations = ( operations, firstOp, secondOp ) => {
  if ( booleans.errorMessage ) {
    return;
  }

  let operatorIndex = operations.findIndex( element => {
    return element === firstOp || element === secondOp;
  });

  if ( operatorIndex !== -1 ) {
    let newValue = operate( operations[ operatorIndex ], operations[ operatorIndex - 1 ], operations [ operatorIndex + 1 ] );
    operations.splice( operatorIndex - 1, 3, newValue);
  }

  return operations;
};

const clearAll = ( event, clearScreen = true ) => {
  if ( clearScreen ) {
    currentOperation.textContent = '';
    history.textContent = '';
  }

  displayValue = '';
  booleans.numberEntered = false;
  booleans.errorMessage  = false;
  operations    = [];
  operands      = '';
};

const removeDigit = event => {
  // If the last element of the operations array is an operator and operations is not empty, set boolean necessary to be able to enter another operator to false
  if ( ( ! parseFloat( operations[ operations.length -1 ] ) && operations.length !== 0 ) ) {
    booleans.numberEntered = false;
  }

  if ( displayValue === '' ) {
    clearAll();
  }

  if ( operands === '' ) {
    lastOperation = operations.pop();

    if ( parseFloat( lastOperation ) ) { // check if the last operation is an operand or an operator
      displayValue = displayValue.slice( 0, - lastOperation.length );

      let newOperand = lastOperation.slice( 0, -1 ); 
      displayValue += newOperand;
      currentOperation.textContent = displayValue;
      history.textContent = displayValue;
  
      if ( newOperand.length === 0 ) {
        return;
      }
      return operations.push( newOperand );
    }

  // If the last operation is not a float or int, it means it's an operator and we can safely remove the operator from the displayValue ( always length of 2 );
    displayValue = displayValue.slice( 0, -1 ); 
    currentOperation.textContent = displayValue;
    history.textContent = displayValue;
  }

  if ( operands ) {
    displayValue = displayValue.slice( 0, - operands.length  );
    operands = operands.slice( 0, -1 );
    displayValue += operands;
    currentOperation.textContent = displayValue;
    history.textContent = displayValue;
  }
};

const addKeySupport = event => {

  // Deal with number keys
  if ( ( event.keyCode >= 48 && event.keyCode <= 57 ) || ( event.keycode >= 96 && event.keyCode <= 105 ) ) {
    [ ...numberButtons ].forEach( button => {
      if ( button.textContent === event.key ) {
        displayNumber( event );
      }
    });
  } 
  
  if ( event.key === "+"  || event.key === "*" || event.key === "/" || event.key === "-" ) {
    return registerOperator ( event );
  }
  
  switch ( event.key ) {
    case ".":
      return addDecimal( event );
    case "=":
      return performCalculation( event );
    case "Enter":
      return performCalculation( event );
    case "Delete":
      return clearAll( event );
    case "Backspace":
      return removeDigit( event );
  }
};


// Register event listeners
[ ...numberButtons ].forEach( number => {
  number.addEventListener( "click", displayNumber );
});

[ ...operatorButtons ].forEach( operator => {
  operator.addEventListener( "click", registerOperator );
});

equalButton.addEventListener( "click", performCalculation );

clearButton.addEventListener( "click", clearAll );

decimalPoint.addEventListener( "click", addDecimal );

undoButton.addEventListener( "click", removeDigit );

document.addEventListener( "keyup", addKeySupport ); 
