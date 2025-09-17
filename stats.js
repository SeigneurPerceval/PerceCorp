document.addEventListener('DOMContentLoaded', () => {
const data2 = [   // En-têtes
  ["Bendark", 0, 0],
  ["Perceval", 0,0],
  ["Weylax", 0, 0],
  ["Ace", 0, 0]
];
let data3 = [];
let data = [];
// Création du tableau
const table = document.createElement("table");
console.log(table);
classement();

data.unshift(["Classement","Joueur","TOP","FLOP"]);
afficherTableau();
// Fonction pour afficher les données
function afficherTableau() {
  console.log("tableau");
  table.innerHTML = ""; // On vide le tableau avant de le recréer
  console.log("tableau2");
  data.forEach((row, index) => {
    const tr = document.createElement("tr");
    row.forEach(cell => {
      const cellElement = index === 0 ? document.createElement("th") : document.createElement("td");
      cellElement.textContent = cell;
      tr.appendChild(cellElement);
    });
    console.log("tableau3");
    table.appendChild(tr);
  });
  const b = document.getElementById("tab");
  b.appendChild(table);
}
// Fonction pour ajouter une ligne
function ajouterLigne() {
  const nom = document.getElementById("nom").value;
  const matiere = document.getElementById("matiere").value;
  const note = document.getElementById("note").value;

  if (nom && matiere && note) {
    data.push([nom, matiere, note]);
    afficherTableau(); // on réaffiche le tableau
    // vider les champs
    document.getElementById("nom").value = "";
    document.getElementById("matiere").value = "";
    document.getElementById("note").value = "";
  } else {
    alert("Veuillez remplir tous les champs !");
  }
}
//Construction Classement
function classement() {
  for (let aa = 0; aa < data2.length; aa++) {
          const placerole = data2[aa];
          const nom = placerole[0]
          const total = placerole[1]-placerole[2]
          const final = [nom,total];
          data3.push(final);
  }
  data3.sort(function (a, b) {
    if (a[0] > b[0]) {
      return -1;
    } else {
      return 1;
    };
   });
  data3.sort((a, b) => (a[1] < b[1] ? 1 : -1));
  console.log(data3);
  for (let k = 0; k < data3.length; k++) {
    for (let j = 0; j < data2.length; j++) {
      if (data3[k][0] === data2[j][0])
      data.push([k+1,data2[j][0],data2[j][1],data2[j][2]])
      }
    }
}
});
