 print(res);

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    let num = line;

    if ((num % 7 < 2) || num % 7 === num) {
        console.log('Alice');
    } else {
        console.log('Bob');
    }
});

//