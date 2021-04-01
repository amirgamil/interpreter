

const INTEGER = "INT";
const PLUS = "PLUS";
const MINUS = "MINUS";
const MULT = "MULT";
const DIVIDE = "DIVIDE";
const EOF = "EOF";
const SPACE = " ";
const LPAREN = "(";
const RPAREN = ")";

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
    //Integer division
    return parseInt(num1 / num2);
  }
}


class Lexer {
  constructor(text) {
    this.pos = 0;
    this.text = text;
    this.currentCharacter = this.text.charAt(this.pos);
  }

  error = () => {
      throw "Invalid character my dude, common";
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

  advance = () => {
    //Advance the current index in the line of code we're parsing
    this.pos += 1;
    if (this.pos >= this.text.length) {
      this.currentCharacter = null
    } else {
      this.currentCharacter = this.text.charAt(this.pos);
    }
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
      } else if (!Number.isNaN(parseInt(this.currentCharacter))) {
        return new Token(INTEGER, this.getInteger());
      } else if (this.currentCharacter == "(") {
        this.advance();
        return new Token(LPAREN, "(");
      } else if (this.currentCharacter == ")") {
        this.advance();
        return new Token(RPAREN, ")");
      }
      console.log(this.currentCharacter);
      this.error();
    }

    return new Token(EOF, "end")
  }

}

class Interpreter {
  constructor(text) {
    this.lexer = new Lexer(text);
    this.currentToken = this.lexer.getNextToken();
  }


  error = () => {
      throw "Invalid syntax my dude, you're better than this!";
  }

  eat = (tokenType) => {
    //"Eat" the last token and move to the next token
    if (this.currentToken.type == tokenType) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      this.error();
    }
  }

  factor = () => {
    //Return token:
    //factor: INTEGER | LPAREN getExp RPAREN
    const curr = this.currentToken;
    if (curr.type == INTEGER) {
      this.eat(INTEGER);
      return curr;  
    } else {
      this.eat(LPAREN);
      const res = this.getExp();
      this.eat(RPAREN);
      return new Token(INTEGER, res);
    }
  }

  term = () => {
    //term: ((MULT | DIV) factor)*
    var left = this.factor().value;
    var res = left;
    var op;
    while (this.currentToken.type == DIVIDE || this.currentToken.type == MULT) {
      const curr = this.currentToken;
      if (curr.type == MULT) {
        op = this.currentToken;
        this.eat(MULT);
      } else if (curr.type == DIV) {
        op = this.currentToken
        this.eat(DIV);
      }

      res = mathItUp(left, this.factor().value, op.type)
      left = res;
    }
    return res;
  }

  getExp = () => {
    //Get the result of the expression inputted it and return it - Interpreter or Parser
    //Arithmetic expression expr
    //expr: term((ADD | SUBTRACT) term)*
    var res = this.term();
    var op;
    while (this.currentToken.type != EOF && this.currentToken.type != RPAREN) {
      const curr = this.currentToken;
      if (curr.type == PLUS) {
        op = this.currentToken;
        this.eat(PLUS);
      } else if (curr.type == MINUS) {
        op = this.currentToken;
        this.eat(MINUS);
      }
      res = mathItUp(res, this.term(), op.type);
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