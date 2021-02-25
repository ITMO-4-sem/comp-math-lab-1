
import {Result} from "./Result";

/**
 * Проверят валидность матрицы: она должна быть непустой, квадратной и тп.
 */
export class MatrixValidator {


    public static isMatrixValid(matrix: number[][]): Result {

        if ( this.isMatrixEmpty(matrix) ) {
            return new Result(false, "Матрица не может быть пустой.");
        }

        if ( ! this.isMatrixSquire(matrix) )
            return new Result(false, "Матрица должна быть квадратной.");

        if ( this.isMatrixContainsAllZeroRows(matrix) )
            return new Result(false, "Матрица содержит как минимум одну нулевую строку.")

        return new Result(true, "Матрица правильная.")

    }


    /**
     * Проверяет, является ли матрица пустой.
     * @param matrix - матрица элементов.
     * @return true, если матрица пустая, иначе - false
     */
    public static isMatrixEmpty(matrix: number[][]): boolean {
        return (
            matrix.length < 2
        )
    }


    /**
     * Проверяет, является ли матрица квадратной.
     * @param matrix - матрица элементов.
     * @return true, если матрица квадратная, иначе - false.
     */
    public static isMatrixSquire(matrix: number[][]): boolean {

        return (
            matrix.filter((row) => {

                return ! (row.length - 1 == matrix.length); // Оставляет элементы, для которых это условие 'true',
                                                      // то есть 'плохие', не соответствующие размеру матрицы, ряды.

            }).length == 0 // Если 'плохие' ряды есть, то - ошибка в матрице. Если их нет, то матрица - норм.
        )
    }


    /**
     * Проверяет, содержатся ли в матрице нулевые строки
     * (в этом случае при решении СЛАУ будет бесконечное число решений).
     * @param matrix - матрица элементов.
     */
    public static isMatrixContainsAllZeroRows(matrix: number[][]): boolean {

        for (let i = 0; i < matrix.length; i++) {
            if ( matrix[i].filter((value) => {
                    return value != 0
                }).length == 0 )
                return true;
        }

        return false;
    }

}