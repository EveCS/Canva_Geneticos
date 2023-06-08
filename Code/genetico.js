// Investigar open cv para pintar los puntos de coordenadas

//RangeInputs del html
const rangeInputs = document.querySelectorAll(".form-range");
const btnInicio = document.getElementById("initGen");
const btnGrafico = document.getElementById("grafico");
const btnReload = document.getElementById("reload");

//Declarar variables informacion dada por el usuario
let maximaPoblacion, individuosPoblacion;
let individuosElegir, individuosMutar, individuosCombinar;

//Canvas tanto el de entrada como el de salida, crear la imagen
const strokeWidthInput = document.getElementById("strokeWidth");
const canvasInput = document.getElementById('canvasInput');
const canvasOutput = document.getElementById('canvasOutput');
const image = new Image();
const tamIma = 600; //Constante el tamanno de las imagenes para generar los puntos aleatorios

// Imagenes globales
var imageInput = ""; //Variable para guardar la imagen de entrada

//Variables de cronometro y opencv
let isOpencvReady = false;
let cronometro;
let segundos = 0;
let tiempoGen = [];


let src, dst, contours, hierarchy;

//Variables cronometro
let start_principal, end_principal;
let total_principal;

let start_prom, end_prom, total_prom;
let promedio = [];

//Variables graficar fitness
let fitnessPromGen = [];
let mejorFitnessGen = [];

function opencvcheck() {
    isOpencvReady = true;
    document.getElementById('checker').innerHTML = "Opencv is Ready."
}


function loadImage(event) {
    if (!isOpencvReady) {
        console.log("OpenCV.js is not ready yet.");
        return;
    }


    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = function (event) {

        image.onload = function () {
            canvasInput.width = image.width;
            canvasInput.height = image.height;
            canvasOutput.width = image.width;
            canvasOutput.height = image.height;

            const ctxInput = canvasInput.getContext('2d');
            ctxInput.drawImage(image, 0, 0);

        };
        image.src = event.target.result;
        imageInput = image.src;
    };
    reader.readAsDataURL(file);

}


//Tomar los range inputs y validar que entre los tres sumen el 100%
rangeInputs.forEach((input) => {
    input.addEventListener("input", updateRanges);
});

function updateRanges() {
    let total = 0;

    rangeInputs.forEach((input) => {
        total += parseInt(input.value);
    });

    if (total > 100) {
        const changedInput = this.id;
        const remainingValue = total - 100;

        rangeInputs.forEach((input) => {
            if (input.id !== changedInput) {
                const currentValue = parseInt(input.value);
                const newValue = currentValue - remainingValue / 2;

                input.value = newValue;
            }
        });
    }

    rangeInputs.forEach((input) => {
        const valueSpan = document.getElementById(input.id + "-value");
        valueSpan.textContent = input.value + "%";
    });
}


/* ----------------------------- FUNCION PRINCIPAL GENETICO | Evento boton  ------------------------------------------ */
btnInicio.addEventListener("click", () => {
    //Inputs del html para guardar en variables uso del genetico dadas por el usuario
    generacionMaxima = document.getElementById("genMaximas").value;
    individuosPoblacion = document.getElementById("indPoblacion").value;

    individuosElegir = (document.getElementById("rangeElegir").value) / 100;
    individuosMutar = (document.getElementById("rangeMutar").value) / 100;
    individuosCombinar = (document.getElementById("rangeCombinar").value) / 100;
    console.log("max pob ", maximaPoblacion, " ind pob ", individuosPoblacion);
    console.log("% elegir: ", individuosElegir, " mutar ", individuosMutar, " comb ", individuosCombinar);

    // Ejecutar el algoritmo genético con los parámetros deseados
    iniciarAlgGenetico(generacionMaxima, individuosPoblacion, individuosElegir, individuosMutar, individuosCombinar);

    // ---- Tiempo cronometrado de la duracion de las funciones ----

    // Calcular minutos, segundos y milisegundos
    var minutes = Math.floor(total_principal / 60000);
    var seconds = Math.floor((total_principal % 60000) / 1000);
    var milliseconds = total_principal % 1000;

    // Actualizar el elemento HTML con el tiempo de ejecución formateado
    var executionTimeElement = document.getElementById('tiempoTotal');
    executionTimeElement.textContent = `${minutes} min ${seconds} seg ${milliseconds} ms`;

    // Calcular el promedio de los tiempos
    var suma = promedio.reduce(function (a, b) {
        return a + b;
    }, 0);

    var promedioTiempos = suma / promedio.length;

    var minutes_prom = Math.floor(promedioTiempos / 60000);
    var seconds_prom = Math.floor((promedioTiempos % 60000) / 1000);
    var milliseconds_prom = promedioTiempos % 1000;

    // Actualizar el elemento HTML con el tiempo de ejecución formateado
    var promTimeElement = document.getElementById('tiempoPromedio');
    promTimeElement.textContent = `${minutes_prom} min ${seconds_prom} seg ${milliseconds_prom} ms`;
});

btnGrafico.addEventListener("click", () => {
    drawGaphic();
});

btnReload.addEventListener('click', () => window.location.reload(true));
// ----------------------------- ALGORITMO GENETICO -----------------------------------


// Función para generar un número aleatorio dentro de un rango dado
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para crear un individuo aleatorio con coordenadas x, y
function createRandomindividuo() {
    const individuo = [];
    const cantidadPuntos = 20; // Número de puntos en el individuo, adn

    for (let i = 0; i < cantidadPuntos; i++) {
        const point = {
            x: getRandomNumber(0, tamIma), // Rango de coordenadas x 
            y: getRandomNumber(0, tamIma)  // Rango de coordenadas y 
        };
        individuo.push(point);
    }

    return individuo;
}

// Función para calcular la puntuación de un individuo ( la distancia total entre los puntos)
function calcularFitness(individuo) {
    let distanciaTotal = 0;

    for (let i = 1; i < individuo.length; i++) {
        const puntoAnterior = individuo[i - 1];
        const puntoActual = individuo[i];
        const distancia = Math.sqrt((puntoActual.x - puntoAnterior.x) ** 2 + (puntoActual.y - puntoAnterior.y) ** 2);
        distanciaTotal += distancia; // Suma la distancia
    }

    return distanciaTotal;
}

// Función para seleccionar individuos basados en su puntuación fitness
function seleccionar(poblacion, puntajeSeleccion) {
    const selectedCount = Math.round(poblacion.length * puntajeSeleccion);
    const sortedPopulation = poblacion.sort((a, b) => b.fitness - a.fitness); // Ordena en orden descendente
    const elegido = sortedPopulation.slice(0, selectedCount);

    return elegido; // El elegido oooh xD
}


// Función para mutar un individuo
function mutacionInd(individuo) {
    const mutarIndividuo = JSON.parse(JSON.stringify(individuo)); // Clonar el individuo

    // Realizar una mutación en un punto aleatorio del individuo
    const pointIndex = Math.floor(Math.random() * mutarIndividuo.length);
    const puntoMutacion = {
        x: getRandomNumber(0, tamIma), // Rango de coordenadas x 
        y: getRandomNumber(0, tamIma)  // Rango de coordenadas y 
    };
    mutarIndividuo[pointIndex] = puntoMutacion;

    //Agregar una nueva coordenada al individuo mutado
    let nuevoPunto = {
        x: getRandomNumber(0, tamIma), // Rango de coordenadas x 
        y: getRandomNumber(0, tamIma)  // Rango de coordenadas y 
    }
    mutarIndividuo.push(nuevoPunto); //Agregar una nueva coordenada al ADN del individuo

    return mutarIndividuo;
}

// Función para combinar dos individuos mediante combinar
function combinar(individuo1, individuo2) {
    const puntoCruce = Math.floor(Math.random() * individuo1.length);
    const hijo = individuo1.slice(0, puntoCruce).concat(individuo2.slice(puntoCruce));

    return hijo;
}

// Función para generar una nueva generación
function crearSigGeneracion(poblacion, puntajeSeleccion, rangoMutacion, rangoCombinacion) {
    const elegido = seleccionar(poblacion, puntajeSeleccion);
    const nuevaPoblacion = [];

    // Replicar individuos seleccionados
    while (nuevaPoblacion.length < poblacion.length) {
        nuevaPoblacion.push(JSON.parse(JSON.stringify(elegido[Math.floor(Math.random() * elegido.length)])));
    }

    // Aplicar mutación a un porcentaje de individuos
    const numMutaciones = Math.round(poblacion.length * rangoMutacion);
    for (let i = 0; i < numMutaciones; i++) {
        const mutarIndividuo = mutacionInd(nuevaPoblacion[i]);
        nuevaPoblacion[i] = mutarIndividuo;
    }

    // Realizar combinar en un porcentaje de individuos
    const numCruce = Math.round(poblacion.length * rangoCombinacion);
    for (let i = 0; i < numCruce; i++) {
        const padre1 = nuevaPoblacion[i];
        const padre2 = nuevaPoblacion[Math.floor(Math.random() * nuevaPoblacion.length)];
        const hijo = combinar(padre1, padre2);
        nuevaPoblacion[i] = hijo;
    }

    return nuevaPoblacion;
}

// Función principal
function iniciarAlgGenetico(maxGeneraciones, tamPoblacion, puntajeSeleccion, rangoMutacion, rangoCombinacion) {
    start_principal = Date.now();
    let generacion = 1;
    let poblacion = [];

    // Crear la población inicial
    for (let i = 0; i < tamPoblacion; i++) {
        const individuo = createRandomindividuo();
        poblacion.push(individuo);
    }

    // Iterar hasta alcanzar el máximo de generaciones
    while (generacion <= maxGeneraciones) {
        start_prom = performance.now();
        console.log('Generacion:', generacion);

        // Calcular la puntuación fitness para cada individuo
        for (const individuo of poblacion) {
            // Se llama a la función de dibujo y se le pasa el individuo
            let lista = individuo.map(point => [point.x, point.y]); // Crear una nueva lista de puntos en el formato [[x, y], [x, y], [x, y]]
            //console.log("Lista: " + lista);
            var image = draw(lista);
            // El resultado se le pasa al Fitness() para que determine el puntaje recibido en comparación con la imagen objetivo
            let fitness = Fitness(image);
            console.log("Fitness: " + fitness);
            individuo.fitness = fitness;
        }

        // Ordenar la población según la puntuación fitness (en orden ascendente)
        poblacion.sort((a, b) => a.fitness - b.fitness);

        // Mostrar el individuo con la mejor puntuación fitness
        console.log('Mejor individuo:', poblacion[0]);

        //Obtener el mejor fitness y el fitness promedio por generacion para el grafico
        mejorFitnessGen.push(poblacion[0].fitness); //Mejor fitness de esta generacion

        const sumaFitness = poblacion.reduce((total, individuo) => total + individuo.fitness, 0);
        const promFitness = sumaFitness / poblacion.length;
        fitnessPromGen.push(promFitness); //Fitness promedio generacion

        // Generar la siguiente generación
        poblacion = crearSigGeneracion(poblacion, puntajeSeleccion, rangoMutacion, rangoCombinacion);

        generacion++;
        end_prom = performance.now();
        let prom = end_prom - start_prom;
        promedio.push(prom);
    }
    end_principal = Date.now();
    total_principal = end_principal - start_principal;
}

function Fitness(img2) {

    // TODO: Cambiar la manera en la que el Fitness recibe las imágenes

    // Carga la imagen 1
    let imgElement = document.createElement('img');
    imgElement.src = imageInput;

    imgElement.onload = function () {
        img1 = cv.imread(imgElement);
        console.log(img1);
        console.log("Img1 cols: " + img1.cols);
        console.log("Img1 rows: " + img1.rows);

        // Carga la imagen 2
        console.log(img2);
        console.log("Img2 cols: " + img2.cols);
        console.log("Img2 rows: " + img2.rows);

        if (img1.cols > img2.cols || img1.rows > img2.rows) {
            cv.resize(img1, img1, new cv.Size(img2.cols, img2.rows));
            console.log("Redimensiona para coincidir con imagen 2 > Imagen 1 columnas: " + img1.cols);
            console.log("Redimensiona para coincidir con imagen 1 > Imagen 1 filas: " + img1.rows);
        }
        if (img2.cols > img1.cols || img2.rows > img1.rows) {
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
        //img2.delete();
        grayImg1.delete();
        grayImg2.delete();
        diff.delete();
        binaryDiff.delete();

        // Imprime y retorna los resultados

        if (!(diffPixels > 0)){
            diffPixels = (img2.cols * img2.rows);
        }

        console.log("Número de pixeles diferentes entre las dos imágenes:" + diffPixels + "px");
        return diffPixels;

    };
}

function draw(list) {
    var drawnImg = new cv.Mat(600, 600, cv.CV_8UC3, [255, 255, 255, 255]);
    /*
        Ejemplo de dibujo de una línea
        let pt1 = new cv.Point(0, 0);
        let pt2 = new cv.Point(150, 150);
        cv.line(drawnImg, pt1, pt2, [0, 0, 0, 0], 2)
    */

    let i = 0;
    while (i < list.length) {
        if ((i + 1) >= list.length) {
            break;
        }

        // Ejemplo de lista: [[1, 0], [2, 6], [3, 7], [4, 8], [5, 9]]

        start = new cv.Point(list[i][0], list[i][1]);
        end = new cv.Point(list[i + 1][0], list[i + 1][1]);

        cv.line(drawnImg, start, end, [0, 0, 0, 0], 2)
        i++;
    }

    cv.imshow('canvasOutput', drawnImg);
    return drawnImg;

}

/* ----------- HACER GRAFICO LINEAL -------------- */
function drawGaphic() {

    let labels = [];
    for (let i = 0; i < generacionMaxima; i++) {
        labels.push(i);
    }

    const ctx = document.getElementById('lineChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Mejor Fitness Generación',
                data: mejorFitnessGen,
                borderColor: 'rgba(255, 53, 127, 1)',
                backgroundColor: 'rgba(152, 68, 183, 1)',
                yAxisID: 'y-axis-1',
                tension: 0
            }, {
                label: 'Fitness Promedio Generación',
                data: fitnessPromGen,
                borderColor: '#21f4df',
                backgroundColor: 'rgba(87, 111, 230, 1)',
                yAxisID: 'y-axis-2',
                tension: 0
            }]
        },
        options: {
            responsive: true,
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        position: 'left'
                    },
                    {
                        id: 'y-axis-2',
                        type: 'linear',
                        position: 'right'
                    }
                ]
            },
            animation: {
                onComplete: function () {
                    // Cambia el fondo del canvas al color deseado después de que se genere el gráfico
                    ctx.canvas.style.background = 'white';
                }
            }
        }
    });

    // Mostrar el gráfico después de su creación
    document.getElementById('lineChart').style.display = 'block';
}