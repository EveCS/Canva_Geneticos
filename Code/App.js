function openCvReady() {
  cv['onRuntimeInitialized']=()=>{
    fitness();
  };
}

function fitness(){
  
  // Create a canvas element to display the images
  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  // Load the first image
  var imgElement1 = document.getElementById('imgRepli');
  imgElement1.onload = function () {
    // Create a new cv.Mat object from the first image
    var srcData1 = cv.imread(imgElement1);
    var src1 = new cv.Mat();
    cv.cvtColor(srcData1, src1, cv.COLOR_RGBA2RGB);

    // Load the second image
    var imgElement2 = document.getElementById('imgGener');
    imgElement2.onload = function () {
      // Create a new cv.Mat object from the second image
      var srcData2 = cv.imread(imgElement2);
      var src2 = new cv.Mat();
      cv.cvtColor(srcData2, src2, cv.COLOR_RGBA2RGB);

      // Compare the pixels of the two images
      var equalPixels = 0;
      var totalPixels = src1.rows * src1.cols;
      for (var i = 0; i < totalPixels; i++) {
        var pixel1 = src1.data[i];
        var pixel2 = src2.data[i];
        if (pixel1[0] === pixel2[0] && pixel1[1] === pixel2[1] && pixel1[2] === pixel2[2]) {
          equalPixels++;
        }
      }

      // Calculate the percentage of equal pixels
      var equalPixelPercentage = (equalPixels / totalPixels) * 100;

      // Display the result
      console.log("Equal Pixels: " + equalPixels);
      console.log("Total Pixels: " + totalPixels);
      console.log("Equal Pixel Percentage: " + equalPixelPercentage.toFixed(2) + "%");

      // Clean up
      src1.delete();
      src2.delete();
    };

    // Set the second source image
    imgElement2.src = "/Image/ima01.jpg";
  };

  // Set the first source image
  imgElement1.src = "/Image/ima02.jpg";
}

function compareImages() {

  // Carga la imagen 1
  var imgElement = document.createElement('img');
  imgElement.src = "../Image/ima02.jpg";
  image1 = cv.imread(imgElement);
  
  // Carga la imagen 2
  var imgElement2 = document.createElement('img');
  imgElement2.src = "../Image/ima02.jpg";
  image2 = cv.imread(imgElement2);
  

  // Se convierte la imagen a escala de grises
  grayImage1 = new cv.Mat();
  cv.cvtColor(image1, grayImage1, cv.COLOR_BGR2GRAY, 0);
  grayImage2 = new cv.Mat();
  cv.cvtColor(image2, grayImage2, cv.COLOR_BGR2GRAY, 0);

  // Se calculan las "diferencias" entre las dos imágenes
  diff = new cv.Mat();
  cv.absdiff(grayImage1, grayImage2, diff);

  console.log(diff);

  // Se realiza la suma de las diferencias
  //const suma = cv.sumElems(diff);
  const suma = cv.countNonZero(diff);

  // Se calcula el porcentaje de diferencias
  const percentage = (suma / (grayImage1.size().height * grayImage1.size().width)) * 100;

  // Se muestra el resultado
  console.log("Porcentaje de diferencias: " + percentage.toFixed(1) + "%");
  console.log("porcentaje de similaridad: " + (100 - percentage).toFixed(1) + "%");
  return percentage;
}