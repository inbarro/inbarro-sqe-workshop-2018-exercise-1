import * as esprima from 'esprima';

var numOfLine=1;
var table=[];
// var isContinued=false;

const parseCode = (codeToParse) => {
    numOfLine=1;
    table=[];
    return esprima.parseScript(codeToParse);
};

export {parseCode};

function parsedCodeToTable (parsedCode){

    switch (parsedCode.type) {
    case ('Program'):
        parseProgram(parsedCode);
        return table;
    case ('FunctionDeclaration'):
        parseFunctionDeclaration(parsedCode);
        break;
    case ('BlockStatement'):
        parseBlockStatement(parsedCode.body);
        break;
    default:
        return switchCaseContinue1(parsedCode);
    }
}

export {parsedCodeToTable};

function switchCaseContinue1(parsedCode) {
    switch (parsedCode.type) {
    case ('VariableDeclaration'):
        parseVariableDeclaration(parsedCode.declarations);
        break;
    case ('ExpressionStatement'):
        return parseExpressionStatement(parsedCode);
        //break;
    case ('AssignmentExpression'):
        parseAssignmentExpression(parsedCode);
        break;
    default:
        return switchCaseContinue2(parsedCode);
    }
}

function switchCaseContinue2 (parsedCode) {
    switch (parsedCode.type) {
    case ('BinaryExpression'):
        return parseBinaryExpression(parsedCode);
    case ('Identifier'):
        return parseIdentifier(parsedCode);
    case ('Literal'):
        return parseLiteral(parsedCode);
    case ('WhileStatement'):
        parseWhileStatement(parsedCode);
        break;
    default:
        return switchCaseContinue3(parsedCode);
    }
}

function switchCaseContinue3 (parsedCode) {
    switch (parsedCode.type) {
    case ('IfStatement'):
        parseIfStatement(parsedCode,0);
        break;
    case ('MemberExpression'):
        return parseMemberExpression(parsedCode);
    case ('UnaryExpression'):
        return parseUnaryExpression(parsedCode);
    case ('ReturnStatement'):
        parseReturnStatement(parsedCode);
        break;
    }
}

function parseProgram(parsedCode)
{
    parsedCodeToTable(parsedCode.body[0]);
}

function parseFunctionDeclaration(parsedCode) {
    table.push({Line:numOfLine, Type:'function declaration', Name: parsedCode.id.name, Condition:'', Value:''});
    parseFunctionVariableDeclaration(parsedCode.params);
    parsedCodeToTable(parsedCode.body);
}

function parseFunctionVariableDeclaration(parsedCode) {
    if (typeof parsedCode !== 'undefined' && parsedCode.length > 0) {
        let i;
        for (i = 0; i < parsedCode.length; i++) {
            table.push({
                Line: numOfLine,
                Type: 'variable declaration',
                Name: parsedCode[i].name,
                Condition: '',
                Value: ''
            });
        }
        numOfLine++;
    }
}

function parseBlockStatement(parsedCode) {
    if (typeof parsedCode !== 'undefined' && parsedCode.length > 0) {
        let i;
        for (i = 0; i < parsedCode.length; i++) {
            parsedCodeToTable(parsedCode[i]);
        }
    }
}

function parseVariableDeclaration(parsedCode) {
    let i;
    for (i = 0; i < parsedCode.length; i++) {
        table.push({
            Line: numOfLine,
            Type: 'variable declaration',
            Name: parsedCode[i].id.name,
            Condition: '',
            Value: 'null'
        });
    }
    numOfLine++;
}

function parseExpressionStatement (parsedCode){

    return parsedCodeToTable(parsedCode.expression);
}

function parseIdentifier(parsedCode){
    return parsedCode.name;
}

function parseLiteral(parsedCode){
    return parsedCode.value;
}

function parseBinaryExpression(parsedCode){
    let left = parsedCodeToTable(parsedCode.left);
    let operator = parsedCode.operator;
    let right = parsedCodeToTable(parsedCode.right);
    return left + operator + right;
}

function parseAssignmentExpression (parsedCode){
    let le = parsedCodeToTable(parsedCode.left);
    let ri = parsedCodeToTable(parsedCode.right);
    table.push({
        Line: numOfLine,
        Type: 'assignment expression',
        Name: le,
        Condition: '',
        Value: ri
    });
    numOfLine++;
}

function parseWhileStatement (parsedCode){
    let left = parsedCodeToTable(parsedCode.test.left);
    let right = parsedCodeToTable(parsedCode.test.right);
    let operator = parsedCode.test.operator;
    table.push({
        Line: numOfLine,
        Type: 'while statement',
        Name: '',
        Condition: left+operator+right,
        Value: ''
    });
    numOfLine++;
    parsedCodeToTable(parsedCode.body);
}

function parseMemberExpression (parsedCode){
    let left=parsedCodeToTable(parsedCode.object);
    let right =parsedCodeToTable(parsedCode.property);
    return left+ '[' + right +']';
}

function parseIfStatement(parsedCode,isElseIf) {
    let type;
    let left =parsedCodeToTable(parsedCode.test.left);
    let right = parsedCodeToTable(parsedCode.test.right);
    let op = parsedCode.test.operator;
    if (isElseIf === 0) {type = 'if statement';}
    else {type = 'else if statement';}
    table.push({Line: numOfLine, Type: type, Name:'', Condition: left+op+right, Value:''});
    numOfLine++;
    parsedCodeToTable(parsedCode.consequent);
    if ( parsedCode.alternate !== null) {
        if (parsedCode.alternate.type === 'IfStatement') {
            parseIfStatement(parsedCode.alternate, 1);}
        else { parseElseStatement(parsedCode.alternate);}}}


function parseElseStatement(parsedCode) {
    table.push({
        Line: numOfLine, Type: 'else statement',
        Name: '', Condition: '', Value: ''
    });
    numOfLine++;
    parsedCodeToTable(parsedCode);

}

function parseReturnStatement (parsedCode) {
    let arg = parsedCodeToTable(parsedCode.argument);
    table.push({
        Line: numOfLine,
        Type: 'return statement',
        Name: '',
        Condition:'',
        Value: arg
    });
    numOfLine++;
}

function parseUnaryExpression (parsedCode){
    let argument = parsedCodeToTable(parsedCode.argument);
    let operator = parsedCode.operator;
    return operator+argument;
}