const fileInput = document.getElementById("file-input");
const fileContentDisplay = document.getElementById("file-content");
const messageDisplay = document.getElementById("message");
const dutyTable = document.getElementById("duty-table")
const startDatePicker = document.getElementById("start-date")

const countHeaderCell = document.getElementById("count-header")
countHeaderCell.addEventListener("click",handleCountClick)
const daysHeaderCell = document.getElementById("days-header")
daysHeaderCell.addEventListener("click",handleDaysClick)

fileInput.addEventListener("change", handleFileSelection);

startDatePicker.addEventListener("change",handleStartDateChange)

dutyTable.addEventListener("click",handleTableClick)

const barDutiesArray = new Array()
const barDutiesMap = new Map()
console.log(startDatePicker.value)

var rosterStartDate = Math.floor(Date.now() / 86400000)
if (startDatePicker.value != "") {
    rosterStartDate = Date.parse(startDatePicker.value) / 86400000
}
var sortDirection = "d"

function compareDutyCountAsc(a,b) {
    if (a["count"] < b["count"]) {
        return -1
    } else {
        return 1
    }
}

function compareDutyCountDesc(a,b) {
    if (a["count"] < b["count"]) {
        return 1
    } else {
        return -1
    }
}


function compareDutyDateDesc(a,b) {
    if (a["lastDuty"] < b["lastDuty"]) {
        return -1
    } else {
        return 1
    }
}

function compareDutyDateAsc(a,b) {
    if (a["lastDuty"] < b["lastDuty"]) {
        return 1
    } else {
        return -1
    }
}


function parseDate(strDate) {
    e = strDate.split("-")
    return Date.parse(e[2] + "-" + e[1] + "-" + e[0]) / 86400000

}

function handleTableClick(event) {
    console.log(event.target.parentElement)
    cell = event.target
    row = cell.parentElement
    if (barDutiesMap.has(cell.innerHTML)) {
        person = barDutiesMap.get(cell.innerHTML)
        person["enabled"] = person["enabled"] == 0 ? 1 : 0
        row.classList = person["enabled"] == 1 ? "" : "table-disable"
    }
}

function handleStartDateChange(event) {

    if (event.target.value.length > 1) {
        rosterStartDate = Date.parse(event.target.value) / 86400000
        updateTable()
    }
}

function handleCountClick(event) {
    if (sortDirection == 'd') {
        barDutiesArray.sort(compareDutyCountAsc)
        sortDirection = "a"
    } else {
        barDutiesArray.sort(compareDutyCountDesc)
        sortDirection = "d"
    }
    updateTable()
}

function handleDaysClick(event) {
    console.log(event)
    if (sortDirection == 'd') {
        barDutiesArray.sort(compareDutyDateAsc)
        sortDirection = "a"
    } else {
        barDutiesArray.sort(compareDutyDateDesc)
        sortDirection = "d"
    }
    updateTable()
}


function handleFileSelection(event) {
  const file = event.target.files[0];
  fileContentDisplay.textContent = ""; // Clear previous file content
  messageDisplay.textContent = ""; // Clear previous messages

  // Validate file existence and type
  if (!file) {
    showMessage("No file selected. Please choose a file.", "error");
    return;
  }

  if (!file.type.startsWith("text")) {
    showMessage("Unsupported file type. Please select a text file.", "error");
    return;
  }



  // Read the file
  const reader = new FileReader();
  reader.onload = () => {
    lines = reader.result.split("\n")
    for (i = 0; i < lines.length; i++) {
        line = lines[i]
        elements = line.split(",")
        if (elements[3] == "Bar") {
            personName = elements[5].trim()
            if (personName.length > 1) {
            if (!barDutiesMap.has(personName)) {
                barDutiesMap.set(personName,{ name: personName,count : 0, enabled : 1,lastDuty : elements[0]})
            }
            personMap = barDutiesMap.get(personName)
            personMap["count"] = personMap["count"] + 1
            personMap["lastDuty"] = parseDate(elements[0])

        }
        }
    }
    const iter = barDutiesMap.values()
    for (const e of iter) {
        console.log(e)
        barDutiesArray.push(e)
    }
    barDutiesArray.sort(compareDutyDateDesc)
    populateTable()

  };
  reader.onerror = () => {
    showMessage("Error reading the file. Please try again.", "error");
  };
  reader.readAsText(file);
}

function populateTable() {
    const mapIter = barDutiesArray.values()
    for (const e of mapIter) {
        row = dutyTable.insertRow(-1)
        cell1 = row.insertCell(-1)
        cell1.innerHTML = e["name"]
        cell2 = row.insertCell(-1)
        cell2.innerHTML = e["count"]
        cell3 = row.insertCell(-1)
        cell3.innerHTML = rosterStartDate - e["lastDuty"]
    }
}

function updateTable() {
    const mapIter = barDutiesArray.values()
    var rowIdx = 1
    for (const e of mapIter) {
        row = dutyTable.rows[rowIdx++]
        row.className = e["enabled"] == 1 ? "" : "table-disable"
        row.cells[0].innerHTML = e["name"]
        row.cells[1].innerHTML = e["count"]
        row.cells[2].innerHTML = rosterStartDate - e["lastDuty"]
    }
}
// Displays a message to the user
function showMessage(message, type) {
  messageDisplay.textContent = message;
  messageDisplay.style.color = type === "error" ? "red" : "green";
}
