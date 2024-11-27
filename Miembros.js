document.addEventListener("DOMContentLoaded", function () {
    const addMemberButton = document.getElementById("add-member-btn");
    const membersList = document.getElementById("members-list");

    const editModal = document.getElementById("edit-member-modal");
    const deleteModal = document.getElementById("confirm-delete-modal");
    const addMemberModal = document.getElementById("add-member-modal");

    const editForm = document.getElementById("edit-member-form");
    const addMemberForm = document.getElementById("add-member-form");

    const editNameInput = document.getElementById("edit-name");
    const editPhotoInput = document.getElementById("edit-photo");
    const editAmountInput = document.getElementById("edit-amount");
    const cancelEditButton = document.getElementById("cancel-edit");

    const deleteMemberName = document.getElementById("delete-member-name");
    const confirmDeleteButton = document.getElementById("confirm-delete-btn");
    const cancelDeleteButton = document.getElementById("cancel-delete-btn");

    const newNameInput = document.getElementById("new-name");
    const newPhotoInput = document.getElementById("new-photo");
    const newAmountInput = document.getElementById("new-amount");
    const cancelAddButton = document.getElementById("cancel-add");

    const vacaSeleccionada = JSON.parse(localStorage.getItem("vacaSeleccionada")) || null;
    if (!vacaSeleccionada) {
        console.error("No se encontró una vaca seleccionada.");
        return;
    }

    let vacaMiembros = JSON.parse(localStorage.getItem(`miembros_${vacaSeleccionada.id}`)) || [];
    let editingMemberIndex = null;
    let deletingMemberIndex = null;

    function saveMembers() {
        localStorage.setItem(`miembros_${vacaSeleccionada.id}`, JSON.stringify(vacaMiembros));
    }

    function guardarCambiosVaca() {
        const vacas = JSON.parse(localStorage.getItem("vacas")) || [];
        const vacaIndex = vacas.findIndex((v) => v.id === vacaSeleccionada.id);
        if (vacaIndex !== -1) {
            vacas[vacaIndex] = vacaSeleccionada;
            localStorage.setItem("vacas", JSON.stringify(vacas));
        }
    }

    function registrarTransaccion(monto, descripcion) {
        const transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];
        transacciones.push({
            vacaId: vacaSeleccionada.id,
            date: new Date().toISOString().split("T")[0],
            type: "Ingreso",
            amount: monto,
            description: descripcion,
        });
        localStorage.setItem("transacciones", JSON.stringify(transacciones));
    }

    function renderMembers() {
        membersList.innerHTML = "";

        vacaMiembros.forEach((member, index) => {
            const memberCard = document.createElement("div");
            memberCard.classList.add("member-card");
            memberCard.innerHTML = `
                <img src="${member.image}" alt="Miembro">
                <p>${member.name}</p>
                <p>$${member.amount.toFixed(2)}</p>
                <button class="edit-member-btn" data-index="${index}">Editar</button>
                <button class="delete-member-btn" data-index="${index}">Eliminar</button>
            `;

            membersList.appendChild(memberCard);
        });

        document.querySelectorAll(".edit-member-btn").forEach((btn) => {
            btn.addEventListener("click", () => openEditModal(btn.dataset.index));
        });

        document.querySelectorAll(".delete-member-btn").forEach((btn) => {
            btn.addEventListener("click", () => openDeleteModal(btn.dataset.index));
        });

        const totalDisplay = document.getElementById("total-monto-display");
        if (totalDisplay) {
            totalDisplay.textContent = `$${vacaSeleccionada.montoTotal?.toFixed(2) || 0}`;
        }
    }

    function openEditModal(index) {
        editingMemberIndex = index;
        const member = vacaMiembros[index];
        editNameInput.value = member.name;
        editAmountInput.value = member.amount;
        editPhotoInput.value = "";
        editModal.classList.add("show");
    }

    function closeEditModal() {
        editingMemberIndex = null;
        editModal.classList.remove("show");
    }

    function openDeleteModal(index) {
        deletingMemberIndex = index;
        deleteMemberName.textContent = `¿Eliminar a ${vacaMiembros[index].name}?`;
        deleteModal.classList.add("show");
    }

    function closeDeleteModal() {
        deletingMemberIndex = null;
        deleteModal.classList.remove("show");
    }

    function openAddMemberModal() {
        addMemberModal.classList.add("show");
    }

    function closeAddMemberModal() {
        addMemberModal.classList.remove("show");
    }

    confirmDeleteButton.addEventListener("click", () => {
        vacaMiembros.splice(deletingMemberIndex, 1);
        saveMembers();
        renderMembers();
        closeDeleteModal();
    });

    cancelDeleteButton.addEventListener("click", closeDeleteModal);

    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const member = vacaMiembros[editingMemberIndex];
        member.name = editNameInput.value;
        member.amount = parseFloat(editAmountInput.value);

        if (editPhotoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                member.image = event.target.result;
                saveMembers();
                renderMembers();
                closeEditModal();
            };
            reader.readAsDataURL(editPhotoInput.files[0]);
        } else {
            saveMembers();
            renderMembers();
            closeEditModal();
        }
    });

    addMemberButton.addEventListener("click", openAddMemberModal);

    addMemberForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const newMember = {
            name: newNameInput.value,
            amount: parseFloat(newAmountInput.value),
            image: "IMG/User.png"
        };

        if (newPhotoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                newMember.image = event.target.result;
                agregarMiembro(newMember);
            };
            reader.readAsDataURL(newPhotoInput.files[0]);
        } else {
            agregarMiembro(newMember);
        }

        closeAddMemberModal();
    });

    function agregarMiembro(member) {
        vacaMiembros.push(member);
        saveMembers();

        vacaSeleccionada.montoTotal = (vacaSeleccionada.montoTotal || 0) + member.amount;
        guardarCambiosVaca();

        registrarTransaccion(member.amount, `Monto inicial del miembro: ${member.name}`);

        renderMembers();
    }

    cancelAddButton.addEventListener("click", closeAddMemberModal);

    renderMembers();
});







