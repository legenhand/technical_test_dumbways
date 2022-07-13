## Jawaban 4.A

- ### Tampikan seluruh data dari table provinsi
``SELECT * FROM `provinsi_tb``

![img.png](img.png)

- ### Tampilkan seluruh data *provinsi* beserta *kabupaten*
`SELECT kabupaten_tb.*, provinsi_tb.*, kabupaten_tb.nama as nama_kabupaten, 
provinsi_tb.nama as nama_provinsi FROM kabupaten_tb LEFT JOIN 
provinsi_tb ON kabupaten_tb.provinsi_id = provinsi_tb.id;`
![img_3.png](img_3.png)
- ### Tampilkan seluruh data provinsi yang berada di pulau tertentu
`SELECT * FROM provinsi_tb WHERE pulau = 'Jawa';`

`
![img_4.png](img_4.png)
- ### Screenshot hasil query POST / Menambah Data

### insert data ke table kabupaten_tb

![img_1.png](img_1.png)

### insert data ke table provinsi_tb

![img_2.png](img_2.png)