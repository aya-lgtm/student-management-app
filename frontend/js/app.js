const studentForm = document.getElementById('studentForm');
const studentList = document.getElementById('studentList');

// 1. Fonction pour charger les étudiants au démarrage
const fetchStudents = async () => {
    try {
        const response = await fetch('/api/students');
        const students = await response.json();
        
        studentList.innerHTML = ''; // On vide la liste avant de la remplir
        
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.nom}</td>
                <td>${student.email}</td>
                <td>${student.filiere}</td>
                <td><span class="badge bg-info text-dark">Niveau ${student.niveau}</span></td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteStudent('${student.id}')">Supprimer</button>
                </td>
            `;
            studentList.appendChild(row);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
    }
};

// 2. Gestion de l'envoi du formulaire (Ajout)
studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newStudent = {
        nom: document.getElementById('nom').value,
        email: document.getElementById('email').value,
        filiere: document.getElementById('filiere').value,
        niveau: parseInt(document.getElementById('niveau').value),
        telephone: "", // Tu pourras ajouter des champs plus tard
        adresse: ""
    };

    try {
        const response = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStudent)
        });

        if (response.ok) {
            studentForm.reset(); // Vide le formulaire
            fetchStudents();     // Rafraîchit la liste
            alert("Étudiant ajouté avec succès !");
        } else {
            const err = await response.json();
            alert("Erreur : " + err.error);
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi :", error);
    }
});

// 3. Fonction pour supprimer un étudiant
window.deleteStudent = async (id) => {
    if (confirm("Voulez-vous vraiment supprimer cet étudiant ?")) {
        await fetch(`/api/students/${id}`, { method: 'DELETE' });
        fetchStudents();
    }
};

// Charger la liste dès que la page s'affiche
fetchStudents();