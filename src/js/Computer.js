"use strict";
class Result {
    constructor(resultStatus, resultMessage) {
        this.status = resultStatus;
        this.message = resultMessage;
    }
    getStatus() {
        return this.status;
    }
    getMessage() {
        return this.message;
    }
}
class Computer {
    constructor(matrix) {
        this.matrix = [];
        this.matrixSize = 0;
        this.rowsMap = [];
        this.setMatrix(matrix); // Возможна неоптимальность, тк значение копируется, походу (передача параметра по значению)
    }
    /**
     * wtf
     */
    compute() {
        const isMatrixConvertibleCheckResult = this.isMatrixConvertibleToDominatingDiagonalView();
        if (isMatrixConvertibleCheckResult.getStatus()) {
            this.convertMatrixToDominatingDiagonalView();
            return this.matrix;
        }
        else {
            throw new Error(isMatrixConvertibleCheckResult.getMessage());
        }
    }
    setMatrix(matrix) {
        this.matrix = matrix;
        this.matrixSize = matrix.length;
        this.rowsMap = new Array(this.matrixSize).fill(-1); // Указывает, что 'i'-тая строка должна стоять
        // на 'rowsMap[ i ]' позиции в матрице для получения доминирующей диагонали. Изначально заполнен значениями по дефолту.
        if (this.isMatrixEmpty()) {
            throw new Error("Матрица не может быть пустой.");
        }
        if (!this.isMatrixSquire())
            throw new Error("Матрица должна быть квадратной.");
    }
    /**
     * Проверяет, является ли матрица пустой.
     * @returns true, если матрица пустая, иначе - false
     */
    isMatrixEmpty() {
        return (this.matrix.length < 2);
    }
    /**
     * Проверяет, является ли матрица квадратной.
     * @returns true, если матрица квадратная, иначе - false.
     */
    isMatrixSquire() {
        return (this.matrix.filter((row) => {
            return row.length != this.matrixSize; // Оставляет элементы, для которых это условие 'true',
            // то есть 'плохие', не соответствующие размеру матрицы, ряды.
        }).length == 0 // Если 'плохие' ряды есть, то - ошибка в матрице. Если их нет, то матрица - норм.
        );
    }
    convertMatrixToDominatingDiagonalView() {
        let index = 0;
        while (index < this.rowsMap.length) {
            if (index != this.rowsMap[index]) { // Находим первую попавшуюся строку, которую нужно переставить,
                // и переставляем ее на соответствующее место. Не заботимся о правильности нового положения той,
                // с которой данная строка поменяется местами.
                this.switchMatrixRows(index, this.rowsMap[index]);
                this.switchArrayElements(index, this.rowsMap[index], this.rowsMap);
                index = 0; // Начинаем проверку с самого начала. Так как другая строка могла попасть на неправильную позицию.
            }
            else {
                index++;
            }
        }
    }
    /**
     * Метод проверят, возможно ли преобразовать матрицу к диагональному виду.
     * Заодно он подготавливает карту рядов 'rowsMap' для перемещения строк матрицы (это выполняется в этом же методе для оптимизации).
     */
    /**
     * Проверяет, можно ли преобразовать матрицу к матрице с доминирующей диагональю.
     * @returns объект класса Result, который содержит информацию о результате.
     */
    isMatrixConvertibleToDominatingDiagonalView() {
        let dominatingElementIndex;
        for (let rowIndex = 0; rowIndex < this.matrixSize; rowIndex++) {
            dominatingElementIndex = this.findDominatingElementIndex(this.matrix[rowIndex]);
            if (dominatingElementIndex == null)
                return new Result(false, `Нет доминирующего элемента в строке номер '${rowIndex + 1}' (нумерация с 1).`);
            if (this.rowsMap.indexOf(dominatingElementIndex) >= 0) // Уже есть элемент, претендующий на это место. // this.rowsMap[rowIndex] != -1
                return new Result(false, `В столбце номер '${dominatingElementIndex + 1}' (нумерация с 1) находится больше одного доминирующего элемента. Невозможно построить матрицу с доминирующей диагональю.`);
            this.rowsMap[rowIndex] = dominatingElementIndex;
        }
        return new Result(true, "Матрица правильная.");
    }
    /**
     * Возвращает ИНДЕКС доминирующего элемент в массиве или null, если такого элемента нет.
     * Доминирующий элемент - элемент, модуль которого больше или равен сумме модулей ОСТАЛЬНЫХ элементов.
     * @param row строка матрицы, в которой будет искаться доминирующий элемент.
     * @returns индекс доминирующего элемента или null, если его нет.
     */
    findDominatingElementIndex(row) {
        row.map((value, index) => {
            row[index] = Math.abs(value);
        });
        const dominatingElement = Math.max(...row);
        const dominatingElementIndex = row.indexOf(dominatingElement);
        let sumOfRestElements = 0;
        for (let i = 0; i < row.length; i++) {
            if (i == dominatingElementIndex)
                continue;
            sumOfRestElements += row[i];
        }
        if (dominatingElement >= sumOfRestElements) {
            return dominatingElementIndex;
        }
        else {
            return null; // No such element
        }
    }
    /**
     * Меняет местами 2 ряда матрицы по их индексам.
     * @param rowIndex1 индекс первого ряда.
     * @param rowIndex2 индекс второго ряда.
     */
    switchMatrixRows(rowIndex1, rowIndex2) {
        const tmpArray = this.matrix[rowIndex1];
        this.matrix[rowIndex1] = this.matrix[rowIndex2];
        this.matrix[rowIndex2] = tmpArray;
    }
    /**
     * Меняет местами 2 элемента внутри массива по их индексам.
     * @param elemIndex1 индекс первого элемента.
     * @param elemIndex2 индекс второго элемента.
     * @param array массив элементов.
     */
    switchArrayElements(elemIndex1, elemIndex2, array) {
        const tmpElem = array[elemIndex1];
        array[elemIndex1] = array[elemIndex2];
        array[elemIndex2] = tmpElem;
    }
    /**
     * Возвращает матрицу элементов.
     * @returns матрицу элементов.
     */
    getMatrix() {
        return this.matrix;
    }
}
//# sourceMappingURL=Computer.js.map