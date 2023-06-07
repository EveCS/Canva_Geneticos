function callFitness() {
  cv['onRuntimeInitialized'] = () => {
    Fitness();
  };
}

function Fitness() {

  // TODO: Cambiar la manera en la que el Fitness recibe las imágenes

  // Carga la imagen 1
  var imgElement = document.createElement('img');
  imgElement.src = "../Image/ima02.jpg";
  imgElement.onload = function () {
    img1 = cv.imread(imgElement);
    console.log(img1);
    console.log("Img1 cols: " + img1.cols);
    console.log("Img1 rows: " + img1.rows);

    // Carga la imagen 2
    var imgElement2 = document.createElement('img');
    imgElement2.src = "../Image/ima06.jpg";
    imgElement2.onload = function () {
      img2 = cv.imread(imgElement2);
      console.log(img2);
      console.log("Img2 cols: " + img2.cols);
      console.log("Img2 rows: " + img2.rows);

      if (img1.cols > img2.cols || img1.rows > img2.rows) {
        cv.resize(img1, img1, new cv.Size(img2.cols, img2.rows));
        console.log("Redimensiona para coincidir con imagen 2 > Imagen 1 columnas: " + img1.cols);
        console.log("Redimensiona para coincidir con imagen 1 > Imagen 1 filas: " + img1.rows);
      }
      if(img2.cols > img1.cols || img2.rows > img1.rows){
        cv.resize(img2, img2, new cv.Size(img1.cols, img1.rows));
        console.log("Redimensiona para coincidir con imagen 1 > Imagen 2 columnas: " + img2.cols);
        console.log("Redimensiona para coincidir con imagen 1 > Imagen 2 filas: " + img2.rows);
      }

      // Convierte la imagen a escala de grises
      const grayImg1 = new cv.Mat();
      const grayImg2 = new cv.Mat();
      cv.cvtColor(img1, grayImg1, cv.COLOR_RGBA2GRAY);
      cv.cvtColor(img2, grayImg2, cv.COLOR_RGBA2GRAY);

      // Calcula la diferencia absoluta entre las dos imágenes
      const diff = new cv.Mat();
      cv.absdiff(grayImg1, grayImg2, diff);

      // Reduce los valores a binario para identificar los pixeles diferentes
      const binaryDiff = new cv.Mat();
      cv.threshold(diff, binaryDiff, 0, 255, cv.THRESH_BINARY);

      // Cuenta los pixeles diferentes
      const diffPixels = cv.countNonZero(binaryDiff);

      // Limpia la memoria
      img1.delete();
      img2.delete();
      grayImg1.delete();
      grayImg2.delete();
      diff.delete();
      binaryDiff.delete();

      // Imprime y retorna los resultados
      console.log("Número de pixeles diferentes entre las dos imágenes:" + diffPixels + "px");
      return diffPixels;
    };
  };
}