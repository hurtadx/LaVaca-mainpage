document.addEventListener("DOMContentLoaded", function () {
    const vacasList = document.getElementById('vacas-list');
    const addVacaBtn = document.getElementById('add-vaca-btn');
    const addVacaForm = document.getElementById('add-vaca-form');
    const vacaNameInput = document.getElementById('vaca-name');
    const vacaMetaInput = document.getElementById('vaca-meta');
    const vacaFechaInput = document.getElementById('vaca-fecha');
    const cancelAddVaca = document.getElementById('cancel-add-vaca');
    const deleteVacaModal = document.getElementById('delete-vaca-modal');
    const deleteVacaName = document.getElementById('delete-vaca-name');
    const confirmDeleteVaca = document.getElementById('confirm-delete-vaca');
    const cancelDeleteVaca = document.getElementById('cancel-delete-vaca');

    let vacas = JSON.parse(localStorage.getItem('vacas')) || [];
    let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
    let vacaToDelete = null;

    // Guardar vacas en localStorage
    function saveVacas() {
        localStorage.setItem('vacas', JSON.stringify(vacas));
    }

    // Guardar transacciones en localStorage
    function saveTransacciones() {
        localStorage.setItem('transacciones', JSON.stringify(transacciones));
    }

    // Renderizar las vacas
    function renderVacas() {
        vacasList.innerHTML = '';
        vacas.forEach((vaca, index) => {
            const vacaButton = document.createElement('button');
            vacaButton.classList.add('vaca-button');
            vacaButton.innerHTML = `
                <span class="vaca-name">${vaca.name}</span>
                <span class="vaca-amount">Monto: $${vaca.montoTotal || 0}</span>
                <button class="delete-vaca-btn" data-index="${index}">Eliminar</button>
            `;
            vacaButton.addEventListener('click', () => {
                localStorage.setItem('vacaSeleccionada', JSON.stringify(vaca));
                window.location.href = `Vacas.html?vacaIndex=${index}`;
            });

            vacaButton.querySelector('.delete-vaca-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                openDeleteVacaModal(index);
            });

            vacasList.appendChild(vacaButton);
        });
    }

    addVacaBtn.addEventListener('click', () => {
        document.getElementById('add-vaca-modal').classList.add('show');
    });

    cancelAddVaca.addEventListener('click', () => {
        document.getElementById('add-vaca-modal').classList.remove('show');
    });

    addVacaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newVaca = {
            id: crypto.randomUUID(),  // Generar un ID único para cada vaca
            name: vacaNameInput.value,
            meta: parseFloat(vacaMetaInput.value),
            fecha: vacaFechaInput.value,
            montoTotal: 0
        };

        // Agregar nueva vaca
        vacas.push(newVaca);
        saveVacas();

        // Agregar transacción inicial para la vaca
        transacciones.push({
            vacaId: newVaca.id,  // Asociar transacción con la vaca usando vacaId
            date: new Date().toISOString().split('T')[0],
            type: "Creación",
            amount: 0,
            description: "Vaca creada"
        });
        saveTransacciones();

        renderVacas();

        addVacaForm.reset();
        document.getElementById('add-vaca-modal').classList.remove('show');
    });

    function openDeleteVacaModal(index) {
        vacaToDelete = index;
        deleteVacaName.textContent = `¿Eliminar ${vacas[index].name}?`;
        deleteVacaModal.classList.add('show');
    }

    confirmDeleteVaca.addEventListener('click', () => {
        const vacaEliminada = vacas[vacaToDelete];
        vacas.splice(vacaToDelete, 1);  // Eliminar la vaca
        saveVacas();

        // Eliminar las transacciones relacionadas con esta vaca eliminada
        transacciones = transacciones.filter(t => t.vacaId !== vacaEliminada.id);
        saveTransacciones();

        renderVacas();
        deleteVacaModal.classList.remove('show');
    });

    cancelDeleteVaca.addEventListener('click', () => {
        deleteVacaModal.classList.remove('show');
    });

    renderVacas();
});


