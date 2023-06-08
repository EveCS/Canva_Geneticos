
// Función para generar un número aleatorio dentro de un rango dado
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para crear un individuo aleatorio con coordenadas x, y
function createRandomindividuo() {
    const individuo = [];
    const cantidadPuntos = 10; // Número de puntos en el individuo 

    for (let i = 0; i < cantidadPuntos; i++) {
        const point = {
            x: getRandomNumber(0, tamIma), // Rango de coordenadas x 
            y: getRandomNumber(0, tamIma)  // Rango de coordenadas y 
        };
        individuo.push(point);
    }

    return individuo;
}

// Función para calcular la puntuación de un individuo (en este caso, la distancia total entre los puntos)
function calculateFitness(individuo) {
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
    let generacion = 1;
    let poblacion = [];

    // Crear la población inicial
    for (let i = 0; i < tamPoblacion; i++) {
        const individuo = createRandomindividuo();
        poblacion.push(individuo);
    }

    // Iterar hasta alcanzar el máximo de generaciones
    while (generacion <= maxGeneraciones) {
        console.log('Generacion:', generacion);

        // Calcular la puntuación fitness para cada individuo
        for (const individuo of poblacion) {
            individuo.fitness = calculateFitness(individuo);
        }

        // Ordenar la población según la puntuación fitness (en orden ascendente)
        poblacion.sort((a, b) => a.fitness - b.fitness);

        // Mostrar el individuo con la mejor puntuación fitness
        console.log('Mejor individuo:', poblacion[0]);
        console.log('---------------------------');
        console.log('Poblacion:', poblacion);
        console.log('---------------------------');
        console.log('---------------------------');
        // Generar la siguiente generación
        poblacion = crearSigGeneracion(poblacion, puntajeSeleccion, rangoMutacion, rangoCombinacion);

        generacion++;
    }
}

// Ejecutar el algoritmo genético con los parámetros deseados
iniciarAlgGenetico(50, 100, 0.2, 0.1, 0.7);
