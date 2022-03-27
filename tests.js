console.log('testing');
let x = Date.now();
let y = new Date();
console.log(x)

//console.log(Date.UTC(2021, 10, 16, 17, 0))

//console.log(Date.UTC(2021, 10, 16, 5, 40))

console.log(y.getFullYear(), y.getMonth(), y.getDate(), y.getHours(), y.getMinutes())

console.log(Date.UTC(y.getFullYear(), y.getMonth(), y.getDate(), y.getHours(), y.getMinutes()))

console.log(y.getUTCFullYear(), y.getUTCMonth(), y.getUTCDate(), y.getUTCHours(), y.getUTCMinutes(), y.getUTCSeconds(), y.getUTCMilliseconds())

let a = 
console.log(Date.UTC(y.getUTCFullYear(), y.getUTCMonth(), y.getUTCDate(), y.getUTCHours(), y.getUTCMinutes(), y.getUTCSeconds(), y.getUTCMilliseconds()))
 
let z = new Date(x)
console.log(z.getHours(), z.getUTCHours());
//console.log(Date.UTC())
//console.log(x.getMonth());
/*
let testObject = {
    function: testfunction,
    list: {
        entry: [key / description, timestamp],
    }
}
*/