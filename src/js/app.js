import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {parsedCodeToTable} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let myTable = parsedCodeToTable(parsedCode);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        let tbl = $('<table/>').attr('Line', 'myTable');
        $('#div1').append(tbl);
        let tr = '<tr>';    let td1 = '<th>' + ['Line'] + '</th>';   let td2 = '<th>' + ['Type'] + '</th>';
        let td3 = '<th>' +['Name'] + '</th>';
        let td4 = '<th>' +['Condition'] + '</th>';
        let td5 = '<th>' + ['Value'] + '</th></tr>';
        $('#myTable').append(tr + td1 + td2 + td3 + td4 + td5);
        for (let i = 0; i < myTable.length; i++) {
            let tr = '<tr>'; let td1 = '<td>' + myTable[i]['Line'] + '</td>';   let td2 = '<td>' + myTable[i]['Type'] + '</td>';
            let td3 = '<td>' + myTable[i]['Name'] + '</td>';
            let td4 = '<td>' + myTable[i]['Condition'] + '</td>';
            let td5 = '<td>' + myTable[i]['Value'] + '</td></tr>';
            $('#myTable').append(tr + td1 + td2 + td3 + td4 + td5);
        }});});





