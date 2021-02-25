let a: number[][] = [[1], [2], [3]];
let b: number[][] = a;

a[0][0] = 3

console.log("b = ", b)

b[2][0] = 5

console.log("a =", a)