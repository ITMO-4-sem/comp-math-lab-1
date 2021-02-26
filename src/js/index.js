"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Computer_1 = require("./Computer");
let matrix = [
    [2, 2, 10, 14],
    [10, 1, 1, 12],
    [2, 10, 1, 13],
];
let epsilon;
let computer = new Computer_1.Computer(matrix);
const form = document.getElementById("form");
const textArea = document.getElementById("textarea");
const filePicker = document.getElementById("filePicker");
const submitButton = document.getElementById("submit");
const messageInput = document.getElementById("message");
const radioButtons = document.getElementsByName("radio");
const resultArea = document.getElementById("result");
const epsilonInput = document.getElementById("epsilon");
if (textArea == null || filePicker == null || submitButton == null || messageInput == null)
    throw Error("some element is null");
form.addEventListener('input', event => {
    hideMessage();
});
filePicker.onchange = function (e) {
    let reader = new FileReader();
    if (filePicker.files.length != 0) {
        reader.readAsText(filePicker.files[0]);
        reader.onload = () => {
            textArea.value = reader.result;
        };
    }
};
function compute() {
    // computer.compute(epsilon);
    console.log(".....computing....");
    console.log("epsilon: ", epsilon);
    console.log("Matrix is", matrix);
    let result = "";
    try {
        computer.setMatrix(matrix);
        computer.compute(epsilon);
        result += `Искомые значения неизвестных: ${computer.getXVectors()[computer.getXVectors().length - 1].map((elem) => { return "\n" + elem; })}`;
        result += `\n\nКоличество итераций: ${computer.getNumberOfIterations()}`;
        result += `\n\nВектор погрешностей: ${computer.getAccuracyVectors()[computer.getAccuracyVectors().length - 1].map((elem) => { return "\n" + elem; })}`;
        showResult(result);
    }
    catch (e) {
        showMessage(e);
    }
}
submitButton.addEventListener('click', () => {
    clearResult();
    let tmpEpsilon = epsilonInput.value.toString();
    if (tmpEpsilon.trim() == "") {
        showMessage("Введите эпсилон.");
        return;
    }
    if (!isNumber(tmpEpsilon)) {
        showMessage("Введите правильное эпсилон.");
        return;
    }
    epsilon = Number(tmpEpsilon);
    let fromTextArea;
    if (radioButtons[0].checked) {
        fromTextArea = true;
    }
    else {
        fromTextArea = false;
    }
    if (fromTextArea) {
        let textAreaInput = textArea.value;
        if (textAreaInput == "") {
            showMessage("Введите чиселки в поле ввода");
            return;
        }
        if (isInputValid(textAreaInput)) {
            compute();
        }
        else {
            // message is already shown in 'isInputValid' method
        }
    }
    else {
        let fileContent = "";
        if (isFileSelected()) {
            let reader = new FileReader();
            reader.readAsText(filePicker.files[0]);
            reader.onload = () => {
                fileContent = reader.result;
                if (isInputValid(fileContent)) {
                    filePicker.value = "";
                    compute();
                }
                else {
                    // message is already shown in 'isInputValid' method
                }
            };
        }
        else {
            showMessage("Выберете файл, пожалуйста");
        }
    }
});
function isFileSelected() {
    return filePicker.files.length !== 0;
}
function isInputValid(input) {
    let rows = input.trim().split("\n");
    let tmpMatrix = [];
    for (let row of rows) {
        tmpMatrix.push([]);
        for (let element of row.trim().replace(/\s\s+/g, " ").split(" ")) {
            element.trim();
            element = element.replace(",", ".");
            if (!isNumber(element)) {
                showMessage(`Элемент матрицы не является числом: ${element}`);
                return false;
            }
            tmpMatrix[tmpMatrix.length - 1].push(Number(element));
        }
    }
    matrix = tmpMatrix; // беее
    return true;
}
function isNumber(value) {
    return ((value != null) &&
        (value !== '') &&
        !isNaN(Number(value.toString())));
}
function showMessage(input) {
    messageInput.innerHTML = input;
}
function hideMessage() {
    messageInput.innerHTML = "";
}
function showResult(result) {
    resultArea.innerHTML = result;
}
function clearResult() {
    resultArea.innerHTML = "";
}
// async function getFileContent(): string | null {
//     let reader = new FileReader();
//     reader.readAsText(filePicker.files[0])
//     // reader.onload = () => {
//         return reader.result;
//     // }
//# sourceMappingURL=index.js.map