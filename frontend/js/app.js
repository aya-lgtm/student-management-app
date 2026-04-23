const studentForm = document.getElementById('studentForm');
const studentList = document.getElementById('studentList');
const searchInput = document.getElementById('searchInput'); // Nouvelle référence

// Stockage local pour le filtrage rapide
let allStudents = [];

// --- FONCTION : Mise à jour des statistiques ---
const updateStats = (students) => {
    const total = students.length;
    const filieres = [...new Set(students.map(s => s.filiere))].length;

    if(document.getElementById('totalCount')) {
        document.getElementById('totalCount').innerText = total;
    }
    if(document.getElementById('filiereCount')) {
        document.getElementById('filiereCount').innerText = filieres;
    }
};

// --- FONCTION : Affichage des étudiants dans le tableau ---
const displayStudents = (students) => {
    studentList.innerHTML = ''; 
    
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><i class="fas fa-user-circle text-secondary me-2"></i>${student.nom}</td>
            <td>${student.email}</td>
            <td><span class="badge border text-dark fw-normal">${student.filiere}</span></td>
            <td><span class="badge bg-info text-dark">Niveau ${student.niveau}</span></td>
            <td class="text-center">
                <button class="btn btn-outline-danger btn-sm" onclick="deleteStudent('${student.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        studentList.appendChild(row);
    });
};

// 1. Fonction pour charger les étudiants depuis l'API
const fetchStudents = async () => {
    try {
        const response = await fetch('/api/students');
        allStudents = await response.json(); // On stocke tout ici
        
        displayStudents(allStudents);
        updateStats(allStudents);

    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
    }
};

// --- NOUVEAUTÉ : Barre de recherche en temps réel ---
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allStudents.filter(student => 
            student.nom.toLowerCase().includes(term) || 
            student.filiere.toLowerCase().includes(term)
        );
        displayStudents(filtered);
    });
}

// 2. Gestion de l'envoi du formulaire (Ajout)
studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newStudent = {
        nom: document.getElementById('nom').value,
        email: document.getElementById('email').value,
        filiere: document.getElementById('filiere').value,
        niveau: parseInt(document.getElementById('niveau').value)
    };

    try {
        const response = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStudent)
        });

        if (response.ok) {
            studentForm.reset();
            fetchStudents();
            
            Swal.fire({
                icon: 'success',
                title: 'Étudiant ajouté !',
                showConfirmButton: false,
                timer: 1500,
                toast: true,
                position: 'top-end'
            });
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi :", error);
    }
});

// 3. Fonction pour supprimer un étudiant
window.deleteStudent = async (id) => {
    Swal.fire({
        title: 'Es-tu sûr ?',
        text: "Tu ne pourras pas revenir en arrière !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer !',
        cancelButtonText: 'Annuler'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await fetch(`/api/students/${id}`, { method: 'DELETE' });
                fetchStudents();
                Swal.fire('Supprimé !', 'L\'étudiant a été retiré.', 'success');
            } catch (error) {
                Swal.fire('Erreur', 'Impossible de supprimer', 'error');
            }
        }
    });
};

// Lancement initial
fetchStudents();