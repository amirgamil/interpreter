

const INTEGER = "INT";
const PLUS = "PLUS";
const MINUS = "MINUS";
const MULT = "MULT";
const DIVIDE = "DIVIDE";
const EOF = "EOF";
const SPACE = " ";
const LPAREN = "(";
const RPAREN = ")";


/////////////////////////////////
//                             //
//  LEXER                      //
//                             //
/////////////////////////////////

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


/////////////////////////////////
//                             //
//  Parser                     //
//                             //
/////////////////////////////////

class AST {
  constructor() {
    
  }
}
//Node to represent a binary operation (i.e. on two values)
class BinOp extends AST {
  constructor(left, op, right) {
    super();
    this.left = left;
    this.token = this.op = op;
    this.right = right;
  }
}

class Num extends AST {
  constructor(token) {
    this.token = token;
    this.value = token.value;
  }
}

class Parser {
  constructor(lexer) {
    this.lexer = lexer;
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
    //Return node:
    //factor: INTEGER | LPAREN getExp RPAREN
    const curr = this.currentToken;
    if (curr.type == INTEGER) {
      this.eat(INTEGER);
      return curr;  
    } else {
      this.eat(LPAREN);
      const res = this.getExp();
      this.eat(RPAREN);
      return res;
    }
  }

  term = () => {
    //term: factor((MULT | DIV) factor)*
    var node = this.factor().value;
    var op;
    while (this.currentToken.type == DIVIDE || this.currentToken.type == MULT) {
      const curr = this.currentToken;
      if (curr.type == MULT) {
        op = this.currentToken;
        this.eat(MULT);
      } else if (curr.type == DIVIDE) {
        op = this.currentToken
        this.eat(DIVIDE);
      }

      node = new BinOp(node, op.type, this.factor());
    }
    return node;
  }

  getExp = () => {
    //Get the result of the expression inputted it and return it - Interpreter or Parser
    //Arithmetic expression expr
    //expr: term((ADD | SUBTRACT) term)*
    var node = this.term();
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
      //recursively builds tree structure so node is new root
      node = new BinOp(node, op.type, this.term());
    }
    return node;
  }

  parse = () => {
    return this.getExp();
  }
}


/////////////////////////////////
//                             //
//  Interpreter                //
//                             //
/////////////////////////////////
//Interpreted expression corresponds to post-order traveral
//of the AST
class NodeVisitor {
  visit = (node) => {
    const methodName = "visit" + typeof(node).name;
    const visitor = new Proxy(this.methodName, () => {
      this.genericVisit;
    });
  }

  genericVisit = (node) => {
    throw Exception("No visit" + node.name + " method");
  }
}

class Interpreter extends NodeVisitor {
  constructor(parser) {
    super();
    this.parser = parser;
  }

  visitBinOp = (node) => {
    if (node.op.type == PLUS) {
      return this.visit(node.left) + this.visit(node.right);
    } else if (node.op.type == MINUS) {
      return this.visit(node.left) - this.visit(node.right);
    } else if (node.op.type == MUL) {
      return this.visit(node.left) * this.visit(node.right);
    } else if (node.op.type == DIV) {
      return this.visit(node.left) / this.visit(node.right);
    }
  }

  visitNum = (node) => {
    return node.value;
  }

  interpret = () => {
    const tree = this.parser.parse();
    return this.visit(tree);
  }
}





if (require.main == module) {
  while (true) {
    const prompt = require('prompt-sync')();
    const text = prompt('spi > ');
    const lexer = new Lexer(text)
    const parser = new Parser(lexer);
    const interpreter = new Interpreter(parser);
    const result = interpreter.interpret();
    console.log(result);
  }
}