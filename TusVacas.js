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
    let vacaToDelete = null;

    function saveVacas() {
        localStorage.setItem('vacas', JSON.stringify(vacas));
    }

    function renderVacas() {
        vacasList.innerHTML = '';
        vacas.forEach((vaca, index) => {
            const vacaButton = document.createElement('button');
            vacaButton.classList.add('vaca-button');
            vacaButton.innerHTML = `
                <span class="vaca-name">${vaca.name}</span>
                <span class="vaca-amount">Monto: $${vaca.meta || 0}</span>
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
            name: vacaNameInput.value,
            meta: parseFloat(vacaMetaInput.value),
            fecha: vacaFechaInput.value,
            montoTotal: 0
        };

        vacas.push(newVaca);
        saveVacas();
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
        vacas.splice(vacaToDelete, 1);
        saveVacas();
        renderVacas();
        deleteVacaModal.classList.remove('show');
    });

    cancelDeleteVaca.addEventListener('click', () => {
        deleteVacaModal.classList.remove('show');
    });

    renderVacas();
});
