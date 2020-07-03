let submitButton = document.querySelector("#submit");

function validate() {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let retypepassword = document.querySelector("#retypepassword").value;
    let isValidUsername = true;
    let isValidPassword = true;

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("response has complete");
            if (this.responseText) {
                document.querySelector("#responseUsername").textContent = this.responseText;
                isValidUsername = false;
            } else {
                document.querySelector("#responseUsername").textContent = "";
                isValidUsername = true;
            }

            if (isValidUsername) {
                let form = document.createElement("FORM");
                let usernameInput = document.createElement("INPUT");
                usernameInput.value = username;
                usernameInput.setAttribute("name", "username");
                let passwordInput = document.createElement("INPUT");
                passwordInput.value = password;
                passwordInput.setAttribute("name", "password");
                form.appendChild(usernameInput);
                form.appendChild(passwordInput);
                form.setAttribute("method", "POST");
                form.setAttribute("action", "/signup");
                form.setAttribute("hidden", true);
                document.querySelector("body").appendChild(form);
                form.submit();
            }
        }
    };

    if (!username) {
        isValidUsername = false;
        document.querySelector("#responseUsername").textContent = "A username has not been entered.";
    } else {
        isValidUsername = true;
        document.querySelector("#responseUsername").textContent = "";
    }

    if (!password) {
        isValidPassword = false;
        document.querySelector("#responsePassword").textContent = "A password has not been entered.";
    } else if (password != retypepassword) {
        isValidPassword = false;
        document.querySelector("#responsePassword").textContent = "Passwords do not match.";
    } else {
        isValidPassword = true;
        document.querySelector("#responsePassword").textContent = "";
    }
    
    if (isValidUsername && isValidPassword) {
        xhttp.open("POST", "/signupValidate", true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send("username=" + username);
    }
}

submitButton.addEventListener("click", validate);