const fileInput = document.getElementById("file-input");
const outputTextArea = document.getElementById("html-output")
const messageDisplay = document.getElementById("message");

fileInput.addEventListener("change", handleFileSelection);



function handleStartDateChange(event) {

    if (event.target.value.length > 1) {
        rosterStartDate = Date.parse(event.target.value) / 86400000
    }
}


function handleFileSelection(event) {
  const file = event.target.files[0];

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
  outputTextArea.value = "<table>" +
    "<tr><th>Date</th><th>Time</th><th>Name</th></tr>\n"
  const reader = new FileReader();
  reader.onload = () => {
    lines = reader.result.split("\n")
    for (i = 0; i < lines.length; i++) {
        line = lines[i]
        elements = line.split(",")
        if (elements[3] == "Bar") {
            line = assembleHTML(elements)
            if (line.length > 1) {
                outputTextArea.value = outputTextArea.value + line
            }
        }
    }
    outputTextArea.value = outputTextArea.value + "</table>\n"
  };
  reader.onerror = () => {
    showMessage("Error reading the file. Please try again.", "error");
  };
  reader.readAsText(file);
}

function assembleHTML(elements) {
    personHTML = "<b>Volunteer required</b>"
    personName = elements[5].trim()
    if (personName.length > 1) {
        personHTML = "<a href='https://langstonesc.org.uk/member/" +
        elements[6] + "'>" + personName + "</a>"
    }
    date = new Date(parseDate(elements[0]))
    de = date.toDateString().split(" ")
    return "<tr><td>" + de[0] + " " + de[2] + " " + de[1]
    + "</td><td>" + elements[4]
    + "</td><td>" + personHTML
    + "</td></tr>\n"
}
/*
<tr>
<td>Sat 01 Nov</td>
<td>13:00-16:00</td>
<td><a href="https://langstonesc.org.uk/member/1584423">Frank Raine</a></td>
</tr>
*/
function parseDate(strDate) {
    e = strDate.split("-")
    return Date.parse(e[2] + "-" + e[1] + "-" + e[0])
}

function showMessage(message, type) {
  messageDisplay.textContent = message;
  messageDisplay.style.color = type === "error" ? "red" : "green";
}
