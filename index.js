

const INTEGER = "INT";
const PLUS = "PLUS";
const MINUS = "MINUS";
const MULT = "MULT";
const DIVIDE = "DIVIDE";
const EOF = "EOF";
const SPACE = " ";

class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}


const mathItUp = (num1, num2, op) => {
  if (op == PLUS) {
    return num1 + num2;
  } else if (op == MINUS) {
    return num1 - num2;
  } else if (op == MULT) {
    return num1 * num2;
  } else if (op == DIVIDE) {
    return num1 / num2;
  }
}

class Interpreter {
  constructor(text) {
    this.pos = 0;
    this.text = text;
    this.currentCharacter = this.text.charAt(this.pos);
    this.currentToken = null;
  }


  error = () => {
      throw "my dude, uh oh";
  }

  getInteger = () => {
    //Return a multidigit or single digit integer
    var currInt = "";
    while (this.currentCharacter != null && !Number.isNaN(parseInt(this.currentCharacter))) {
      currInt += this.currentCharacter;
      this.advance();
    }
    return parseInt(currInt);
  }

  getNextToken = () => {
    // Get the next token in the line of code

    const text = this.text;

    while (this.currentCharacter) {
      if (this.currentCharacter == " ") {
        this.advance();
        continue;
      } else if (this.currentCharacter == "+") {
        this.advance();
        return new Token(PLUS, "+");
      } else if (this.currentCharacter == "-") {
        this.advance();
        return new Token(MINUS, "-");
      } else if (this.currentCharacter == "*") {
        this.advance();
        return new Token(MULT, "*");
      } else if (this.currentCharacter == "/") {
        this.advance();
        return new Token(DIVIDE, "/");
      } else if (parseInt(this.currentCharacter) != null) {
        return new Token(INTEGER, this.getInteger());
      }
      console.log(this.currentCharacter);
      this.error();
    }

    return new Token(EOF, "end")
  }

  advance = () => {
    //Advance the current index in the line of code we're parsing
    this.pos += 1;
    if (this.pos >= this.text.length) {
      this.currentCharacter = null
    } else {
      this.currentCharacter = this.text.charAt(this.pos);
    }
  }

  eat = (tokenType) => {
    //"Eat" the last token and move to the next token
    if (this.currentToken.type == tokenType) {
      this.currentToken = this.getNextToken();
    } else {
      this.error();
    }
  }

  getExp = () => {
    //Get the result of the expression inputted it and return it - Interpreter or Parser
    //Parse = recognize what the phrase is (i.e. + or -), interpret = actually evaluate the expression
    // Interpreter accepts
    // INTEGER + INTEGER
    // INTEGER - INTEGER
    // INTEGER * INTEGER
    // INTEGER / INTEGER
    this.currentToken = this.getNextToken();
    var res;
    let left = this.currentToken;
    this.eat(INTEGER);
    var op;
    while (this.currentToken.type != EOF) {
      const curr = this.currentToken;
      if (curr.type == PLUS) {
        op = this.currentToken;
        this.eat(PLUS);
      } else if (curr.type == MINUS) {
        op = this.currentToken;
        this.eat(MINUS);
      } else if (curr.type == MULT) {
        op = this.currentToken;
        this.eat(MULT);
      } else if (curr.type == DIVIDE) {
        op = this.currentToken;
        this.eat(DIVIDE);
      } else {
        this.eat(INTEGER);
        res = mathItUp(left.value, curr.value, op.type);
        left = new Token(INTEGER, res);
        continue;
      }
    }

    
    
    return res;
  }
}


if (require.main == module) {
  while (true) {
    const prompt = require('prompt-sync')();
    const code = prompt('calc > ');
    var interp = new Interpreter(code);
    console.log(interp.getExp());
  }
}