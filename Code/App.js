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
    imgElement2.src = "/Image/ima02.jpg";
  };

  // Set the first source image
  imgElement1.src = "/Image/ima02.jpg";
}

function compareImages() {

  var imgElement = document.createElement('img');
  imgElement.src = "../Image/ima02.jpg";
  image1 = cv.imread(imgElement);
  

  var imgElement2 = document.createElement('img');
  imgElement2.src = "../Image/ima02.jpg";
  image2 = cv.imread(imgElement2);
  

  // Convert the images to grayscale
  const grayImage1 = image1.cvtColor(cv.COLOR_BGR2GRAY);
  const grayImage2 = image2.cvtColor(cv.COLOR_BGR2GRAY);

  // Compute the absolute difference between the two images
  const diff = cv.absdiff(grayImage1, grayImage2);

  // Compute the sum of the differences
  const sum = cv.sumElems(diff);

  // Compute the percentage of differences
  const percentage = (sum[0] / (grayImage1.size().height * grayImage1.size().width)) * 100;

  // Return the percentage of differences
  console.log("Percentage of differences: " + percentage.toFixed(1) + "%");
  console.log("Percentage of similarity: " + (100 - percentage).toFixed(1) + "%");
  return percentage;
}