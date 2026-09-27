const registerForm = document.getElementById("registerForm");

const message = document.getElementById("message");


registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const donor = {

    name:
        document.getElementById("name").value.trim(),

    email:
        document.getElementById("email").value.trim(),

    password:
        document.getElementById("password").value,

    phone:
        document.getElementById("phone").value.trim(),

    bloodGroup:
        document.getElementById("bloodGroup").value,

    age:
        document.getElementById("age").value,

    gender:
        document.getElementById("gender").value,

    city:
        document.getElementById("city").value.trim()

};

    try {

        const response = await fetch(
            "http://localhost:5000/api/donors",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(donor)
            }
        );


        const data = await response.json();


        if (response.ok) {

            message.textContent =
                "Registration successful! You are now a donor.";

            message.style.color = "green";

            registerForm.reset();

        } else {

            message.textContent =
                data.message || "Registration failed.";

            message.style.color = "red";

        }

    } catch (error) {

        console.error(error);

        message.textContent =
            "Cannot connect to the server.";

        message.style.color = "red";

    }

});