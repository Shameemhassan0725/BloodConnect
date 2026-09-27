const patientLoginForm =
    document.getElementById("patientLoginForm");

const patientLoginMessage =
    document.getElementById("patientLoginMessage");


patientLoginForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    patientLoginMessage.textContent =
        "Logging in...";

    patientLoginMessage.style.color =
        "#555";


    try {

        const response = await fetch(
            "http://localhost:5000/api/patient-login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            patientLoginMessage.textContent =
                data.message || "Login failed";

            patientLoginMessage.style.color =
                "#d90429";

            return;
        }


        /*
         * Store patient information
         * in browser localStorage.
         */

        localStorage.setItem(
            "patient",
            JSON.stringify(data.patient)
        );


        patientLoginMessage.textContent =
            "Login successful!";

        patientLoginMessage.style.color =
            "green";


        /*
         * Redirect to patient dashboard
         */

        setTimeout(() => {

            window.location.href =
                "patient-dashboard.html";

        }, 800);


    } catch (error) {

        console.error(
            "Patient login error:",
            error
        );


        patientLoginMessage.textContent =
            "Cannot connect to server.";

        patientLoginMessage.style.color =
            "#d90429";
    }

});