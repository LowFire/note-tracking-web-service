let usernameInput = document.querySelector("#username");
let passwordInput = document.querySelector("#password");
let submitBtn = document.querySelector("#submit");
let error = document.querySelector("#error");

function verifyLogin () {
    let xhttp = new XMLHttpRequest();
    let username = usernameInput.value;
    let password = passwordInput.value;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "1") {
                error.textContent = "The username or password is invalid.";
            } else {
                let form = document.createElement("FORM");
                form.method = "GET";
                form.action = "/";
                document.querySelector("div").appendChild(form);
                form.submit();
            }
        }
    };
    xhttp.open("POST", "/login", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username=" + username + "&password=" + password);
}

submitBtn.addEventListener("click", verifyLogin);