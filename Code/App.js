function getCoordinates() {

    // Load the image
    const image = cv.imread('Resources/Línea (10, 10, 5).jpg');

    // Set the starting and ending points of the line
    const startPoint = new cv.Point(50, 100);
    const endPoint = new cv.Point(200, 150);

    // Calculate the difference and absolute difference between the points
    const dx = Math.abs(endPoint.x - startPoint.x);
    const dy = Math.abs(endPoint.y - startPoint.y);
    const sx = (startPoint.x < endPoint.x) ? 1 : -1;
    const sy = (startPoint.y < endPoint.y) ? 1 : -1;

    // Initialize variables for iteration
    let x = startPoint.x;
    let y = startPoint.y;
    let err = dx - dy;

    // Iterate over each pixel in the line and retrieve their coordinates
    while (true) {
        // Access the pixel at (x, y)
        const pixel = image.ucharPtr(y, x);
        const pixelValue = pixel[0]; // Access the pixel value (if needed)

        // Print the coordinates or perform desired operations
        console.log(`Pixel: x=${x}, y=${y}`);

        // Check if we have reached the end point
        if (x === endPoint.x && y === endPoint.y) {
            break;
        }

        const err2 = 2 * err;

        // Update the error value and move to the next pixel
        if (err2 > -dy) {
            err -= dy;
            x += sx;
        }
        if (err2 < dx) {
            err += dx;
            y += sy;
        }
    }

    // Release resources
    image.delete();
    
}