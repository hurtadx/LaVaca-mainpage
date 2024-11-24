// Variables iniciales
let montoTotal = 0; // Monto actual ahorrado
let metaTotal = 0; // Meta definida por el usuario
let vacaIndex = null; // Índice de la vaca seleccionada

document.addEventListener("DOMContentLoaded", function () {
    const membersList = document.querySelector('.members-list');
    const membersCount = document.getElementById('members-count');

    // Función para actualizar la visualización de miembros
    function updateMembersDisplay() {
        const members = JSON.parse(localStorage.getItem('members')) || [];
        membersList.innerHTML = ''; // Limpiamos el contenido actual

        // Mostrar solo las primeras 3 imágenes de perfil
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

    // Función para actualizar el monto total
    function actualizarMontoTotal() {
        const porcentaje = metaTotal > 0 ? (montoTotal / metaTotal) * 100 : 0;
        document.getElementById('monto-total').textContent = `Monto: $${montoTotal.toFixed(2)} / Meta: $${metaTotal.toFixed(2)}`;
        document.getElementById('progress-bar').style.width = `${porcentaje}%`;
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

