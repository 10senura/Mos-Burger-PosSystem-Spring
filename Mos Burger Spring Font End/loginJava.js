
function validateForm() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (username === "senura" && password === "admin123") {
        window.location.href = "pos.html";
    } else {
        alert("Invalid username or password. Please try again.");
    }
}
