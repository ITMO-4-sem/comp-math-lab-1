"use strict";
// import {Computer} from "./Computer";
Object.defineProperty(exports, "__esModule", { value: true });
const Computer_1 = require("./Computer");
let m = 18;
console.log("PoopKa");
// const containerElement = document.getElementById("container");
//
// containerElement.textContent = "Hi!"
let matrix3 = [
    [2, 6, 3],
    [4, 5, 9],
    [21, 8, 9]
];
let matrix4 = [
    [1, 6, 3, 11, 15],
    [4, 5, 15, 4, 16],
    [21, 8, 9, 1, 17],
    [12, 56, 1, 19, 18]
];
let matrixExample = [
    [2, 2, 10, 14],
    [10, 1, 1, 12],
    [2, 10, 1, 13],
];
// const matrixConverter: MatrixConverter = new MatrixConverter(matrixExample);
//
//
//
// matrixConverter.convert();
// let convertedMatrix: number[][] = matrixConverter.getMatrix();
//
// console.log("convertedMatrix =", convertedMatrix)
// console.log('FiNiShEd');
// computer.setMatrix([]);
let computer = new Computer_1.Computer(matrixExample);
// computer.transform();
computer.compute(0.01); // 1212
console.log("accuracyVectors =", computer.getAccuracyVectors());
computer.setMatrix(matrix4);
computer.compute(0.01);
console.log("accuracyVectors =", computer.getAccuracyVectors());
// computer.
// console.log("matrix is", computer.getMatrix());
// console.log("matrix NORM=", computer.calculateMatrixNorm());
// tessssssssssssssssst
let alB;
alB = [];
// alB = null;
//
// lol(undefined);
function lol(alN) {
}
//# sourceMappingURL=main.js.map