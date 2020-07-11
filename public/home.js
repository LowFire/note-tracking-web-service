
let rootNode = document.querySelector("#rootNode"); //get the root node of the website. This is NOT the html tag.

//Function for editBtn
function edit () {
    //change the contents of the card body into input fields
    let name = this.parentNode.childNodes[0];
    let date = this.parentNode.childNodes[1];
    let contents = this.parentNode.childNodes[2];
    name.classList.toggle("d-none");
    date.classList.toggle("d-none");
    contents.classList.toggle("d-none");
    let nameInput = this.parentNode.childNodes[3];
    let dateInput = this.parentNode.childNodes[4];
    let contentInput = this.parentNode.childNodes[5];
    nameInput.classList.toggle("d-none");
    dateInput.classList.toggle("d-none");
    contentInput.classList.toggle("d-none");
    nameInput.value = name.textContent;
    dateInput.value = date.textContent;
    contentInput.value = contents.textContent;

    //replace the edit and delete buttons with new buttons
    let editBtn = this.parentNode.childNodes[8];
    let deleteBtn = this.parentNode.childNodes[9];
    editBtn.classList.toggle("d-none");
    deleteBtn.classList.toggle("d-none");
    let saveBtn = this.parentNode.childNodes[6];
    let cancelBtn = this.parentNode.childNodes[7];
    saveBtn.classList.toggle("d-none");
    cancelBtn.classList.toggle("d-none");
}

function save () {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let success = JSON.parse(this.responseText).success;
            if (success) {
                console.log("Note successfully updated");
            } else {
                console.log("Error: failed to update note");
            }
        }
    };
    xhttp.open("POST", "/edit", true);
    xhttp.send();
}

function cancel () {
    //Toggle button visibilities
    let editBtn = this.parentNode.childNodes[8];
    let deleteBtn = this.parentNode.childNodes[9];
    let saveBtn = this.parentNode.childNodes[6];
    let cancelBtn = this.parentNode.childNodes[7];

    editBtn.classList.toggle("d-none");
    cancelBtn.classList.toggle("d-none");
    saveBtn.classList.toggle("d-none");
    deleteBtn.classList.toggle("d-none");

    //toggle input and data visibility
    let name = this.parentNode.childNodes[0];
    let date = this.parentNode.childNodes[1];
    let contents = this.parentNode.childNodes[2];
    name.classList.toggle("d-none");
    date.classList.toggle("d-none");
    contents.classList.toggle("d-none");
    let nameInput = this.parentNode.childNodes[3];
    let dateInput = this.parentNode.childNodes[4];
    let contentInput = this.parentNode.childNodes[5];
    nameInput.classList.toggle("d-none");
    dateInput.classList.toggle("d-none");
    contentInput.classList.toggle("d-none");
    nameInput.value = "";
    dateInput.value = "";
    contentInput.value = "";
}

function del () {
    let confirm = window.confirm("Are you sure you want to delete this note?");

    if (confirm) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let success = JSON.parse(this.responseText).success;
                if (success) {
                    console.log("Note has been successfully deleted from database");
                } else {
                    console.log("Error: failed to delete note from database");
                }
            }
        };
        let noteid = this.parentNode.childNodes[10].value
        xhttp.open("POST", "/delete", true);
        xhttp.send();
        this.parentNode.parentNode.remove();
    }
}

function createNewNote() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let success = JSON.parse(this.responseText).success;
            if (success) {
                console.log("New note successfully added to database");
            } else {
                console.log("Error: failed to add new note to database");
            }
        }
    };
    xhttp.open("POST", "/add", true);
    xhttp.send();
}

function getData(noteList) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let noteData = JSON.parse(this.responseText);

            for (let i = 0; i < noteData.length; i++) {
                let noteTemplate = document.createElement("DIV"); //The main template that will be added to the noteList
                noteTemplate.classList.add("card", "col-3");
                let cardBody = document.createElement("DIV");
                cardBody.classList.add("card-body");
                let cardTitle = document.createElement("H5");
                cardTitle.classList.add("card-title");
                cardDate = document.createElement("P");
                cardDate.classList.add("noteDate");
                let cardText = document.createElement("P");
                cardText.classList.add("card-text");

                //create buttons
                let editBtn = document.createElement("BUTTON");
                editBtn.classList.add("btn", "btn-sm", "btn-primary", "editBtn");
                editBtn.textContent = "Edit";
                editBtn.addEventListener("click", edit);
                let deleteBtn = document.createElement("BUTTON");
                deleteBtn.classList.add("btn", "btn-sm", "btn-danger", "deleteBtn");
                deleteBtn.textContent = "Delete";
                deleteBtn.addEventListener("click", del);
                let saveBtn = document.createElement("BUTTON");
                //these buttons are hidden to start
                saveBtn.classList.add("btn", "btn-sm", "btn-success", "editBtn", "d-none");
                saveBtn.textContent = "Save";
                saveBtn.addEventListener("click", save);
                let cancelBtn = document.createElement("BUTTON");
                cancelBtn.classList.add("btn", "btn-sm", "btn-danger", "editBtn", "d-none");
                cancelBtn.textContent = "Cancel";
                cancelBtn.addEventListener("click", cancel);

                //Create inputs. They are hidden to start.
                let nameInput = document.createElement("INPUT");
                let dateInput = document.createElement("INPUT");
                let contentInput = document.createElement("INPUT");
                nameInput.type = "text";
                dateInput.type = "date";
                contentInput.type = "text"
                nameInput.classList.toggle("d-none");
                dateInput.classList.toggle("d-none");
                contentInput.classList.toggle("d-none");

                //This input will forever be hidden. Meant to store the noteid.
                let noteid = document.createElement("INPUT");
                noteid.type = "number";
                noteid.classList.toggle("d-none");
                noteid.value = noteData[i].id;
                
                //append everything
                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardDate);
                cardBody.appendChild(cardText);
                cardBody.appendChild(nameInput);
                cardBody.appendChild(dateInput);
                cardBody.appendChild(contentInput);
                cardBody.appendChild(saveBtn);
                cardBody.appendChild(cancelBtn);
                cardBody.appendChild(editBtn);
                cardBody.appendChild(deleteBtn);
                cardBody.appendChild(noteid);
                noteTemplate.appendChild(cardBody);

                //set data recieved from database
                let title = noteData[i].note_name;
                let text = noteData[i].contents;
                let date = noteData[i].note_date.substr(0, noteData[i].note_date.indexOf('T'));
                let noteNodes = noteTemplate.childNodes[0];
                noteNodes.childNodes[0].textContent = title;
                noteNodes.childNodes[1].textContent = date;
                noteNodes.childNodes[2].textContent = text;
                noteList.appendChild(noteTemplate);
            }
        }
    };
    xhttp.open("POST", "/getData", true);
    xhttp.send();
}

function createAddScreen () {
    let addScr = document.createElement("DIV");

    let addHead = document.createElement("H1");
    addHead.textContent = "Create a New Note";
    let addInputs = document.createElement("DIV");
    let nameInput = document.createElement("INPUT");
    nameInput.type = "text";
    let dateInput = document.createElement("INPUT");
    dateInput.type = "date";
    let contentInput = document.createElement("INPUT");
    contentInput.type = "text";

    addInputs.appendChild(nameInput);
    addInputs.appendChild(dateInput);
    addInputs.appendChild(contentInput);

    let saveBtn = document.createElement("BUTTON");
    saveBtn.classList.add("btn", "btn-lg", "btn-success");
    saveBtn.textContent = "Save";
    saveBtn.addEventListener("click", createNewNote);
    let cancelBtn = document.createElement("BUTTON");
    cancelBtn.classList.add("btn", "btn-lg", "btn-danger");
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", function () {
        showScreen(1);
        hideScreen(2);
    });

    addScr.appendChild(addHead);
    addScr.appendChild(addInputs);
    addScr.appendChild(saveBtn);
    addScr.appendChild(cancelBtn);

    return addScr;
}

function createNoteScreen () {
    let noteScr = document.createElement("DIV");

    let noteHead = document.createElement("H1");
    noteHead.textContent = "Your Notes";
    let noteList = document.createElement("DIV");
    noteList.classList.add("row");
    let addBtn = document.createElement("BUTTON");
    addBtn.classList.add("btn", "btn-lg", "btn-success");
    addBtn.textContent = "Add";
    addBtn.addEventListener("click", function () {
        showScreen(2);
        hideScreen(1);
    });

    noteScr.appendChild(noteHead);
    noteScr.appendChild(noteList);
    noteScr.appendChild(addBtn);
    getData(noteList);
    return noteScr;
}

function setScreen (nodeScreen) {
    if (nodeScreen) {
        rootNode.appendChild(nodeScreen);
    } else {
        console.log("Error: Cannont set screen to an invalid node");
    }
}

function hideScreen(index) {
    let node = rootNode.childNodes[index];
    if (node) {
        node.classList.add("d-none");
    } else {
        console.log("Error: can't hide an invalid node");
    }
}

function showScreen (index) {
    let node = rootNode.childNodes[index];
    if (node) {
        node.classList.remove("d-none");
    } else {
        console.log("Error, can't show an invalid node");
    }
}

let addScreen = createAddScreen();
let noteScreen = createNoteScreen(); 
setScreen(noteScreen);
setScreen(addScreen);
hideScreen(2);
