// Investigar open cv para pintar los puntos de coordenadas

const image = document.getElementById("myImage");
const btnInicio = document.getElementById("dibujar");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const strokeWidthInput = document.getElementById("strokeWidth");


/**
 * Description placeholder
 * @date 6/6/2023 - 8:40:46
 *
 * @param {*} dna
 * @param {*} objetivo
 * @returns {number}
 */
function fitness(dna, objetivo) {
    // Calcula la puntuación de fitness de un ADN basada en la cantidad de números de la lista objetivo que coinciden
    let puntaje = 0;
    for (let i = 0; i < objetivo.length; i++) {
        if (dna[i] === objetivo[i]) {
            puntaje += 1;
        }
    }
    return puntaje / objetivo.length;
}


/**
 * Description placeholder
 * @date 6/6/2023 - 8:40:58
 *
 * @param {*} padreUno
 * @param {*} padreDos
 * @returns {{}}
 */
function reproduce(padreUno, padreDos) {
    // Produce un hijo recombinando los genes de los dos padres
    let hijo = [];
    for (let i = 0; i < padreUno.length; i++) {
        if (Math.random() < 0.5) {
            hijo.push(padreUno[i]);
        } else {
            hijo.push(padreDos[i]);
        }
    }
    return hijo;
}


/**
 * Description placeholder
 * @date 6/6/2023 - 8:41:06
 *
 * @param {*} dna
 * @param {*} rangoMutacion
 * @returns {{}}
 */
function mutar(dna, rangoMutacion) {
    // Aplica mutaciones aleatorias a un ADN
    let dnaMutado = [];
    for (let i = 0; i < dna.length; i++) {
        if (Math.random() < rangoMutacion) {
            dnaMutado.push(Math.floor(Math.random() * 1000) + 1);
        } else {
            dnaMutado.push(dna[i]);
        }
    }
    return dnaMutado;
}


/**
 * Description placeholder
 * @date 6/6/2023 - 8:41:25
 *
 * @param {*} objetivo
 * @param {*} tamPoblacion
 * @param {*} rangoMutacion
 * @returns {{}}
 */
function algoritmoGenetico(objetivo, tamPoblacion, rangoMutacion) {
    // Ejecuta un algoritmo genético para encontrar una lista de ADN que coincida con la lista objetivo.
    // Generar la población inicial de ADN como arreglos de números aleatorios
    let poblacion = [];
    for (let i = 0; i < tamPoblacion; i++) {
        let dna = [];
        for (let j = 0; j < objetivo.length; j++) {
            dna.push(Math.floor(Math.random() * 1000) + 1);
        }
        poblacion.push(dna);
    }

    // Bucle principal del algoritmo genético
    let generacion = 0;
    while (true) {
        // Calcular puntuaciones de fitness de la población
        let puntajes = poblacion.map((dna) => fitness(dna, objetivo));
        // Si encontramos una lista de ADN que coincide con la lista objetivo, salir del bucle principal y devolverla
        if (Math.max(...puntajes) === 1) {
            let index = puntajes.indexOf(1);
            return [poblacion[index], generacion];
        }
        // Seleccionar los padres para la siguiente generación a través de selección natural
        let indexPadres = [];
        for (let i = 0; i < 2; i++) {
            let weights = puntajes.map((puntaje) => puntaje ** 2);
            let index = randomChoice(weights);
            indexPadres.push(index);
        }
        // Reproducir los padres para crear la siguiente generación
        let padreUno = poblacion[indexPadres[0]];
        let padreDos = poblacion[indexPadres[1]];
        let hijo = reproduce(padreUno, padreDos);
        // Aplicar mutaciones a la siguiente generación
        hijo = mutar(hijo, rangoMutacion);
        // Reemplazar un miembro de la población con el nuevo hijo
        let index = Math.floor(Math.random() * poblacion.length);
        poblacion[index] = hijo;
        // Incrementar la generación y continuar el bucle principal
        generacion += 1;
        //console.log('Generacion: ', generacion, ' Hijo: ', hijo);
    }
}


/**
 * Description placeholder
 * @date 6/6/2023 - 8:41:40
 *
 * @param {*} items
 * @returns {number}
 */
function randomChoice(items) {
    // Elige un elemento aleatorio de la lista de items basado en los pesos proporcionados
    let sum = items.reduce((a, b) => a + b, 0);
    let rand = Math.random() * sum;
    let cumulativeProb = 0;
    for (let i = 0; i < items.length; i++) {
        cumulativeProb += items[i];
        if (rand <= cumulativeProb) {
            return i;
        }
    }
}


/* ----------------------------- PINTADO CANVAS | EVE ------------------------------------------ */

// JavaScript code para obtener los píxeles negros de la imagen y pintarlos en el canvas

btnInicio.addEventListener("click", () => {
    canvas.width = image.width;
    canvas.height = image.height;

    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const blackPixels = [];

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const pixelIndex = (y * canvas.width + x) * 4;
            const red = data[pixelIndex];
            const green = data[pixelIndex + 1];
            const blue = data[pixelIndex + 2];
            const alpha = data[pixelIndex + 3];

            if (red === 0 && green === 0 && blue === 0 && alpha === 255) {
                blackPixels.push({ x, y });
            }
        }
    }

    // Función para pintar los píxeles negros en el canvas con el grosor de trazo especificado
    function paintPixels(pixels, strokeWidth) {
        const halfStrokeWidth = strokeWidth / 2;

        context.fillStyle = "black";
        context.imageSmoothingEnabled = true;

        for (let i = 0; i < pixels.length; i++) {
            const { x, y } = pixels[i];
            context.fillRect(
                x - halfStrokeWidth,
                y - halfStrokeWidth,
                strokeWidth,
                strokeWidth
            );
        }
    }

    const initialStrokeWidth = parseInt(strokeWidthInput.value);
    paintPixels(blackPixels, initialStrokeWidth);

    // Actualizar el grosor del trazo al cambiar el valor del input
    strokeWidthInput.addEventListener("change", () => {
        const strokeWidth = parseInt(strokeWidthInput.value);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);
        paintPixels(blackPixels, strokeWidth);
    });
});


/** .------------- PRUEBA GENETICO -----------------. */
// Iniciar con lista dada como objetivo
let listaObj = [100, 23, 4, 56, 123, 456];
let resultado, generaciones;
[resultado, generaciones] = algoritmoGenetico(listaObj, 100, 0.01);
console.log('Objetivo:', listaObj);
console.log('Resultado hijo:', resultado);
console.log('generaciones: ', generaciones);
