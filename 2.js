function bubbleSort(arr){
    // iterasi item array dari index awal hingga akhir
    for(let i = 0; i < arr.length; i++){

        for(let j = 0; j < ( arr.length - i -1 ); j++){

            // cek item index array dengan item index disebelahnya
            if(arr[j] > arr[j+1]){

                // jika True maka tukar posisi array
                let temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j+1] = temp
            }
        }
    }
    // cetak sorted array
    console.log(arr);
}


// Test Case
let arr = [20, 12, 35, 11,  17, 9, 58, 23,69,21];

bubbleSort(arr);