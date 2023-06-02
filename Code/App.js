function getCoordinates() {
    // Create a canvas element to display the image
    var canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
  
    // Load the image
    var imgElement = document.createElement('img');
    imgElement.onload = function () {
      // Create a new cv.Mat object from the image
      var src = new cv.Mat(imgElement.height, imgElement.width, cv.CV_8UC4);
      var srcData = new Uint8Array(imgElement.width * imgElement.height * 4);
      var srcDataIndex = 0;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(imgElement, 0, 0);
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      for (var i = 0; i < imageData.length; i += 4) {
        srcData[srcDataIndex++] = imageData[i];
        srcData[srcDataIndex++] = imageData[i + 1];
        srcData[srcDataIndex++] = imageData[i + 2];
        srcData[srcDataIndex++] = imageData[i + 3];
      }
      src.data.set(srcData);
  
      // Convert the image to grayscale
      var gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  
      // Apply Canny edge detection
      var edges = new cv.Mat();
      cv.Canny(gray, edges, 50, 150);
  
      // Apply Hough Line Transform
      var lines = new cv.Mat();
      cv.HoughLinesP(edges, lines, 1, Math.PI / 180, 50, 50, 10);
  
      // Loop through the lines and get the coordinates
      for (var i = 0; i < lines.rows; ++i) {
        var startPoint = new cv.Point(lines.data32S[i * 4], lines.data32S[i * 4 + 1]);
        var endPoint = new cv.Point(lines.data32S[i * 4 + 2], lines.data32S[i * 4 + 3]);
  
        // Display the coordinates of each line
        console.log("Line " + (i + 1) + ":");
        console.log("Start Point: (" + startPoint.x + ", " + startPoint.y + ")");
        console.log("End Point: (" + endPoint.x + ", " + endPoint.y + ")");
      }
  
      // Clean up
      src.delete();
      gray.delete();
      edges.delete();
      lines.delete();
    };
  
    // Set the source image
    imgElement.src = 'path_to_your_image.jpg';
    
}


