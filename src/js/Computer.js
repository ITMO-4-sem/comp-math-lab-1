"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Computer = void 0;
/**
 * Главный класс для решения СЛАУ методом итераций Гаусса-Зейделя.
 * <br>Осуществляет:
 * <ul>
 *     <li>Валидацию матрицы</li>
 *     <li>Ее преобразование к виду с доминирующей диагональю</li>
 *     <li>Вычисление значений неизвестных</li>
 *
 */
const MatrixValidator_1 = require("./MatrixValidator");
const MatrixConverter_1 = require("./MatrixConverter");
class Computer {
    constructor(matrix) {
        /**
         * Матрица элементов.
         */
        this.matrix = [];
        /**
         * Размер матрицы (количество неизвестных).
         */
        this.matrixSize = 0;
        /**
         * Массив векторов приближений 'x'-ов по прошедшим итерациям.
         */
        this.xValues = [];
        /**
         * Вектор погрешностей.
         */
        this.accuracyVectors = [];
        /**
         * Счетчик итераций.
         */
        this.numberOfIterations = 0;
        console.log("comp MATRIX\n", matrix);
        this.setMatrix(matrix);
    }
    /**
     * Считает значения 'x'-ов до заданной точности.
     * @param epsilon - погрешность до достижения которой будут происходить итерации.
     * @throws Error если матрица невалидна, не может быть преобразована в матрицу с доминирующей диагональю или
     * происходит другая ошибка, не позволяющая найти значения неизвестных.
     */
    compute(epsilon = Computer.EPSILON_DEFAULT) {
        const isMatrixValidCheckResult = MatrixValidator_1.MatrixValidator.isMatrixValid(this.matrix);
        if (!isMatrixValidCheckResult.getStatus())
            throw new Error(isMatrixValidCheckResult.getMessage());
        let matrixConverter = new MatrixConverter_1.MatrixConverter(this.matrix, false);
        // console.log("blablabla matrix\n", this.matrix);
        this.matrix = matrixConverter.prepareMatrix();
        // console.log("2222blablabla\n", this.matrix);
        let matrixNorm = this.calculateMatrixNorm();
        // if ( ! (matrixNorm < 1) ) // todo Edited here
        //     throw new Error(`Норма матрицы должна быть меньше единицы. Текущая норма: '${matrixNorm}' ##-Разве это катастрофа?. Итерации не будут сходиться`);
        return this.calculateXValues(epsilon);
    }
    /**
     * Считает значения 'x'-ов до заданной точности.
     * @param epsilon - погрешность до достижения которой будут происходить итерации.
     */
    calculateXValues(epsilon) {
        this.xValues = [this.getInitialApproximation()];
        let x;
        let counter;
        let shift;
        let rateIndex;
        let iterationNumber = 0;
        do {
            iterationNumber++;
            this.xValues.push([]); // Значения иксов текущей итерации
            for (let i = 0; i < this.matrixSize; i++) {
                rateIndex = 0; // Индекс коэффициента в данной строке.
                counter = i; // Нужен для слежения за количеством иксов, которые берутся из текущей итерации, а не предыдущей.
                shift = 1; // Сдвиг по номеру итерации. Равен либо 0, либо 1.
                x = 0;
                for (let j = 1; j < this.matrixSize; j++) {
                    if (j - 1 == i) {
                        rateIndex++; // Если коэффициент соответствует текущему, i-тому иксу, то его пропускаем и берем следующий.
                    }
                    if (counter == 0)
                        shift = 0;
                    x += this.matrix[i][j] * this.xValues[iterationNumber - 1 + shift][rateIndex]; //
                    // 'iterationNumber - 1 + shift' указывает на номер итерации, из которой будет браться коэффициент.
                    rateIndex++;
                    counter--;
                }
                x += this.matrix[i][this.matrixSize]; // добавляем 'd', свободный член
                this.xValues[iterationNumber].push(x);
            }
        } while (!this.isAccuracySufficient(epsilon));
        this.numberOfIterations = iterationNumber;
        return this.xValues;
    }
    /**
     * Возвращает максимальную погрешность после последней итерации.
     * @return максимальная погрешность.
     */
    getAccuracy() {
        if (this.xValues.length < 2)
            throw new Error("Массив приближенных значений иксов содержит только один вектор. Их должно быть минимум два.");
        let lastIterationXValues = this.xValues[this.xValues.length - 1];
        let penultimateIterationXValues = this.xValues[this.xValues.length - 2];
        if (lastIterationXValues.length != penultimateIterationXValues.length) {
            throw new Error("Векторы иксов на предпоследней и последней итерациях должны быть равны.");
        }
        let accuracy = [];
        for (let i = 0; i < lastIterationXValues.length; i++) {
            accuracy.push(Math.abs(lastIterationXValues[i] - penultimateIterationXValues[i]));
        }
        this.accuracyVectors.push(accuracy);
        return Math.max(...accuracy);
    }
    /**
     * Определяет, была ли достигнута требуемая точность.
     *
     * @param epsilon - допустимая погрешность.
     * @return true, если требуемая точность была достигнута в последней итерации, иначе - false.
     */
    isAccuracySufficient(epsilon) {
        return this.getAccuracy() <= epsilon;
    }
    /**
     * Возвращает начальное приближение. По умолчанию - вектор свободных членов.
     * @return вектор (массив) - начальное приближение.
     */
    getInitialApproximation() {
        let initialApproximation = [];
        for (let row of this.matrix) {
            initialApproximation.push(row[row.length - 1]);
        }
        return initialApproximation;
    }
    /**
     * Считает норму матрицы.
     * @return норму матрицы.
     */
    calculateMatrixNorm() {
        let rowElementsModulesSums = [];
        let rowElementsSum = 0;
        for (let i = 0; i < this.matrixSize; i++) {
            rowElementsSum = 0;
            for (let j = 1; j < this.matrixSize; j++) {
                rowElementsSum += Math.abs(this.matrix[i][j]);
            }
            rowElementsModulesSums.push(rowElementsSum);
        }
        return Math.max(...rowElementsModulesSums);
    }
    /**
     * Меняет местами 2 элемента внутри массива по их индексам.
     * @param elemIndex1 - индекс первого элемента.
     * @param elemIndex2 - индекс второго элемента.
     * @param array - массив элементов.
     */
    swapArrayElements(elemIndex1, elemIndex2, array) {
        const tmpElem = array[elemIndex1];
        array[elemIndex1] = array[elemIndex2];
        array[elemIndex2] = tmpElem;
    }
    /**
     * Getter для количества итераций.
     * @return количество итераций.
     */
    getNumberOfIterations() {
        return this.numberOfIterations;
    }
    /**
     * Getter для вектора погрешностей.
     * @return вектор погрешностей.
     */
    getAccuracyVectors() {
        return this.accuracyVectors;
    }
    /**
     * Setter для матрицы. Осуществляет проверку ее валидности.
     * @param matrix - матрица элементов.
     * @throws Error если матрица невалидна.
     */
    setMatrix(matrix) {
        const isMatrixValidCheckResult = MatrixValidator_1.MatrixValidator.isMatrixValid(matrix);
        if (!isMatrixValidCheckResult.getStatus()) {
            throw new Error(isMatrixValidCheckResult.getMessage());
        }
        this.matrix = matrix;
        this.matrixSize = matrix.length;
    }
    getXVectors() {
        return this.xValues;
    }
    /**
     * Getter для матрицы элементов.
     * @return матрицу элементов.
     */
    getMatrix() {
        return this.matrix;
    }
}
exports.Computer = Computer;
Computer.EPSILON_DEFAULT = 0.01;
//# sourceMappingURL=Computer.js.map