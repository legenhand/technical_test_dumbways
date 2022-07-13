const patternPersegi = (count) => {
    // check jika count genap maka akan di stop
    if (count % 2 === 0){
        console.log('jumlah harus ganjil!');
        return
    }
    console.log('Jumlah Pattern Baris = ' + count);
    let output = '';
    // iterasi baris
    for(let i = 1; i <= count; i++){
        // iterasi kolom
        for(let j = 1; j <= count; j++){
            // cek jika baris sedang berada di tengah
            if(i === Math.ceil(count / 2)){
                if(j === Math.ceil(count / 2)){
                    output += ' # '
                }else{
                    output += ' * ';
                }
            }else{
                // check jika kolom dan baris sedang di awal
                if (i === 1 && j === 1){
                    output += ' * ';
                } // check jika baris di awal dan kolom di akhir
                else if (i === 1 && j === count){
                    output += ' * '
                } // check jika kolom sedang di tengah
                else if(j === Math.ceil(count / 2)){
                    output += ' * '
                } // check jika kolom dan baris sedang di akhir
                else if (i === count && j === count){
                    output += ' * '
                } // check jika baris di akhir dan kolom di awal
                else if (i === count && j === 1){
                    output += ' * '
                }else{
                    output += ' # '
                }
            }
        }
        output += '\n'
    }
    console.log(output)
}

// test case

patternPersegi(9);

patternPersegi(8);

patternPersegi(5);