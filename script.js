let subjects = [];

// ================= Reference Finder =================
function searchReferences() {
    let subject = document.getElementById("subject").value;

    if (subject === "") {
        alert("Please enter a subject name");
        return;
    }

    window.open("https://www.google.com/search?q=" + subject + " notes pdf");
    window.open("https://www.geeksforgeeks.org/search/?q=" + subject);
    window.open("https://nptel.ac.in/courses/search?searchText=" + subject);
}

// ================= Add Subject =================
function addSubject() {
    let name = document.getElementById("semSubject").value;
    let chapters = document.getElementById("semChapters").value;
    let examDateValue = document.getElementById("examDate").value;

    if (name === "" || chapters === "" || chapters <= 0 || examDateValue === "") {
        alert("Please fill all fields correctly");
        return;
    }

    let examDate = new Date(examDateValue);
    let today = new Date();

    if (examDate <= today) {
        alert("Exam date must be in the future");
        return;
    }

    subjects.push({
        name: name,
        chapters: Number(chapters),
        examDate: examDate
    });

    alert(name + " added successfully");

    document.getElementById("semSubject").value = "";
    document.getElementById("semChapters").value = "";
    document.getElementById("examDate").value = "";
}


// ================= Generate Semester Plan =================
function generateSemesterPlan() {
    if (subjects.length === 0) {
        alert("Please add at least one subject");
        return;
    }

    let today = new Date();
    let schedule = {}; // 👉 date-wise storage

    subjects.forEach(subject => {
        let examDate = new Date(subject.examDate);

        let daysLeft = Math.ceil(
            (examDate - today) / (1000 * 60 * 60 * 24)
        );

        if (daysLeft <= 0) return;

        let chaptersPerDay = Math.ceil(subject.chapters / daysLeft);
        let currentChapter = 1;

        for (let i = 0; i < daysLeft && currentChapter <= subject.chapters; i++) {
            let studyDate = new Date(today);
            studyDate.setDate(today.getDate() + i);

            let dateKey = studyDate.toDateString();

            if (!schedule[dateKey]) {
                schedule[dateKey] = [];
            }

            let start = currentChapter;
            let end = Math.min(currentChapter + chaptersPerDay - 1, subject.chapters);

            schedule[dateKey].push(
                subject.name + " – Chapter " +
                start + (start !== end ? " to " + end : "")
            );

            currentChapter = end + 1;
        }

        // Add exam day marker
        let examKey = examDate.toDateString();
        if (!schedule[examKey]) {
            schedule[examKey] = [];
        }
        schedule[examKey].push("🎯 " + subject.name + " EXAM");
    });

    // 👉 Build table
    let output = document.getElementById("semesterOutput");
    let table =
        "<table border='1' cellpadding='8' cellspacing='0'>" +
        "<tr><th>Date</th><th>Study Plan</th></tr>";

    Object.keys(schedule).forEach(date => {
        table +=
            "<tr>" +
            "<td>" + date + "</td>" +
            "<td>" + schedule[date].join("<br>") + "</td>" +
            "</tr>";
    });

    table += "</table>";
    output.innerHTML = table;
}
