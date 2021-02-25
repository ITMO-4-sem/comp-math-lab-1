/**
 * Главный класс для решения СЛАУ методом итераций Гаусса-Зейделя.
 * <br>Осуществляет:
 * <ul>
 *     <li>Валидацию матрицы</li>
 *     <li>Ее преобразование к виду с доминирующей диагональю</li>
 *     <li>Вычисление значений неизвестных</li>
 *
 */
import {MatrixValidator} from "./MatrixValidator";
import {Result} from "./Result";
import {MatrixConverter} from "./MatrixConverter";

export class Computer {

    public static readonly EPSILON_DEFAULT: number = 0.01;
    /**
     * Матрица элементов.
     */
    private matrix: number[][] = [];

    /**
     * Размер матрицы (количество неизвестных).
     */
    private matrixSize: number = 0;

    /**
     * Массив векторов приближений 'x'-ов по прошедшим итерациям.
     */
    private xValues: number[][] = [];

    /**
     * Вектор погрешностей.
     */
    private accuracyVectors: number[][] = [];

    /**
     * Счетчик итераций.
     */
    private numberOfIterations: number = 0;


    constructor(matrix: number[][]) {
        this.setMatrix(matrix);
    }


    /**
     * Считает значения 'x'-ов до заданной точности.
     * @param epsilon - погрешность до достижения которой будут происходить итерации.
     * @throws Error если матрица невалидна, не может быть преобразована в матрицу с доминирующей диагональю или
     * происходит другая ошибка, не позволяющая найти значения неизвестных.
     */
    public compute(epsilon: number = Computer.EPSILON_DEFAULT): number[][] {

        const isMatrixValidCheckResult: Result = MatrixValidator.isMatrixValid(this.matrix);

        if ( ! isMatrixValidCheckResult.getStatus() )
            throw new Error(isMatrixValidCheckResult.getMessage());

        let matrixConverter: MatrixConverter = new MatrixConverter(this.matrix, false);

        this.matrix = matrixConverter.prepareMatrix();

        let matrixNorm: number = this.calculateMatrixNorm();

        if ( ! (matrixNorm < 1) )
            throw new Error(`Норма матрицы должна быть меньше единицы. Текущая норма: '${matrixNorm}' ##-Разве это катастрофа?. Итерации не будут сходиться`);

        return this.calculateXValues(epsilon);

    }


    /**
     * Считает значения 'x'-ов до заданной точности.
     * @param epsilon - погрешность до достижения которой будут происходить итерации.
     */
    private calculateXValues(epsilon: number): number[][] {

        this.xValues = [this.getInitialApproximation()];

        let x: number;
        let counter: number;
        let shift: number;
        let rateIndex: number;

        let iterationNumber: number = 0;

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
        } while ( ! this.isAccuracySufficient( epsilon ) );

        this.numberOfIterations = iterationNumber;

        console.log("values =", this.xValues)

        return this.xValues;
    }


    /**
     * Возвращает максимальную погрешность после последней итерации.
     * @return максимальная погрешность.
     */
    private getAccuracy(): number {
        if ( this.xValues.length < 2)
            throw new Error("Массив приближенных значений иксов содержит только один вектор. Их должно быть минимум два.");

        let lastIterationXValues: number[] = this.xValues[this.xValues.length - 1];
        let penultimateIterationXValues: number[] = this.xValues[this.xValues.length - 2];

        if ( lastIterationXValues.length != penultimateIterationXValues.length ) {
            throw new Error("Векторы иксов на предпоследней и последней итерациях должны быть равны.");
        }

        let accuracy: number[] = [];

        for ( let i = 0; i < lastIterationXValues.length; i++ ) {
            accuracy.push( Math.abs( lastIterationXValues[i] - penultimateIterationXValues[i] ) );
        }

        this.accuracyVectors.push(accuracy);

        return Math.max( ...accuracy );
    }


    /**
     * Определяет, была ли достигнута требуемая точность.
     *
     * @param epsilon - допустимая погрешность.
     * @return true, если требуемая точность была достигнута в последней итерации, иначе - false.
     */
    private isAccuracySufficient(epsilon: number): boolean {
        return this.getAccuracy() <= epsilon;
    }


    /**
     * Возвращает начальное приближение. По умолчанию - вектор свободных членов.
     * @return вектор (массив) - начальное приближение.
     */
    private getInitialApproximation(): number[] {

        let initialApproximation: number[] = [];

        for ( let row of this.matrix ) {
            initialApproximation.push(row[row.length - 1])
        }

        return initialApproximation;
    }


    /**
     * Считает норму матрицы.
     * @return норму матрицы.
     */
    private calculateMatrixNorm(): number {

        let rowElementsModulesSums: number[] = [];
        let rowElementsSum: number = 0;

        for ( let i = 0; i < this.matrixSize; i++ ) {
            rowElementsSum = 0;
            for ( let j = 1; j < this.matrixSize; j ++ ) {
                rowElementsSum += Math.abs(this.matrix[i][j]);
            }
            rowElementsModulesSums.push(rowElementsSum);
            // console.log(`current NORM (i = ${i}) =`, rowElementsSum);
        }

        return Math.max(...rowElementsModulesSums);

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
     * Getter для количества итераций.
     * @return количество итераций.
     */
    public getNumberOfIterations(): number {
        return this.numberOfIterations;
    }


    /**
     * Getter для вектора погрешностей.
     * @return вектор погрешностей.
     */
    public getAccuracyVectors(): number[][] {
        return this.accuracyVectors;
    }


    /**
     * Setter для матрицы. Осуществляет проверку ее валидности.
     * @param matrix - матрица элементов.
     * @throws Error если матрица невалидна.
     */
    public setMatrix(matrix: number[][]) {

        const isMatrixValidCheckResult: Result = MatrixValidator.isMatrixValid(matrix);

        if ( ! isMatrixValidCheckResult.getStatus() ) {
            throw new Error(isMatrixValidCheckResult.getMessage());
        }

        this.matrix = matrix;
        this.matrixSize = matrix.length;

    }


    /**
     * Getter для матрицы элементов.
     * @return матрицу элементов.
     */
    public getMatrix(): number[][] {
        return this.matrix;
    }

}