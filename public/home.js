

function getData() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.querySelector("#data").textContent = this.responseText;
        }
    };
    xhttp.open("POST", "/getData", true);
    xhttp.send();
}

let button = document.querySelector('#dataButton');
button.addEventListener("click", getData);