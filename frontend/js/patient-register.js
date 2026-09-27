const patientRegisterForm =
    document.getElementById("patientRegisterForm");


patientRegisterForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const message =
            document.getElementById(
                "patientRegisterMessage"
            );


        const patient = {

            name:
                document
                    .getElementById("name")
                    .value
                    .trim(),

            email:
                document
                    .getElementById("email")
                    .value
                    .trim(),

            password:
                document
                    .getElementById("password")
                    .value,

            phone:
                document
                    .getElementById("phone")
                    .value
                    .trim(),

            age:
                document
                    .getElementById("age")
                    .value,

            gender:
                document
                    .getElementById("gender")
                    .value,

            city:
                document
                    .getElementById("city")
                    .value
                    .trim()

        };


        message.textContent =
            "Creating account...";

        message.style.color = "#555";


        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/patients",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(patient)
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Registration failed"
                );

            }


            message.textContent =
                "Patient account created successfully!";

            message.style.color =
                "#16803c";


            patientRegisterForm.reset();


        } catch (error) {

            console.error(error);

            message.textContent =
                error.message ||
                "Unable to connect to the server.";

            message.style.color =
                "#d90429";

        }

    }
);