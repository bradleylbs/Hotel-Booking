const occupationChart = new Array(20).fill(false);
const pricePerDay = 550;

document.addEventListener('DOMContentLoaded', () => {
    showTab('booking');
    updateAvailableRoomsList();
    updateOccupancyTable();
});

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabName).style.display = 'block';

    if (tabName === 'unassign') {
        updateOccupancyTable();
    }
}

function goToHomePage() {
    showTab('booking');
}

function assignRoom() {
    const floor = parseInt(document.getElementById('floor').value);
    const name = document.getElementById('name').value;
    const duration = parseInt(document.getElementById('duration').value);
    const allergies = document.getElementById('allergies').value || 'None';
    const resultDiv = document.getElementById('result');

    if (floor < 1 || floor > 10) {
        resultDiv.textContent = "Invalid floor. Please type a number between 1 and 10.";
        resultDiv.style.color = 'red';
        return;
    }

    const room1Index = (floor - 1) * 2;
    const room2Index = room1Index + 1;

    let assignedRoomIndex;
    if (!occupationChart[room1Index]) {
        assignedRoomIndex = room1Index;
    } else if (!occupationChart[room2Index]) {
        assignedRoomIndex = room2Index;
    } else {
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

    occupationChart[assignedRoomIndex] = true;
    const assignedRoom = (assignedRoomIndex % 2 === 0) ? Math.floor(assignedRoomIndex / 2) * 10 + 1 : Math.floor(assignedRoomIndex / 2) * 10 + 2;
    const totalCost = duration * pricePerDay;
    resultDiv.innerHTML = `
        <p>Room assigned successfully!</p>
        <p>Guest Name: ${name}</p>
        <p>Room Number: ${assignedRoom}</p>
        <p>Floor: ${Math.floor(assignedRoomIndex / 2) + 1}</p>
        <p>Duration of Stay: ${duration} days / ${duration - 1} nights</p>
        <p>Total Cost: R${totalCost}</p>
        <p>Food Allergies: ${allergies}</p>
    `;
    resultDiv.style.color = 'green';
    document.getElementById('assignmentForm').reset()
    updateAvailableRoomsList();
    updateOccupancyTable();
}

function updateAvailableRoomsList() {
    const availableRoomsTableBody = document.getElementById('availableRoomsTableBody');
    availableRoomsTableBody.innerHTML = '';

    for (let floor = 1; floor <= 10; floor++) {
        const room1Index = (floor - 1) * 2;
        const room2Index = room1Index + 1;

        if (!occupationChart[room1Index] || !occupationChart[room2Index]) {
            if (!occupationChart[room1Index]) {
                const row = `
                    <tr>
                        <td>${floor}</td>
                        <td>${floor * 10 + 1}</td>
                        <td>Available</td>
                    </tr>
                `;
                availableRoomsTableBody.innerHTML += row;
            }

            if (!occupationChart[room2Index]) {
                const row = `
                    <tr>
                        <td>${floor}</td>
                        <td>${floor * 10 + 2}</td>
                        <td>Available</td>
                    </tr>
                `;
                availableRoomsTableBody.innerHTML += row;
            }
        }
    }
}

function updateOccupancyTable() {
    const occupancyTableBody = document.getElementById('occupancyTableBody');
    occupancyTableBody.innerHTML = '';

    for (let i = 0; i < occupationChart.length; i++) {
        if (occupationChart[i]) {
            const roomNumber = (i % 2 === 0) ? Math.floor(i / 2) * 10 + 1 : Math.floor(i / 2) * 10 + 2;
            const status = occupationChart[i] ? 'Occupied' : 'Available';
            const row = `
                <tr>
                    <td>${roomNumber}</td>
                    <td>${status}</td>
                    <td><button onclick="unassignRoom(${roomNumber})">Check Out</button></td>
                </tr>
            `;
            occupancyTableBody.innerHTML += row;
        }
    }
}

function unassignRoom(roomNumber) {
    const resultDiv = document.getElementById('unassignResult');

    if (isNaN(roomNumber) || roomNumber < 11 || roomNumber > 110 || roomNumber % 10 === 0 || roomNumber % 10 > 2) {
        resultDiv.textContent = "Invalid room number. Please type a valid room number.";
        resultDiv.style.color = 'red';
        return;
    }

    const roomIndex = Math.floor((roomNumber - 1) / 10) * 2 + (roomNumber % 10 === 1 ? 0 : 1);
    if (!occupationChart[roomIndex]) {
        resultDiv.textContent = `Room ${roomNumber} is already unassigned.`;
        resultDiv.style.color = 'red';
        return;
    }

    occupationChart[roomIndex] = false;
    resultDiv.textContent = `Room ${roomNumber} has been unassigned successfully.`;
    resultDiv.style.color = 'green';
    updateAvailableRoomsList();
    updateOccupancyTable();
}
