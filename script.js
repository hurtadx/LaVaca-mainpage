document.addEventListener("DOMContentLoaded", function () { 
    // Actualizar el conteo 
    function updateVacasCount() {
        const vacas = JSON.parse(localStorage.getItem('vacas')) || [];
        const vacasCount = document.getElementById('vacas-count');
        if (vacasCount) {
            vacasCount.textContent = `${vacas.length} Vacas`;
        }
    }

    updateVacasCount();

    
    const vacaSeleccionada = JSON.parse(localStorage.getItem('vacaSeleccionada'));
    
    console.log('Vaca seleccionada desde localStorage:', vacaSeleccionada); // Depuración

    if (vacaSeleccionada) {
        const montoTotal = vacaSeleccionada.montoTotal || 0;  
        const metaTotal = vacaSeleccionada.meta || 0;        

        // Actualizar el nombre de la vaca
        const vacaNombreElement = document.getElementById('vaca-nombre');
        if (vacaNombreElement) {
            vacaNombreElement.textContent = `Vaca: ${vacaSeleccionada.name || 'Desconocida'}`;
        }

        // Actualizar el monto total y la meta
        const montoTotalElement = document.getElementById('monto-total');
        const progressBarElement = document.getElementById('progress-bar');

        if (montoTotalElement && progressBarElement) {
            // Verifico si los valores son válidos
            if (metaTotal && montoTotal >= 0) {
                montoTotalElement.textContent = `Monto: $${montoTotal.toFixed(2)} / Meta: $${metaTotal.toFixed(2)}`;

                // Calcular porcentaje de progreso
                const porcentaje = metaTotal > 0 ? (montoTotal / metaTotal) * 100 : 0;
                progressBarElement.style.width = `${porcentaje}%`;
            } else {
                console.error('La vaca no tiene valores válidos de monto o meta.');
            }
        }
    } else {
        console.error('No se encontró una vaca seleccionada.');
    }

    // Función para seleccionar una vaca 
    function seleccionarVaca(nombreVaca) {
        // Buscar la vaca seleccionada de la lista de vacas
        const vacas = JSON.parse(localStorage.getItem('vacas')) || [];
        const vacaSeleccionada = vacas.find(vaca => vaca.name === nombreVaca);

        if (vacaSeleccionada) {
            // Guardar la vaca seleccionada en localStorage
            localStorage.setItem('vacaSeleccionada', JSON.stringify(vacaSeleccionada));

     
            updateVacasCount();
        } else {
            console.error('No se encontró la vaca seleccionada.');
        }
    }


});

//fechas 

document.addEventListener("DOMContentLoaded", function () {
    // Obtener la lista de vacas 
    const vacas = JSON.parse(localStorage.getItem('vacas')) || [];

    //  calcular cuál tiene la fecha de pago más cercana
    if (vacas.length > 0) {
        const proximaVaca = obtenerProximoPago(vacas);

        if (proximaVaca) {
            // Mostrar los días restantes para la vaca con la fecha más cercana
            const daysLeftElement = document.querySelector('.days-left');
            if (proximaVaca.diasRestantes === 0) {
                daysLeftElement.textContent = `Hoy es el pago de ${proximaVaca.name}`;
            } else if (proximaVaca.diasRestantes > 0) {
                daysLeftElement.textContent = `Faltan ${proximaVaca.diasRestantes} días (${proximaVaca.name})`;
            } else {
                daysLeftElement.textContent = `La fecha de ${proximaVaca.name} ya pasó`;
            }
        }
    } else {
       
        document.querySelector('.days-left').textContent = 'Sin vacas registradas';
    }

    /**
     * Función para obtener la vaca con la fecha de pago más cercana
     * @param {Array} vacas - Lista de vacas con sus fechas de pago
     * @returns {Object|null} - La vaca más cercana con días restantes
     */
    function obtenerProximoPago(vacas) {
        const fechaActual = new Date();

        // Filtrar vacas con fechas futuras y calcular días restantes
        const vacasConDias = vacas.map(vaca => {
            const fechaPago = new Date(vaca.fecha); // Fecha de la vaca
            const diferenciaTiempo = fechaPago - fechaActual; // Diferencia en milisegundos
            const diasRestantes = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24)); // Convertir a días
            return { ...vaca, diasRestantes };
        });

        // Filtrar solo las vacas con fechas que no hayan pasado y obtener la más cercana
        const vacasFuturas = vacasConDias.filter(v => v.diasRestantes >= 0);
        if (vacasFuturas.length === 0) {
            return null; 
        }

        // Encontrar la vaca con menos días restantes
        return vacasFuturas.reduce((masCercana, vaca) =>
            vaca.diasRestantes < masCercana.diasRestantes ? vaca : masCercana
        );
    }
});



