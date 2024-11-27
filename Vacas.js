// Variables iniciales
let montoTotal = 0; // Monto actual ahorrado
let metaTotal = 0; // Meta definida por el usuario
let vacaIndex = null; // Índice de la vaca seleccionada

document.addEventListener("DOMContentLoaded", function () {
    const membersList = document.querySelector('.members-list');
    const membersCount = document.getElementById('members-count');

   // Función para actualizar la visualización de miembros
function updateMembersDisplay() {
    // Obtener la vaca seleccionada
    const vacaSeleccionada = JSON.parse(localStorage.getItem("vacaSeleccionada"));
    if (!vacaSeleccionada) {
        console.error("No se encontró una vaca seleccionada.");
        return;
    }

    // Cargar los miembros específicos de la vaca seleccionada
    const members = JSON.parse(localStorage.getItem(`miembros_${vacaSeleccionada.id}`)) || [];
    
    // Limpiar contenido previo
    const membersList = document.querySelector('.members-list');
    const membersCount = document.getElementById('members-count');
    membersList.innerHTML = '';

    // Mostrar las primeras tres imágenes de perfil
    members.slice(0, 3).forEach(member => {
        const memberImg = document.createElement('img');
        memberImg.src = member.image;
        memberImg.alt = 'Miembro';
        memberImg.classList.add('member-profile');
        membersList.appendChild(memberImg);
    });

    // Actualizar el conteo total de miembros
    membersCount.textContent = `${members.length} Miembros`;
}


// Llama a la función después de cargar la página o cuando se actualizan los datos
document.addEventListener("DOMContentLoaded", updateMembersDisplay);


    updateMembersDisplay();

    // Obtener el índice de la vaca seleccionada desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    vacaIndex = parseInt(urlParams.get('vacaIndex'), 10);
    let vacas = JSON.parse(localStorage.getItem('vacas')) || [];

    if (!isNaN(vacaIndex) && vacas[vacaIndex]) {
        const vaca = vacas[vacaIndex];
        document.getElementById('vaca-name').textContent = vaca.name;

        // Guardar la vaca seleccionada en localStorage
        localStorage.setItem('vacaSeleccionada', JSON.stringify(vaca));
        metaTotal = vaca.meta; // Asignamos la meta de la vaca seleccionada
        montoTotal = vaca.montoTotal || 0; // Aseguramos que el monto total no sea null

        // Actualizamos los valores
        actualizarMontoTotal();
    } else {
        console.warn('Vaca no encontrada o índice inválido.');
    }

    function actualizarMontoTotal(monto = 0) {
        // Obtener la vaca seleccionada desde localStorage
        const vacaSeleccionada = JSON.parse(localStorage.getItem("vacaSeleccionada")) || null;
        if (!vacaSeleccionada) {
            console.error("No se encontró una vaca seleccionada.");
            return;
        }
    
        // Obtener el monto total actual de la vaca
        const montoTotalActual = vacaSeleccionada.montoTotal || 0;
        const metaTotal = vacaSeleccionada.metaTotal || 0;
    
        // Actualizar el monto total con el monto ingresado
        vacaSeleccionada.montoTotal = montoTotalActual + monto;
    
        // Guardar los cambios en localStorage
        localStorage.setItem("vacaSeleccionada", JSON.stringify(vacaSeleccionada));
    
        // Calcular el porcentaje de progreso
        const porcentaje = metaTotal > 0 ? (vacaSeleccionada.montoTotal / metaTotal) * 100 : 0;
    
        // Actualizar la interfaz con el nuevo monto y porcentaje
        document.getElementById('monto-total').textContent = `Monto: $${vacaSeleccionada.montoTotal.toFixed(2)} / Meta: $${metaTotal.toFixed(2)}`;
        document.getElementById('progress-bar').style.width = `${porcentaje}%`;
    
        // Registrar la transacción
        registrarTransaccion(monto);
    }
    
    // Función para registrar la transacción
    function registrarTransaccion(monto) {
        // Obtener la vaca seleccionada desde localStorage
        const vacaSeleccionada = JSON.parse(localStorage.getItem("vacaSeleccionada")) || null;
        if (!vacaSeleccionada) {
            console.error("No se encontró una vaca seleccionada.");
            return;
        }
    
        // Crear una nueva transacción
        const transaccion = {
            monto: monto,
            tipo: "Ingreso", // En este caso es un ingreso
            fecha: new Date().toISOString()
        };
    
        // Obtener las transacciones de la vaca
        const transacciones = vacaSeleccionada.transacciones || [];
    
        // Agregar la nueva transacción
        transacciones.push(transaccion);
    
        // Guardar las transacciones actualizadas en localStorage
        vacaSeleccionada.transacciones = transacciones;
        localStorage.setItem("vacaSeleccionada", JSON.stringify(vacaSeleccionada));
    }
    

    // Función para guardar cambios en el monto total
    function guardarCambios() {
        const vacaSeleccionada = JSON.parse(localStorage.getItem('vacaSeleccionada'));
        if (vacaSeleccionada) {
            vacaSeleccionada.montoTotal = montoTotal; // Actualizamos el monto total
            localStorage.setItem('vacaSeleccionada', JSON.stringify(vacaSeleccionada));

            // También actualizamos la lista general de vacas
            let vacas = JSON.parse(localStorage.getItem('vacas')) || [];
            if (!isNaN(vacaIndex) && vacas[vacaIndex]) {
                vacas[vacaIndex] = vacaSeleccionada; // Actualizamos la vaca en la lista
                localStorage.setItem('vacas', JSON.stringify(vacas));
            }
        }
    }

    // Modales y botones flotantes
    const floatingButton = document.querySelector('.floating-button');
    const addButton = document.createElement('button');
    addButton.textContent = '+';
    addButton.className = 'floating-button add-button hidden';

    const subtractButton = document.createElement('button');
    subtractButton.textContent = '-';
    subtractButton.className = 'floating-button subtract-button hidden';

    const floatingContainer = document.querySelector('.floating-container');
    floatingContainer.appendChild(addButton);
    floatingContainer.appendChild(subtractButton);

    let isExpanded = false;

    floatingButton.addEventListener('click', function () {
        if (isExpanded) {
            addButton.classList.add('hidden');
            subtractButton.classList.add('hidden');
            floatingButton.textContent = '+';
        } else {
            addButton.classList.remove('hidden');
            subtractButton.classList.remove('hidden');
            floatingButton.textContent = 'x';
        }
        isExpanded = !isExpanded;
    });

    const modalIngresar = document.getElementById('modal-ingresar');
    const modalRetirar = document.getElementById('modal-retirar');
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    document.body.appendChild(backdrop);

    addButton.addEventListener('click', function () {
        modalIngresar.classList.add('visible');
        backdrop.classList.add('visible');
    });

    subtractButton.addEventListener('click', function () {
        modalRetirar.classList.add('visible');
        backdrop.classList.add('visible');
    });

    function cerrarModal(modal) {
        modal.classList.remove('visible');
        backdrop.classList.remove('visible');
    }

    document.getElementById('confirmar-ingreso').addEventListener('click', function () {
        const monto = parseFloat(document.getElementById('ingresar-monto').value);
        if (isNaN(monto) || monto <= 0) {
            console.error('Cantidad no válida');
            cerrarModal(modalIngresar);
            return;
        }

        if (montoTotal + monto > metaTotal) {
            console.error('No puedes ingresar más dinero que la meta establecida');
            cerrarModal(modalIngresar);
            return;
        }

        montoTotal += monto;
        guardarCambios();
        actualizarMontoTotal();
        cerrarModal(modalIngresar);
    });

    document.getElementById('confirmar-retiro').addEventListener('click', function () {
        const monto = parseFloat(document.getElementById('retirar-monto').value);
        if (isNaN(monto) || monto <= 0 || monto > montoTotal) {
            console.error('Cantidad no válida o insuficiente');
            cerrarModal(modalRetirar);
            return;
        }

        montoTotal -= monto;
        guardarCambios();
        actualizarMontoTotal();
        cerrarModal(modalRetirar);
    });

    document.getElementById('cancelar-ingreso').addEventListener('click', () => cerrarModal(modalIngresar));
    document.getElementById('cancelar-retiro').addEventListener('click', () => cerrarModal(modalRetirar));
});

// fechas

document.addEventListener("DOMContentLoaded", function () {
    const vacaIndex = new URLSearchParams(window.location.search).get('vacaIndex');
    const vacas = JSON.parse(localStorage.getItem('vacas')) || [];
    const vacaSeleccionada = vacas[vacaIndex];

    if (vacaSeleccionada) {
        // Actualizamos el botón "Próximo Pago" con los días restantes
        actualizarProximoPago(vacaSeleccionada.fecha);

        // Actualizamos el botón "Monto Total" con el monto y meta
        actualizarMontoTotal(vacaSeleccionada.montoTotal, vacaSeleccionada.meta);
    } else {
        console.warn('Vaca no encontrada o índice inválido.');
    }

    // Función para actualizar el botón "Próximo Pago"
    function actualizarProximoPago(fechaPago) {
        const fechaActual = new Date(); // Fecha actual
        const fechaLimite = new Date(fechaPago); // Fecha de pago de la vaca
        const diferenciaTiempo = fechaLimite - fechaActual; // Diferencia en milisegundos
        const diasRestantes = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24)); // Convertimos a días

        // Seleccionamos únicamente el texto del botón "Próximo Pago"
        const proximoPagoTexto = document.getElementById('dias-restantes');
        if (diasRestantes > 0) {
            proximoPagoTexto.textContent = `Faltan ${diasRestantes} días`;
        } else if (diasRestantes === 0) {
            proximoPagoTexto.textContent = 'El pago es hoy';
        } else {
            proximoPagoTexto.textContent = 'La fecha de pago ya pasó';
        }
    }

    // Función para actualizar el botón "Monto Total"
    function actualizarMontoTotal(monto, meta) {
        const porcentaje = meta > 0 ? (monto / meta) * 100 : 0;

        
        document.getElementById('monto-total').textContent = `Monto: $${monto.toFixed(2)} / Meta: $${meta.toFixed(2)}`;
        document.getElementById('progress-bar').style.width = `${porcentaje}%`;
    }
});


//transacciones y estadisticas


document.addEventListener("DOMContentLoaded", function () {
    const vacaIndex = new URLSearchParams(window.location.search).get('vacaIndex');
    const vacas = JSON.parse(localStorage.getItem('vacas')) || [];
    let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
    const vacaSeleccionada = vacas[vacaIndex];

    if (!vacaSeleccionada) {
        console.warn("Vaca no encontrada.");
        return;
    }

    // Mostrar detalles de la vaca seleccionada
    document.getElementById('vaca-name').textContent = vacaSeleccionada.name;
    document.getElementById('monto-total').textContent = `Monto: $${vacaSeleccionada.montoTotal.toFixed(2)} / Meta: $${vacaSeleccionada.meta.toFixed(2)}`;
    const porcentaje = (vacaSeleccionada.montoTotal / vacaSeleccionada.meta) * 100;
    document.getElementById('progress-bar').style.width = `${porcentaje}%`;

    // Función para actualizar transacciones en el HTML
    function actualizarTransacciones() {
        const transactionsList = document.querySelector('.transactions-list ul');
        const vacaTransacciones = transacciones.filter(t => t.vacaId === vacaSeleccionada.id);

        transactionsList.innerHTML = ''; // Limpia la lista
        vacaTransacciones.forEach(t => {
            const listItem = document.createElement('li');
            listItem.textContent = `${t.date}: ${t.type} - $${t.amount} (${t.description})`;
            transactionsList.appendChild(listItem);
        });
    }

    // Llama a actualizarTransacciones al cargar la página
    actualizarTransacciones();

    // Confirmar ingreso
    document.getElementById('confirmar-ingreso').addEventListener('click', function () {
        const monto = parseFloat(document.getElementById('ingresar-monto').value);
        if (isNaN(monto) || monto <= 0 || monto + vacaSeleccionada.montoTotal > vacaSeleccionada.meta) {
            console.error('Cantidad no válida o supera la meta.');
            return;
        }

        vacaSeleccionada.montoTotal += monto;
        guardarCambios();

        // Registrar transacción
        transacciones.push({
            vacaId: vacaSeleccionada.id,
            date: new Date().toISOString().split('T')[0],
            type: "Ingreso",
            amount: monto,
            description: "Ingreso de fondos"
        });
        localStorage.setItem('transacciones', JSON.stringify(transacciones));

        actualizarTransacciones();
        cerrarModal(document.getElementById('modal-ingresar'));
    });

    // Confirmar retiro
    document.getElementById('confirmar-retiro').addEventListener('click', function () {
        const monto = parseFloat(document.getElementById('retirar-monto').value);
        if (isNaN(monto) || monto <= 0 || monto > vacaSeleccionada.montoTotal) {
            console.error('Cantidad no válida o insuficiente.');
            return;
        }

        vacaSeleccionada.montoTotal -= monto;
        guardarCambios();

        // Registrar transacción
        transacciones.push({
            vacaId: vacaSeleccionada.id,
            date: new Date().toISOString().split('T')[0],
            type: "Retiro",
            amount: monto,
            description: "Retiro de fondos"
        });
        localStorage.setItem('transacciones', JSON.stringify(transacciones));

        actualizarTransacciones();
        cerrarModal(document.getElementById('modal-retirar'));
    });

    function guardarCambios() {
        const vacas = JSON.parse(localStorage.getItem('vacas')) || [];
        vacas[vacaIndex] = vacaSeleccionada;
        localStorage.setItem('vacas', JSON.stringify(vacas));
    }
});

//estadisticas 

document.addEventListener("DOMContentLoaded", function () {
    const vacaIndex = new URLSearchParams(window.location.search).get('vacaIndex');
    const vacas = JSON.parse(localStorage.getItem('vacas')) || [];
    const transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
    const vacaSeleccionada = vacas[vacaIndex];

    if (!vacaSeleccionada) {
        console.warn("Vaca no encontrada.");
        return;
    }

    // Mostrar detalles de la vaca seleccionada
    document.getElementById('vaca-name').textContent = vacaSeleccionada.name;
    document.getElementById('monto-total').textContent = `Monto: $${vacaSeleccionada.montoTotal.toFixed(2)} / Meta: $${vacaSeleccionada.meta.toFixed(2)}`;
    const porcentaje = (vacaSeleccionada.montoTotal / vacaSeleccionada.meta) * 100;
    document.getElementById('progress-bar').style.width = `${porcentaje}%`;

    // Calcular porcentaje aportado por cada miembro
    function calcularPorcentajes() {
        const miembrosVaca = JSON.parse(localStorage.getItem(`miembros_${vacaSeleccionada.id}`)) || [];
        
        let totalAportado = 0;
        miembrosVaca.forEach(member => {
            totalAportado += member.amount;
        });

        return miembrosVaca.map(member => ({
            name: member.name,
            amount: member.amount,
            percentage: (member.amount / totalAportado) * 100
        }));
    }

    // Actualizar gráficos
    function actualizarEstadisticas() {
        const porcentajeMiembros = calcularPorcentajes();

        // Crear el gráfico tipo pastel
        const ctx = document.getElementById('pie-chart').getContext('2d');
        ctx.width = 20;  // Establecer ancho
ctx.height = 20; // Establecer altura

        const pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: porcentajeMiembros.map(m => m.name),
                datasets: [{
                    data: porcentajeMiembros.map(m => m.percentage),
                    backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#F9A8D4', '#F7D03C'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2) + '%';
                            }
                        }
                    }
                }
            }
        });

        // Crear el gráfico lineal (por evolución del ahorro)
        const ctxLine = document.getElementById('line-chart').getContext('2d');
        const lineChart = new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: transacciones.filter(t => t.vacaId === vacaSeleccionada.id).map(t => t.date), // Fechas de las transacciones
                datasets: [{
                    label: 'Monto Total Ahorro',
                    data: transacciones.filter(t => t.vacaId === vacaSeleccionada.id).map(t => t.amount),
                    borderColor: '#33FF57',
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { 
                        type: 'category',
                        title: { display: true, text: 'Fecha' }
                    },
                    y: {
                        title: { display: true, text: 'Monto Ahorro' },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Llamar a la función para actualizar las estadísticas
    actualizarEstadisticas();
});





