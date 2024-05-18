// Initialize the occupation chart
const occupationChart = new Array(20).fill(false);
const pricePerDay = 550

document.addEventListener('DOMContentLoaded', () => {
    showTab('booking');
    updateAvailableRoomsList();
});

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabName).style.display = 'block';
}

function assignRoom() {
    const floor = parseInt(document.getElementById('floor').value);
    const name = document.getElementById('name').value;
    const duration = document.getElementById('duration').value;
    const allergies = document.getElementById('allergies').value || 'None';
    const resultDiv = document.getElementById('result');

    if (floor < 1 || floor > 10) {
        resultDiv.textContent = "Invalid floor. Please type a number between 1 and 10.";
        resultDiv.style.color = 'red';
        return;
    }

    // Determine room indices for the selected floor (0-based index)
    const room1Index = (floor - 1) * 2;
    const room2Index = room1Index + 1;

    // Find an available room on the requested floor
    let assignedRoomIndex;
    if (!occupationChart[room1Index]) {
        assignedRoomIndex = room1Index;
    } else if (!occupationChart[room2Index]) {
        assignedRoomIndex = room2Index;
    } else {
        // If both rooms on the floor are occupied, ask the user for an alternative floor
        const alternativeFloor = prompt(`Both rooms on Floor ${floor} are already assigned. Would you like to be placed on another available floor? If yes, type the floor number (1-10). If no, type 0.`);
        const altFloor = parseInt(alternativeFloor);

        if (altFloor >= 1 && altFloor <= 10 && altFloor !== floor) {
            const altRoom1Index = (altFloor - 1) * 2;
            const altRoom2Index = altRoom1Index + 1;

            if (!occupationChart[altRoom1Index]) {
                assignedRoomIndex = altRoom1Index;
            } else if (!occupationChart[altRoom2Index]) {
                assignedRoomIndex = altRoom2Index;
            } else {
                resultDiv.textContent = `Both rooms on Floor ${altFloor} are also already assigned. We are sorry, we could not provide you a room on the floor of your choice.`;
                resultDiv.style.color = 'red';
                return;
            }
        } else {
            resultDiv.textContent = `We are sorry, we could not provide you a room on the floor of your choice.`;
            resultDiv.style.color = 'red';
            return;
        }
    }

    // Assign the room
    occupationChart[assignedRoomIndex] = true;
    const assignedRoom = (assignedRoomIndex % 2 === 0) ? Math.floor(assignedRoomIndex / 2) * 10 + 1 : Math.floor(assignedRoomIndex / 2) * 10 + 2;
    const totalCost = duration * pricePerDay;
    resultDiv.innerHTML = `
        <p>Room assigned successfully!</p>
        <p>Guest Name: ${name}</p>
        <p>Room Number: ${assignedRoom}</p>
        <p>Floor: ${Math.floor(assignedRoomIndex / 2) + 1}</p>
        <p>Duration of Stay: ${duration} / ${duration - 1} nights </p>
        <p>Total Cost: R${totalCost}</p>
        <p>Food Allergies: ${allergies}</p>
    `;
    resultDiv.style.color = 'green';
    updateAvailableRoomsList();
}

function updateAvailableRoomsList() {
    const availableRoomsList = document.getElementById('availableRoomsList');
    availableRoomsList.innerHTML = '';

    for (let floor = 1; floor <= 10; floor++) {
        const room1Index = (floor - 1) * 2;
        const room2Index = room1Index + 1;

        if (!occupationChart[room1Index] || !occupationChart[room2Index]) {
            const floorRooms = document.createElement('div');
            floorRooms.innerHTML = `<h3>Floor ${floor}</h3>`;

            if (!occupationChart[room1Index]) {
                floorRooms.innerHTML += `<p>Room ${floor * 10 + 1} is available.</p>`;
            }

            if (!occupationChart[room2Index]) {
                floorRooms.innerHTML += `<p>Room ${floor * 10 + 2} is available.</p>`;
            }

            availableRoomsList.appendChild(floorRooms);
        }
    }
}
