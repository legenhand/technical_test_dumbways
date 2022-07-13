const hitungHargaBarang = (kualitas, quantity) => {
    let harga, totalHarga, potongan, totalBayar;

    switch (kualitas){
        case 'A':
            harga = 4550
            totalHarga = harga * quantity;
            potongan = 0;
            if (quantity > 13){
                potongan = quantity * 231;
            }
            totalBayar = totalHarga - potongan;
            console.log(`
            Kualitas = ${kualitas}
            Quantity = ${quantity}
            -------------------------------------
            Total Harga Barang = ${totalHarga}
            Potongan = ${potongan}
            --------------------------------------
            Total yang harus dibayar = ${totalBayar}
            --------------------------------------
            `);
            break;
        case 'B':
            harga = 5330
            totalHarga = harga * quantity;
            potongan = 0;
            if (quantity > 7){
                potongan = quantity * 0.23;
            }
            totalBayar = totalHarga - potongan;
            console.log(`
            Kualitas = ${kualitas}
            Quantity = ${quantity}
            -------------------------------------
            Total Harga Barang = ${totalHarga}
            Potongan = ${potongan}
            --------------------------------------
            Total yang harus dibayar = ${totalBayar}
            --------------------------------------
            `);
            break;
        case 'C':
            harga = 8653;
            totalHarga = harga * quantity;
            console.log(`
            Kualitas = ${kualitas}
            Quantity = ${quantity}
            -------------------------------------
            Total Harga Barang = ${totalHarga}
            Potongan = Tidak ada promo untuk barang ini
            --------------------------------------
            Total yang harus dibayar = ${totalHarga}
            --------------------------------------
            `);
            break;
        default:
            console.log('Pilih Barang A, B, Atau C');
    }
}


// Test Case
// Barang A
hitungHargaBarang("A",14);

// Barang B
hitungHargaBarang("B",8);

// Barang C
hitungHargaBarang("C",5);