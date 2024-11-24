document.addEventListener("DOMContentLoaded", function () {
    const addMemberButton = document.getElementById('add-member-btn');
    const membersList = document.getElementById('members-list');
    const membersCount = document.getElementById('members-count');

    const editModal = document.getElementById('edit-member-modal');
    const deleteModal = document.getElementById('confirm-delete-modal');
    const addMemberModal = document.getElementById('add-member-modal');

    const editForm = document.getElementById('edit-member-form');
    const addMemberForm = document.getElementById('add-member-form');

    const editNameInput = document.getElementById('edit-name');
    const editPhotoInput = document.getElementById('edit-photo');
    const editAmountInput = document.getElementById('edit-amount');
    const cancelEditButton = document.getElementById('cancel-edit');

    const deleteMemberName = document.getElementById('delete-member-name');
    const confirmDeleteButton = document.getElementById('confirm-delete-btn');
    const cancelDeleteButton = document.getElementById('cancel-delete-btn');

    const newNameInput = document.getElementById('new-name');
    const newPhotoInput = document.getElementById('new-photo');
    const newAmountInput = document.getElementById('new-amount');
    const cancelAddButton = document.getElementById('cancel-add');

    // Cargar miembros desde localStorage
    let members = JSON.parse(localStorage.getItem('members')) || [
        { name: "Usuario Predeterminado", amount: 0, image: "IMG/User.png" }
    ];

    let editingMember = null;
    let deletingMember = null;

    // Renderizar la lista de miembros
    function renderMembers() {
        membersList.innerHTML = '';
        members.forEach((member, index) => {
            const memberCard = document.createElement('div');
            memberCard.classList.add('member-card');
            memberCard.innerHTML = `
                <img src="${member.image}" alt="Miembro">
                <p>${member.name}</p>
                <p>$${member.amount}</p>
                <button class="edit-member-btn">Editar</button>
                <button class="delete-member-btn">Eliminar</button>
            `;

            memberCard.querySelector('.edit-member-btn').addEventListener('click', () => openEditModal(index));
            memberCard.querySelector('.delete-member-btn').addEventListener('click', () => openDeleteModal(index));

            membersList.appendChild(memberCard);
        });
        updateMembersCount();
    }

    // Actualizar el conteo de miembros
    function updateMembersCount() {
        membersCount.textContent = `${members.length} Miembros`;
    }

    // Guardar miembros en localStorage
    function saveMembers() {
        localStorage.setItem('members', JSON.stringify(members));
    }

    function openEditModal(index) {
        editingMember = index;
        const member = members[index];
        editNameInput.value = member.name;
        editAmountInput.value = member.amount;
        editPhotoInput.value = '';
        editModal.classList.add('show');
    }

    function closeEditModal() {
        editingMember = null;
        editModal.classList.remove('show');
    }

    function openDeleteModal(index) {
        deletingMember = index;
        deleteMemberName.textContent = `¿Eliminar a ${members[index].name}?`;
        deleteModal.classList.add('show');
    }

    function closeDeleteModal() {
        deletingMember = null;
        deleteModal.classList.remove('show');
    }

    function openAddMemberModal() {
        addMemberModal.classList.add('show');
    }

    function closeAddMemberModal() {
        addMemberModal.classList.remove('show');
    }

    confirmDeleteButton.addEventListener('click', () => {
        members.splice(deletingMember, 1);
        closeDeleteModal();
        saveMembers();
        renderMembers();
    });

    cancelDeleteButton.addEventListener('click', closeDeleteModal);

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const member = members[editingMember];
        member.name = editNameInput.value;
        member.amount = parseFloat(editAmountInput.value);
        if (editPhotoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                member.image = e.target.result;
                saveMembers();
                renderMembers();
            };
            reader.readAsDataURL(editPhotoInput.files[0]);
        } else {
            saveMembers();
            renderMembers();
        }
        closeEditModal();
    });

    addMemberButton.addEventListener('click', openAddMemberModal);

    addMemberForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newMember = {
            name: newNameInput.value,
            amount: parseFloat(newAmountInput.value),
            image: "IMG/User.png"
        };
        members.push(newMember);
        saveMembers();
        closeAddMemberModal();
        renderMembers();
    });

    cancelAddButton.addEventListener('click', closeAddMemberModal);

    renderMembers();
});

