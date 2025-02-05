const daysOfWeek = [ "Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

function restoreFields() {
    form = 	document.getElementById('daterange');
    form.elements.namedItem("times").value = localStorage.getItem("times")
    slotsForm = document.getElementById('dutyslots');
    slotsForm.elements.namedItem("dutytype").value = localStorage.getItem("dutytype")
    slotsForm.elements.namedItem("eventtype").value = localStorage.getItem("eventtype")
    slotsForm.elements.namedItem("eventtag").value = localStorage.getItem("eventtag")
}

function processDateRange() {
    form = 	document.getElementById('daterange');
    start = form.elements.namedItem("start")
    dStart = Date.parse(start.value)
    end = form.elements.namedItem("end")
    dEnd = Date.parse(end.value)
    outputForm = document.getElementById('dutyslots');
    localStorage.setItem("times",form.elements.namedItem("times").value)
    dayMap = createDutyMap(form.elements.namedItem("times"))
    fSlots = outputForm.elements.namedItem('slots')
    fSlots.value = ""
    dayAsMillis = 24 * 60 * 60 * 1000
    for (i = dStart ; i <= dEnd ; i += dayAsMillis) {
        d = new Date(i)
//        fSlots.value = fSlots.value + d.toDateString() + " " + d.getUTCDay() + "\n"
        if (dayMap.has(d.getUTCDay())) {
            settings = dayMap.get(d.getUTCDay())
            l = dateAsUKString(d) + "," + settings.get("start") + "," + settings.get("end") + "," +
            settings.get("title") // + "," + daysOfWeek[d.getUTCDay()]
            fSlots.value = fSlots.value + l + "\n"
        }
    }
}

function generateSCM() {
    inputForm = document.getElementById('daterange');
    outputForm = document.getElementById('outputfiles');
    fEvents = outputForm.elements.namedItem("events")
    fDuties = outputForm.elements.namedItem("duties")
    slotsForm = document.getElementById('dutyslots');
    fDutyType = slotsForm.elements.namedItem("dutytype")
    dutyTypes = fDutyType.value.split(",")
    fEventType = slotsForm.elements.namedItem("eventtype")
    fEventTag = slotsForm.elements.namedItem("eventtag")
    localStorage.setItem("dutytype",fDutyType.value)
    localStorage.setItem("eventtype",fEventType.value)
    localStorage.setItem("eventtag",fEventTag.value)

    fSlots = slotsForm.elements.namedItem('slots')
    slots = fSlots.value.split("\n")
    fEvents.value = "Name,Start date (dd/mm/yyyy),Stop date (dd/mm/yyyy),Start time,End time,Notes,Tag,Event type\n"
    fDuties.value = "Duty Date (UK),Duty Time,Duty Type,Event,Swappable,Reminders,Allow volunteers\n"
    for (i = 0 ; i < slots.length; i++) {
        if (slots[i].length > 10) {
            e = generateEventFromSlot(slots[i],fEventTag.value,fEventType.value)
            fEvents.value = fEvents.value + e + "\n"
            for (j = 0 ; j < dutyTypes.length; j++) {
                d = generateDutyFromSlot(slots[i],dutyTypes[j])
                fDuties.value = fDuties.value + d + "\n"
            }
        }
    }
}

function downloadFiles() {
    outputForm = document.getElementById('outputfiles');
    fEvents = outputForm.elements.namedItem("events")
    fDuties = outputForm.elements.namedItem("duties")
    now = new Date().toISOString()

    download("events-" + now + ".csv",fEvents.value)
    download("duties-" + now + ".csv",fDuties.value)
}


function createDutyMap(textarea) {
    dayMap = new Map()
    aTimes = textarea.value.split("\n")
    for (i = 0 ; i < aTimes.length; i++) {
        duty = aTimes[i].split(",")
        settings = new Map()
        settings.set("start",duty[1])
        settings.set("end",duty[2])
        settings.set("title",duty[3])
        idx = daysOfWeek.indexOf(duty[0])
        if (idx >= 0) {
            dayMap.set(idx,settings)
        }
    }

    return dayMap
}

function generateEventFromSlot(slot,tag,dutyType) {
    items = slot.split(",")
    if (items.length != 4) {
        return "Malformed slot[" + slot + "]"
    }
    return items[3] + "," + items[0] + "," + items[0] + "," + items[1] + "," + items[2] +
    ",Notes here," + tag + "," + dutyType
}

function generateDutyFromSlot(slot,dutyType) {
    items = slot.split(",")
    if (items.length != 4) {
        return "Malformed slot[" + slot + "]"
    }
    return items[0] + "," + items[1] + ","  + dutyType + "," + items[3]  + ",Yes,Yes,Yes"
}


function zeroPad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

function dateAsUKString(d) {
    return zeroPad(d.getUTCDate(),2) + "/" + zeroPad(d.getUTCMonth() + 1,2) + "/" + d.getUTCFullYear()
//    return d.toDateString()
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';

    element.click();

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();


      }
  }