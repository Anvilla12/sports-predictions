// =======================
// 1. Array de equipos NBA
// =======================
const nbaTeams = [
  { code: "ATL", name: "Atlanta Hawks", shortName: "Hawks", background: "#E03A3E" },
  { code: "BOS", name: "Boston Celtics", shortName: "Celtics", background: "#007A33" },
  { code: "BKN", name: "Brooklyn Nets", shortName: "Nets", background: "#000000" },
  { code: "CHA", name: "Charlotte Hornets", shortName: "Hornets", background: "#1D1160" },
  { code: "CHI", name: "Chicago Bulls", shortName: "Bulls", background: "#CE1141" },
  { code: "CLE", name: "Cleveland Cavaliers", shortName: "Cavaliers", background: "#860038" },
  { code: "DAL", name: "Dallas Mavericks", shortName: "Mavericks", background: "#00538C" },
  { code: "DEN", name: "Denver Nuggets", shortName: "Nuggets", background: "#0E2240" },
  { code: "DET", name: "Detroit Pistons", shortName: "Pistons", background: "#C8102E" },
  { code: "GSW", name: "Golden State Warriors", shortName: "Warriors", background: "#1D428A" },
  { code: "HOU", name: "Houston Rockets", shortName: "Rockets", background: "#CE1141" },
  { code: "IND", name: "Indiana Pacers", shortName: "Pacers", background: "#002D62" },
  { code: "LAC", name: "Los Angeles Clippers", shortName: "Clippers", background: "#C8102E" },
  { code: "LAL", name: "Los Angeles Lakers", shortName: "Lakers", background: "#552583" },
  { code: "MEM", name: "Memphis Grizzlies", shortName: "Grizzlies", background: "#5D76A9" },
  { code: "MIA", name: "Miami Heat", shortName: "Heat", background: "#98002E" },
  { code: "MIL", name: "Milwaukee Bucks", shortName: "Bucks", background: "#00471B" },
  { code: "MIN", name: "Minnesota Timberwolves", shortName: "Timberwolves", background: "#0C2340" },
  { code: "NO",  name: "New Orleans Pelicans", shortName: "Pelicans", background: "#0C2340" },
  { code: "NY", name: "New York Knicks", shortName: "Knicks", background: "#F58426" },
  { code: "OKC", name: "Oklahoma City Thunder", shortName: "Thunder", background: "#007AC1" },
  { code: "ORL", name: "Orlando Magic", shortName: "Magic", background: "#0077C0" },
  { code: "PHI", name: "Philadelphia 76ers", shortName: "76ers", background: "#006BB6" },
  { code: "PHX", name: "Phoenix Suns", shortName: "Suns", background: "#1D1160" },
  { code: "POR", name: "Portland Trail Blazers", shortName: "Trail Blazers", background: "#E03A3E" },
  { code: "SAC", name: "Sacramento Kings", shortName: "Kings", background: "#5A2D81" },
  { code: "SAS", name: "San Antonio Spurs", shortName: "Spurs", background: "#C4CED4" },
  { code: "TOR", name: "Toronto Raptors", shortName: "Raptors", background: "#CE1141" },
  { code: "UTAH", name: "Utah Jazz", shortName: "Jazz", background: "#002B5C" },
  { code: "WAS", name: "Washington Wizards", shortName: "Wizards", background: "#002B5C" }
];

// ================================================
// 2. Función: Obtener partidos de la semana y crear el menú
// ================================================
async function getWeeklyGames() {
  const url = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard";
  try {
    const response = await fetch(url);
    const data = await response.json();
    // Calcular inicio (domingo) y fin (sábado) de la semana actual
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const dropdownMenu = document.querySelector(".dropdown-menu");
    dropdownMenu.innerHTML = ""; // Limpiar contenido previo

    let firstGameId = null;
    // Iterar por cada evento y filtrar los de esta semana
    data.events.forEach(event => {
      const gameDate = new Date(event.date);
      if (gameDate >= startOfWeek && gameDate <= endOfWeek) {
        // Formatear la fecha: "01 Enero"
        const formattedDate = gameDate.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "long"
        });
        const dateParts = formattedDate.split(" ");
        const day = dateParts[0];
        const month = dateParts[2].charAt(0).toUpperCase() + dateParts[2].slice(1,3);
        const finalDate = `${day} ${month}`;
        // Hora en formato 24 hrs
        const time = gameDate.toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });
        // Extraer el id del juego (usando el id de la competencia)
        const gameId = event.competitions[0].id;
        if (!firstGameId) {
          firstGameId = gameId;
        }
        // Extraer información de los equipos
        const teams = event.competitions[0].competitors;
        const team1 = teams[0].team;
        const team2 = teams[1].team;
        // Crear el ítem del dropdown con data-id
        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <a class="dropdown-item text-light fw-semibold d-flex justify-content-evenly align-items-center" href="#" data-id="${gameId}">
            <img src="${team1.logo}" width="24" height="24" alt="${team1.shortDisplayName}" class="me-2">
            ${team1.abbreviation} vs ${team2.abbreviation}
            <img src="${team2.logo}" width="24" height="24" alt="${team2.shortDisplayName}" class="ms-2 me-1">
            <span class="fw-normal mt-2" style="font-size: 70%;"> ${finalDate} <span style="font-size: 75%;">${time}hrs</span></span>
          </a>
        `;
        dropdownMenu.appendChild(listItem);
        // Agregar separador
        const hr = document.createElement("hr");
        hr.className = "m-1 text-light";
        dropdownMenu.appendChild(hr);
      }
    });
    // Remover el último separador, si existe
    if (dropdownMenu.lastChild && dropdownMenu.lastChild.tagName === "HR") {
      dropdownMenu.removeChild(dropdownMenu.lastChild);
    }
    // Si se encontró al menos un juego, cargar por defecto el primero.
    if (firstGameId) {
      getNBAScore(firstGameId);
      startAutoRefresh(firstGameId);
    }
  } catch (error) {
    console.error("Error al obtener los partidos:", error);
  }
}

// ===================================================
// 3. Función: Obtener información del partido (Summary)
// ===================================================
async function getNBAScore(eventId) {
  if (!eventId) {
    console.warn("No se proporcionó id de evento");
    return;
  }
  try {
    const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${eventId}`);
    const data = await response.json();
    if (data.header.competitions.length > 0) {
      const game = data.header.competitions[0];
      const homeTeam = game.competitors[0];
      const awayTeam = game.competitors[1];
      const status = game.status;
      
      // Actualizar nombres completos de los equipos en la tabla
      document.getElementById("tableTeamLocal").textContent = data.header.competitions[0].competitors[0].team.displayName;
      document.getElementById("tableTeamVisitor").textContent = data.header.competitions[0].competitors[1].team.displayName;
      
      // Actualizar logos en desktop
      document.getElementById("logoA").src = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${homeTeam.team.abbreviation}.png`;
      document.getElementById("logoB").src = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${awayTeam.team.abbreviation}.png`;
      
      // Actualizar abreviaturas (desktop)
      document.getElementById("nameA").textContent = homeTeam.team.abbreviation;
      document.getElementById("nameB").textContent = awayTeam.team.abbreviation;
      
      // Actualizar puntajes (desktop)
      document.getElementById("scoreA").textContent = homeTeam.score;
      document.getElementById("scoreB").textContent = awayTeam.score;
      
      // Actualizar estado del juego: reloj y periodo en el div #gameTime:
      const clockValue = status?.displayClock ?? "00:00";
      const period = status?.period ?? "";
      const ordinalSuffixes = {1: "st", 2: "nd", 3: "rd", 4: "th"};
      const periodSuffix = (typeof period === "number") ? (ordinalSuffixes[period] || "th") : "";

      // Actualizar el span con clase "clock" dentro de #gameTime
      const clockSpan = document.querySelector("#gameTime .clock");
      if (clockSpan) {
        clockSpan.textContent = clockValue;
        // Iniciar el cronómetro local usando el valor extraído de la API
        startLocalClock(clockValue);
      }

      // Actualizar el div con clase "neon-text" para el periodo
      const periodDiv = document.querySelector("#gameTime .neon-text");
      if (periodDiv) {
          periodDiv.innerHTML = `${period}${periodSuffix ? `<span style="font-size: 80%; z-index: -1;">${periodSuffix}</span>` : ""}`;
      }

      
      // Actualizar colores de fondo y nombres/score en desktop
      const homeTeamData = nbaTeams.find(team => team.code === homeTeam.team.abbreviation);
      const awayTeamData = nbaTeams.find(team => team.code === awayTeam.team.abbreviation);
      const homeBg = homeTeamData ? homeTeamData.background : "red";
      const awayBg = awayTeamData ? awayTeamData.background : "blue";
      document.getElementById("teamA").style.backgroundColor = homeBg;
      document.getElementById("teamB").style.backgroundColor = awayBg;
      
      // Actualizar elementos móviles: scoreAMin, nameAMin, scoreBMin, nameBMin y los fondos de teamAMin y teamBMin
      const scoreAMinElem = document.getElementById("scoreAMin");
      if (scoreAMinElem) scoreAMinElem.textContent = homeTeam.score;
      const nameAMinElem = document.getElementById("nameAMin");
      if (nameAMinElem) nameAMinElem.textContent = homeTeam.team.abbreviation;
      const scoreBMinElem = document.getElementById("scoreBMin");
      if (scoreBMinElem) scoreBMinElem.textContent = awayTeam.score;
      const nameBMinElem = document.getElementById("nameBMin");
      if (nameBMinElem) nameBMinElem.textContent = awayTeam.team.abbreviation;
      const teamAMin = document.getElementById("teamAMin");
      if (teamAMin) teamAMin.style.backgroundColor = homeBg;
      const teamBMin = document.getElementById("teamBMin");
      if (teamBMin) teamBMin.style.backgroundColor = awayBg;
    }
    // Reordenar y recargar las predicciones con la nueva información del partido.
    loadPredictions();
    
    // Si el juego está finalizado, mostrar la alerta de ganador.
    const description = data.header?.competitions?.[0]?.status?.type?.description;

    if (description === "Scheduled") {
      document.querySelector('.timer').classList.add('stop-animation');
      console.log('Partido por Iniciar');
    }

    if (description === "Final") {
      document.querySelector('.timer').classList.add('stop-animation');
      console.log('Partido Finalizado');

      const predictions = JSON.parse(localStorage.getItem('predictions')) || [];
      if (predictions.length > 0) {
        const sortedPredictions = sortPredictions(predictions);
        const winnerName = sortedPredictions[0].contestant;
        // Swal.fire({
        //   position: "top-end",
        //   icon: "success",
        //   title: `<h4 class="alert-heading text-center">Juego Finalizado</h4>
        //     <div class="display-6 fw-bolder text-center">${winnerName}  <i class="bi bi-emoji-grin"></i></div> 
        //     <div class="h5 fw-bold text-center">Es el ganador@!!!</div>`,
        //   showConfirmButton: false,
        //   timer: 5000
        // });
        let alertDiv = document.getElementById('winnerAlert');
        if (!alertDiv) {
          alertDiv = document.createElement('div');
          alertDiv.id = 'winnerAlert';
          alertDiv.className = 'alert alert-success px-5 mt-3';
          alertDiv.setAttribute('role', 'alert');
          alertDiv.innerHTML = `
            <h4 class="alert-heading text-center">Juego Finalizado</h4>
            <div class="display-6 fw-bolder text-center">${winnerName} <i class="bi bi-emoji-grin"></i></div> 
            <div class="h5 fw-bold text-center">Es el ganador@!!!</div>
          `;
          // Se agrega debajo del contenedor de predicciones (por ejemplo, al final del main)
          const main = document.querySelector('main');
          main.appendChild(alertDiv);
        } else {
          alertDiv.querySelector('.display-6').innerHTML = `${winnerName} <i class="bi bi-emoji-grin"></i>`;
        }
      }
    } else {
      // Remover la alerta si el juego no está finalizado
      const alertDiv = document.getElementById('winnerAlert');
      if (alertDiv) {
        alertDiv.remove();
      }
    }
  } catch (error) {
    console.error("Error fetching NBA score:", error);
  }
}

// 3.1. Función: Iniciar el cronómetro local a partir del tiempo extraído de la API
let clockInterval = null;

function startLocalClock(initialTime) {
  // Limpiar cualquier intervalo anterior
  if (clockInterval) {
    clearInterval(clockInterval);
  }
  // Parsear el tiempo inicial (formato "MM:SS")
  let [minutes, seconds] = initialTime.split(':').map(Number);
  const clockElement = document.querySelector('.clock');
  // Actualizar el display inmediatamente
  clockElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Iniciar el cronómetro que se actualiza cada segundo
  clockInterval = setInterval(() => {
    // Si el tiempo ya es 00:00, detener el cronómetro
    if (minutes === 0 && seconds === 0) {
      clearInterval(clockInterval);
      clockElement.textContent = "00:00";
      return;
    }
    // Restar un segundo
    if (seconds === 0) {
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }
    // Actualizar el display
    clockElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, 1000);
}


// =============================================
// 4. Función: Auto-refresh del último juego elegido
// =============================================
let currentGameId = null;
let refreshInterval = null;
function startAutoRefresh(gameId) {
  if (currentGameId === gameId) return;
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  currentGameId = gameId;
  refreshInterval = setInterval(() => {
    getNBAScore(currentGameId);
  }, 15000);
}

// =============================================
// 5. Evento: Click en ítem del dropdown para actualizar partido
// =============================================
document.addEventListener("click", function(e) {
  const dropdownItem = e.target.closest(".dropdown-item");
  if (dropdownItem) {
    e.preventDefault();
    const eventId = dropdownItem.getAttribute("data-id");
    getNBAScore(eventId);
    startAutoRefresh(eventId);
  }
});

// ==================================================
// 6. Funciones de Predicciones: Cargar, agregar, editar, eliminar y ordenar
// ==================================================

// 6.1. Cargar predicciones almacenadas en Local Storage
function loadPredictions() {
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';
  const predictions = JSON.parse(localStorage.getItem('predictions')) || [];
  const sortedPredictions = sortPredictions(predictions);
  sortedPredictions.forEach((prediction, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="text-center">${index + 1}</td>
      <td>${prediction.contestant}</td>
      <td class="text-center">${prediction.scoreLocal}</td>
      <td class="text-center">${prediction.scoreVisitor}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editPrediction(${prediction.id})"><i class="bi bi-pencil-square"></i></button>
      </td>
    `;
    tableBody.appendChild(row);
  });
  addDeleteButton();
}

// 6.2. Agregar una nueva predicción y almacenarla (con id único)
function addPrediction() {
  const contestant = document.getElementById('inputContestant').value.trim();
  const scoreLocal = parseInt(document.getElementById('scoreLocal').value);
  const scoreVisitor = parseInt(document.getElementById('scoreVisitor').value);
  if (!contestant) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Por favor, ingresa el nombre del concursante."
    });
    return;
  }
  if (isNaN(scoreLocal) || isNaN(scoreVisitor) || scoreLocal < 0 || scoreVisitor < 0) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Por favor, ingresa puntajes válidos (números no negativos)."
    });
    return;
  }
  const prediction = { contestant, scoreLocal, scoreVisitor, id: Date.now() };
  savePrediction(prediction);
  document.getElementById('inputContestant').value = '';
  document.getElementById('scoreLocal').value = '';
  document.getElementById('scoreVisitor').value = '';
  loadPredictions();
}

// 6.3. Guardar predicción en Local Storage
function savePrediction(prediction) {
  const predictions = JSON.parse(localStorage.getItem('predictions')) || [];
  predictions.push(prediction);
  localStorage.setItem('predictions', JSON.stringify(predictions));
}

// 6.4. Agregar botón "Eliminar Todas" si no existe
function addDeleteButton() {
  const table = document.querySelector('table');
  let deleteButton = document.getElementById('deleteButton');
  if (!deleteButton) {
    deleteButton = document.createElement('button');
    deleteButton.id = 'deleteButton';
    deleteButton.className = 'btn btn-danger mt-3';
    deleteButton.textContent = 'Eliminar Todas';
    deleteButton.onclick = deleteAllPredictions;
    table.parentNode.appendChild(deleteButton);
  }
}

// 6.5. Eliminar todas las predicciones con confirmación
function deleteAllPredictions() {
  Swal.fire({
    icon: "warning",
    title: "Confirmar",
    text: "¿Estás seguro de que deseas eliminar todas las predicciones?",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('predictions');
      loadPredictions();
      const deleteButton = document.getElementById('deleteButton');
      if (deleteButton) deleteButton.remove();
    }
  });
}

// 6.6. Editar una predicción (buscando por id)
function editPrediction(id) {
  const predictions = JSON.parse(localStorage.getItem('predictions')) || [];
  const index = predictions.findIndex(pred => pred.id === id);
  if (index !== -1) {
    const prediction = predictions[index];
    document.getElementById('inputContestant').value = prediction.contestant;
    document.getElementById('scoreLocal').value = prediction.scoreLocal;
    document.getElementById('scoreVisitor').value = prediction.scoreVisitor;
    predictions.splice(index, 1);
    localStorage.setItem('predictions', JSON.stringify(predictions));
    loadPredictions();
  }
}

// 6.7. Ordenar predicciones según criterios:
//      - Primero: acertar al ganador (comparando con el resultado actual)
//      - Segundo: diferencia en la suma de puntajes respecto al total actual
function sortPredictions(predictions) {
  const currentLocalScore = parseInt(document.getElementById('scoreA').textContent) || 0;
  const currentVisitorScore = parseInt(document.getElementById('scoreB').textContent) || 0;
  const actualTotal = currentLocalScore + currentVisitorScore;
  const actualWinnerLocal = currentLocalScore > currentVisitorScore;
  
  return predictions.sort((a, b) => {
    const aWinnerLocal = a.scoreLocal > a.scoreVisitor;
    const bWinnerLocal = b.scoreLocal > b.scoreVisitor;
    if (aWinnerLocal === actualWinnerLocal && bWinnerLocal !== actualWinnerLocal) return -1;
    if (aWinnerLocal !== actualWinnerLocal && bWinnerLocal === actualWinnerLocal) return 1;
    const aTotal = a.scoreLocal + a.scoreVisitor;
    const bTotal = b.scoreLocal + b.scoreVisitor;
    const aDiff = Math.abs(aTotal - actualTotal);
    const bDiff = Math.abs(bTotal - actualTotal);
    return aDiff - bDiff;
  });
}

// =============================================
// 7. Evento DOMContentLoaded: Inicializar partidos y predicciones
// =============================================
document.addEventListener("DOMContentLoaded", () => {
  getWeeklyGames();
  loadPredictions();
});


