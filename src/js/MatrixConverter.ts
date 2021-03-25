import {Result} from "./Result";
import {MatrixValidator} from "./MatrixValidator";

/**
 * Представляет матрицу в виде матрицы с доминирующей диагональю.
 * По умолчанию проверяет ее валидность.
 * @see CHECK_MATRIX_VALIDITY
 */
export class MatrixConverter {

    private matrix: number[][] = [];
    private matrixSize: number = 0; // Количество неизвестных (иксов)

    private rowsMap: number[] = [];

    /**
     * Ключ, который при значении 'true' говорит классу о необходимости
     * проверить валидность матрицы перед работой с ней.
     * <br>По умолчанию: 'true'.
     */
    public static readonly CHECK_MATRIX_VALIDITY_DEFAULT: boolean = true;


    constructor(matrix: number[][], checkMatrixValidity: boolean = MatrixConverter.CHECK_MATRIX_VALIDITY_DEFAULT ) {
        this.setMatrix(matrix, checkMatrixValidity);
    }


    /**
     * Преобразует матрицу в матрице с доминирующей диагональю, затем к виду, в котором в первом столбце стоят иксы x1, x2,...,xn.
     * @throws Error если произошла ошибка при конвертации или трансформации матрицы.
     * @see convert
     * @see transform
     */
    public prepareMatrix(): number[][] {
        console.log("kek\n", this.matrix)
        this.convert();
        console.log("---- Матрица с доминирующей диагональю: ----\n", this.matrix);


        console.log("aftertimeout")
        this.transform();
        console.log("---- Трансформированная матрица: ----\n", this.matrix);


        return this.matrix;

    }

    /**
     * Преобразует матрицу к матрице с доминирующей диагональю.
     * @return матрицу, преобразованную к виду с доминирующей диагональю
     * @throws Error - если матрица не может быть преобразована.
     */
    public convert(): number[][] {

        const isMatrixConvertibleCheckResult: Result = this.isMatrixConvertibleToDominatingDiagonalView();

        if ( ! isMatrixConvertibleCheckResult.getStatus() )
            throw new Error(isMatrixConvertibleCheckResult.getMessage());


        let index: number = 0;
        while ( index < this.rowsMap.length ) {
            if ( index != this.rowsMap[index] ) { // Находим первую попавшуюся строку, которую нужно переставить,
                // и переставляем ее на соответствующее место. Не заботимся о правильности нового положения той,
                // с которой данная строка поменяется местами.
                this.swapMatrixRows(index, this.rowsMap[index]);
                this.swapArrayElements(index, this.rowsMap[index], this.rowsMap)
                index = 0; // Начинаем проверку с самого начала. Так как другая строка могла попасть на неправильную позицию.
            } else {
                index++;
            }
        }

        console.log("RRRRRRRRRR\n", this.matrix);

        return this.matrix;
    }


    /**
     * Преобразует матрицу к виду, в котором в первом столбце стоят иксы x1, x2,...,xn.
     * @throws Error если при коэффициент при иксе, стоящем на главной диагонали, равен нулю. Ошибка возможна
     * только при прямом вызове этого метода.
     * @see prepareMatrix
     */
    public transform(): number[][] {

        for ( let i = 0; i < this.matrixSize; i++ ) {

            let rate = this.matrix[i][i]; // Коэффициент при соответствующем иксе (x1, x2, x3 И тд)

            for ( let j = 0; j < this.matrixSize + 1; j++ ) {

                this.matrix[i][j] /= rate;

                if ( ( i != j ) && ( j != this.matrixSize )) { // Не нужный икс и Не свободный член
                    this.matrix[i][j] *= -1;
                }

                if ( i == j) {
                    this.swapArrayElements(0, j, this.matrix[i])
                }
            }
        }

        return this.matrix;
    }


    /**
     * Проверяет, можно ли преобразовать матрицу к матрице с доминирующей диагональю.
     * Заодно он подготавливает карту рядов 'rowsMap' для перемещения строк матрицы (это выполняется в этом же методе для оптимизации).
     * @return объект класса Result, который содержит информацию о результате.
     */
    public isMatrixConvertibleToDominatingDiagonalView(): Result {

        let dominatingElementIndex;

        for ( let rowIndex = 0; rowIndex < this.matrixSize; rowIndex++ ) {
            dominatingElementIndex = this.findDominatingElementIndex(this.matrix[rowIndex].slice(0, this.matrixSize));

            if ( dominatingElementIndex == null )
                return new Result(false, `Нет доминирующего элемента в строке номер '${rowIndex + 1}' (нумерация с 1).`);

            if ( this.rowsMap.indexOf(dominatingElementIndex) >= 0) // Уже есть элемент, претендующий на это место. // this.rowsMap[rowIndex] != -1
                return new Result(false,
                    `В столбце номер '${dominatingElementIndex + 1}' (нумерация с 1) находится больше одного доминирующего элемента. Невозможно построить матрицу с доминирующей диагональю.`)

            this.rowsMap[rowIndex] = dominatingElementIndex;
        }

        return new Result(true, "Матрица может быть преобразована в матрицу с доминирующей диагональю.");
    }


    /**
     * Возвращает ИНДЕКС доминирующего элемент в массиве или null, если такого элемента нет.
     * Доминирующий элемент - элемент, модуль которого больше или равен сумме модулей ОСТАЛЬНЫХ элементов.
     * @param row - строка матрицы, в которой будет искаться доминирующий элемент.
     * @return индекс доминирующего элемента или null, если его нет.
     */
    private findDominatingElementIndex(row: number[]): number | null {

        row.map( (value, index) => {
            row[index] = Math.abs(value);
        })
        const dominatingElement = Math.max(...row);
        const dominatingElementIndex = row.indexOf(dominatingElement);

        let sumOfRestElements = 0;

        for (let i = 0; i < row.length; i++) {
            if ( i == dominatingElementIndex)
                continue;

            sumOfRestElements += row[i];
        }

        if ( dominatingElement >= sumOfRestElements ) {
            return dominatingElementIndex;
        } else {
            return null; // No such element
        }
    }


    /**
     * Меняет местами 2 ряда матрицы по их индексам.
     * @param rowIndex1 - индекс первого ряда.
     * @param rowIndex2 - индекс второго ряда.
     */
    private swapMatrixRows(rowIndex1: number, rowIndex2: number): void {

        const tmpArray = this.matrix[rowIndex1];
        this.matrix[rowIndex1] = this.matrix[rowIndex2];
        this.matrix[rowIndex2] = tmpArray;
    }


    /**
     * Меняет местами 2 элемента внутри массива по их индексам.
     * @param elemIndex1 - индекс первого элемента.
     * @param elemIndex2 - индекс второго элемента.
     * @param array - массив элементов.
     */
    private swapArrayElements(elemIndex1: number, elemIndex2: number, array: any[]): void {

        const tmpElem = array[elemIndex1]

        array[elemIndex1] = array[elemIndex2]
        array[elemIndex2] = tmpElem;
    }


    /**
     * Setter for matrix with a check of it's validity.
     * @param matrix - matrix to set.
     * @param checkMatrixValidity - говорит классу о необходимости проверить валидность матрицы перед работой с ней.
     * @throws Error если передана невалидная матрица и проверка матрицы на валидность включена.
     * @see CHECK_MATRIX_VALIDITY_DEFAULT
     */
    public setMatrix(matrix: number[][], checkMatrixValidity: boolean): void {

        if ( checkMatrixValidity ) {
            const isMatrixValidCheckResult: Result = MatrixValidator.isMatrixValid(matrix);

            if ( ! isMatrixValidCheckResult.getStatus() )
                throw new Error(isMatrixValidCheckResult.getMessage());
        }

        this.matrix = matrix;

        this.matrixSize = matrix.length;

        this.rowsMap = new Array(this.matrixSize).fill(-1); // Указывает, что 'i'-тая строка должна стоять
        // на 'rowsMap[ i ]' позиции в матрице для получения доминирующей диагонали. Изначально заполнен значениями по дефолту.
    }


    /**
     * Возвращает матрицу элементов.
     * @return матрицу элементов.
     */
    public getMatrix(): number[][] {
        return this.matrix;
    }


}