import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {parsedCodeToTable} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
        );
    });
});

describe('function declaration', () => {
    let inputCode = 'function onlyDeclaration(){ }';
    let parsedCode = parseCode(inputCode);
    var table = parsedCodeToTable(parsedCode);
    it('function declaration appears', () => {
        assert.equal(table.length,1);
    });
    it('function declaration appears right', () => {
        assert.equal(JSON.stringify(table[0]),JSON.stringify({Line:1, Type:'function declaration', Name:'onlyDeclaration', Condition:'', Value:''}));
    });
});

describe('function declaration variables test', () => {
    let inputCode = 'function binarySearch(X,Y){}';
    let parsedCode = parseCode(inputCode);
    var table = parsedCodeToTable(parsedCode);
    it('function variables declaration appears', () => {
        assert.equal(table.length,3);
    });
    it('function declaration variables appears right 1', () => {
        assert.equal(JSON.stringify(table[1]),JSON.stringify({Line:1, Type:'variable declaration', Name:'X', Condition:'', Value:''}));
    });
    it('function declaration variables appears right 2', () => {
        assert.equal(JSON.stringify(table[2]),JSON.stringify({Line:1, Type:'variable declaration', Name:'Y', Condition:'', Value:''}));
    });
});

describe('variables declaration test', () => {
    let inputCode = 'function variablesFunc()' +
        '{let low, high};';
    let parsedCode = parseCode(inputCode);
    let table = parsedCodeToTable(parsedCode);
    it('variables declaration appears', () => {
        assert.equal(table.length,3);
    });
    it('variables appears right 1', () => {
        assert.equal(JSON.stringify(table[1]),JSON.stringify({Line:1, Type:'variable declaration', Name:'low', Condition:'', Value:'null'}));
    });
    it('function declaration variables appears right 2', () => {
        assert.equal(JSON.stringify(table[2]),JSON.stringify({Line:1, Type:'variable declaration', Name:'high', Condition:'', Value:'null'}));
    });
});

describe('variables declaration test', () => {
    let inputCode = 'function variablesFunc()' +
        '{let low, high}';
    let parsedCode = parseCode(inputCode);
    let table = parsedCodeToTable(parsedCode);
    it('variables declaration appears', () => {
        assert.equal(table.length,3);
    });
    it('variables test 1', () => {
        assert.equal(JSON.stringify(table[1]),JSON.stringify({Line:1, Type:'variable declaration', Name:'low', Condition:'', Value:'null'}));
    });
    it('variables test 2', () => {
        assert.equal(JSON.stringify(table[2]),JSON.stringify({Line:1, Type:'variable declaration', Name:'high', Condition:'', Value:'null'}));
    });
});

describe('assignment test', () => {
    let inputCode = 'function assignmentTest(n){let low; low=5; low=low+1; low=n; low=n/2;}';
    let parsedCode = parseCode(inputCode);
    let table = parsedCodeToTable(parsedCode);
    it('variables declaration appears', () => {
        assert.equal(table.length,7);});
    it('assignment test  1', () => {
        assert.equal(JSON.stringify(table[3]),JSON.stringify({Line:3, Type:'assignment expression', Name:'low', Condition:'', Value:5}));
    });
    it('assignment test  1', () => {
        assert.equal(JSON.stringify(table[4]),JSON.stringify({Line:4, Type:'assignment expression', Name:'low', Condition:'', Value:'low+1'}));
    });
    it('assignment test  3', () => {
        assert.equal(JSON.stringify(table[5]),JSON.stringify({Line:5, Type:'assignment expression', Name:'low', Condition:'', Value:'n'}));
    });
    it('assignment test  4', () => {
        assert.equal(JSON.stringify(table[6]),JSON.stringify({Line:6, Type:'assignment expression', Name:'low', Condition:'', Value:'n/2'}));
    });
});

describe('while test', () => {
    let inputCode = 'function whileTest(X, V, n){ let low, high, mid; low = 0; high = n - 1; while (low <= high) {low=low+2;}}';
    let parsedCode = parseCode(inputCode);
    let table = parsedCodeToTable(parsedCode);
    it('variables declaration appears', () => {
        assert.equal(table.length,11);
    });
    it('while test 1', () => {
        assert.equal(JSON.stringify(table[9]),JSON.stringify({Line:5, Type:'while statement', Name:'', Condition:'low<=high', Value:''}));
    });
    it('while test 2', () => {
        assert.equal(JSON.stringify(table[10]),JSON.stringify({Line:6, Type:'assignment expression', Name:'low', Condition:'', Value:'low+2'}));
    });
});


describe('simple if test',() => {
    let inputCode = 'function ifTest(X, V, n){let low, high, mid;low = 0;high = n - 1; if (X < V){low= low+1;}}' ;
    let parsedCode = parseCode(inputCode);
    let table = parsedCodeToTable(parsedCode);
    it('simple if without else test - number of lines test', () => {
        assert.equal(table.length,11);
    });
    it('simple if without else test - if line test', () => {
        assert.equal(JSON.stringify(table[9]),JSON.stringify({Line:5, Type:'if statement', Name:'', Condition:'X<V', Value:''}));
    });
    it('simple if without else test - block inside if statement test', () => {
        assert.equal(JSON.stringify(table[10]),JSON.stringify({Line:6, Type:'assignment expression', Name:'low', Condition:'', Value:'low+1'}));
    });
});

describe('nested if test',() => {
    let inputCode2 = 'function ifTest(X, V, n){let low, high, mid;low = 0;high = n - 1; if (X < V){if (X==1){ X=X+1;} else {X=X+2;}}}' ;
    let parsedCode2 = parseCode(inputCode2);
    let table2 = parsedCodeToTable(parsedCode2);

    it('nested if with else test - number of lines test', () => {
        assert.equal(table2.length,14);
    });
    it('nested if without else test - if line 1 test', () => {
        assert.equal(JSON.stringify(table2[9]),JSON.stringify({Line:5, Type:'if statement', Name:'', Condition:'X<V', Value:''}));
    });
    it('nested if without else test - if line 2 test', () => {
        assert.equal(JSON.stringify(table2[10]),JSON.stringify({Line:6, Type:'if statement', Name:'', Condition:'X==1', Value:''}));
    });
    it('nested if without else test - block inside if statement test', () => {
        assert.equal(JSON.stringify(table2[11]),JSON.stringify({Line:7, Type:'assignment expression', Name:'X', Condition:'', Value:'X+1'}));
    });
});

describe('if else test',() => {
    let inputCode3 = 'function ifTest(X, V, n){let low, high, mid;low = 0;high = n - 1; if (X < V){if (X==1){ X=X+1;} else{ X=X-1;}}}';
    let parsedCode3 = parseCode(inputCode3);
    let table3 = parsedCodeToTable(parsedCode3);

    it('if else test 1- number of lines test', () => {
        assert.equal(table3.length,14);
    });
    it('if else test - if line 1 test', () => {
        assert.equal(JSON.stringify(table3[9]),JSON.stringify({Line:5, Type:'if statement', Name:'', Condition:'X<V', Value:''}));
    });
    it('if else test - if line 2 test', () => {
        assert.equal(JSON.stringify(table3[10]),JSON.stringify({Line:6, Type:'if statement', Name:'', Condition:'X==1', Value:''}));
    });
    it('if else test - if else block inside if statement test', () => {
        assert.equal(JSON.stringify(table3[11]),JSON.stringify({Line:7, Type:'assignment expression', Name:'X', Condition:'', Value:'X+1'}));
    });
});

describe('if else test2',() => {
    let inputCode4 = 'function ifTest(X, V, n){let low, high, mid;low = 0;high = n - 1; if (X < V){if (X==1){ if (X==7) X=X+1; X=X+1;} else{ X=X-1;}}}';
    let parsedCode4 = parseCode(inputCode4);
    let table4 = parsedCodeToTable(parsedCode4);
    it('if else test 2 - number of lines test', () => {
        assert.equal(table4.length,16);
    });
    it('if else test 2 - nested if block inside if else statement test', () => {
        assert.equal(JSON.stringify(table4[11]),JSON.stringify({Line:7, Type:'if statement', Name:'', Condition:'X==7', Value:''}));
    });
    it('if else test 2 - nested if block inside if else statement assignment expression test', () => {
        assert.equal(JSON.stringify(table4[12]),JSON.stringify({Line:8, Type:'assignment expression', Name:'X', Condition:'', Value:'X+1'}));
    });
});

describe('else if test',() => {
    let inputCode5 = 'function ifTest(X, V, n){if (X < V) X=1; else if(X<1){if (X==7) X=X+1; else if (X>7) X=X-1;} else{X=X-1;}}';
    let parsedCode5 = parseCode(inputCode5);
    let table5 = parsedCodeToTable(parsedCode5);

    it('else if test 1', () => {
        assert.equal(table5.length,13);
    });
    it('else if test 2', () => {
        assert.equal(JSON.stringify(table5[6]),JSON.stringify({Line:4, Type:'else if statement', Name:'', Condition:'X<1', Value:''}));
    });
    it('else if test 3', () => {
        assert.equal(JSON.stringify(table5[9]),JSON.stringify({Line:7, Type:'else if statement', Name:'', Condition:'X>7', Value:''}));
    });
});


describe('return test',() => {
    let inputCode6 = 'function ifTest(X, V, n){if (X < V) return X; else if(X<1){if (X==7) return 4; else if (X>7) return 3-1;} else{return X+n;}}';
    let parsedCode6 = parseCode(inputCode6);
    let table6 = parsedCodeToTable(parsedCode6);

    it('return test - number of lines test', () => {
        assert.equal(table6.length,13);
    });
    it('first return test', () => {
        assert.equal(JSON.stringify(table6[5]),JSON.stringify({Line:3, Type:'return statement', Name:'', Condition:'', Value:'X'}));
    });
    it('second return test', () => {
        assert.equal(JSON.stringify(table6[8]),JSON.stringify({Line:6, Type:'return statement', Name:'', Condition:'', Value:4}));
    });
});

describe('unary test',() => {
    let inputCode6 = 'function ifTest(X, V, n){return -1;}';
    let parsedCode6 = parseCode(inputCode6);
    let table6 = parsedCodeToTable(parsedCode6);

    it('return test - number of lines test', () => {
        assert.equal(table6.length,5);
    });
});

describe('Member test',() => {
    let inputCode6 = 'function ifTest(X, V, n){return x[v];}';
    let parsedCode6 = parseCode(inputCode6);
    let table6 = parsedCodeToTable(parsedCode6);

    it('return test - number of lines test', () => {
        assert.equal(table6.length,5);
    });
});

describe('example of VariableDeclaration test',() => {
    let inputCode6 = 'function ifTest(){let ;}';
    let parsedCode6 = parseCode(inputCode6);
    let table6 = parsedCodeToTable(parsedCode6);

    it('return test - number of lines test', () => {
        assert.equal(table6.length,1);
    });
});

