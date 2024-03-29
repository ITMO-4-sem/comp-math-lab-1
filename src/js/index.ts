import {Computer} from "./Computer";

let matrix: number[][] = [
    // [2, 2, 10, 14],
    // [10, 1, 1, 12],
    // [2, 10, 1, 13],
    // [0, 1, 0, 0], // Даже так работает ОФИГЕТЬ!
];
let epsilon: number;

// let computer: Computer = new Computer(matrix);

const form = document.getElementById("form");
const textArea = document.getElementById("textarea");
const filePicker = document.getElementById("filePicker");
const submitButton = document.getElementById("submit");
const messageInput = document.getElementById("message");
const radioButtons = document.getElementsByName("radio");
const resultArea = document.getElementById("result");

const epsilonInput = document.getElementById("epsilon");

if (textArea == null || filePicker == null || submitButton == null || messageInput == null )
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
        }
    }
}


function compute() {
    // computer.compute(epsilon);
    // console.log(".....computing....");
    // console.log("epsilon: ", epsilon);
    // console.log("Matrix is", matrix);



    let result = "";

    try {
        // console.log("_____ pppFFF\n", matrix);
        console.log("--- Исходная матрица ---\n", matrix);

        let prp = JSON.parse(JSON.stringify(matrix));
        console.log("111", prp);
        console.log("122", JSON.parse(JSON.stringify(matrix)))
        let computer: Computer = new Computer(prp);
        // computer.setMatrix(matrix);
        // console.log("--- Исходная матрица ---\n", computer.getMatrix());
        computer.compute(epsilon); // Если закомментировать этот метод, то вывод работает номрально

        result += `Искомые значения неизвестных: ${computer.getXVectors()[computer.getXVectors().length - 1].map((elem) => {return "\n" + elem})}`

        result += `\n\nКоличество итераций: ${computer.getNumberOfIterations()}`
        result += `\n\nВектор погрешностей: ${computer.getAccuracyVectors()[computer.getAccuracyVectors().length - 1].map((elem) => {return "\n" + elem})}`

        showResult(result);
    } catch (e) {
        showMessage(e);
    }

}


submitButton.addEventListener('click', () => {

    clearResult();

    let tmpEpsilon = epsilonInput.value.toString();

    if ( tmpEpsilon.trim() == "") {
        showMessage("Введите эпсилон.");
        return;
    }
    if ( ! isNumber(tmpEpsilon)) {
        showMessage("Введите правильное эпсилон.");
        return;
    }

    epsilon = Number(tmpEpsilon);

    let fromTextArea: boolean;

    if ( radioButtons[0].checked ) {
        fromTextArea = true;
    } else {
        fromTextArea = false;
    }

    if ( fromTextArea ) {
        let textAreaInput: string = textArea.value;

        if (textAreaInput == "") {
            showMessage("Введите чиселки в поле ввода")
            return;
        }

        // console.log("Going to check validity");
        if ( isInputValid(textAreaInput) ) {
            // matrix = textAreaInput
            // console.log("after Valid matrix\n", matrix);
            compute();
        } else {
            return;
            // message is already shown in 'isInputValid' method
        }
    } else {

        let fileContent: string = "";

        if (isFileSelected()) {
            let reader = new FileReader();
            reader.readAsText(filePicker.files[0]);
            reader.onload = () => {
                fileContent = reader.result;
                if (isInputValid(fileContent)) {
                    filePicker.value = "";
                    compute();

                } else {
                    // message is already shown in 'isInputValid' method
                    return;
                }

            }
        } else {
            showMessage("Выберете файл, пожалуйста!");
        }
    }
});

function isFileSelected() {
    return filePicker.files.length !== 0;
}

function isInputValid(input: string): boolean {
    let rows = input.trim().split("\n");

    // console.log("rows = \n", rows);

    let tmpMatrix: number[][] = [];

    for (let row of rows) {
        // console.log("tmpTTT\n", tmpMatrix);
        tmpMatrix.push([]);
        for (let element of row.trim().replace(/\s\s+/g, " ").split(" ")) {
            element.trim();
            // console.log("element = \n", element)

            element = element.replace(",", ".");

            if ( ! isNumber(element)) {
                showMessage(`Элемент матрицы не является числом: ${element}`);
                return false;
            }
            // console.log("1tmpMatrix", tmpMatrix);
            tmpMatrix[tmpMatrix.length - 1].push(Number(element));
            // console.log("2tmpMatrix", tmpMatrix);

        }
    }

    console.log("tmptmptmp\n", tmpMatrix);
    matrix = JSON.parse(JSON.stringify(tmpMatrix)); // беее

    return true;

}



function isNumber(value: string | number): boolean
{
    return ((value != null) &&
        (value !== '') &&
        !isNaN(Number(value.toString())));
}

function showMessage(input: string) {
    messageInput.innerHTML = input;
}

function hideMessage() {
    messageInput.innerHTML = "";
}

function showResult(result: string) {
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


