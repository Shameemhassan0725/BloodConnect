const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");


loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            document.getElementById(
                "loginEmail"
            ).value.trim();


        const password =
            document.getElementById(
                "loginPassword"
            ).value;


        loginMessage.textContent =
            "Logging in...";

        loginMessage.style.color =
            "#555";


        try {

            const response = await fetch(

                "http://localhost:5000/api/login",

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        email: email,

                        password: password

                    })

                }

            );


            const data =
                await response.json();


            if (!response.ok) {

                loginMessage.textContent =
                    data.message ||
                    "Login failed.";

                loginMessage.style.color =
                    "red";

                return;

            }


            // Save donor information

            localStorage.setItem(
                "donor",
                JSON.stringify(data.donor)
            );


            loginMessage.textContent =
                "Login successful!";

            loginMessage.style.color =
                "green";


            setTimeout(() => {

                window.location.href =
                    "donor-dashboard.html";

            }, 800);


        } catch (error) {

            console.error(error);

            loginMessage.textContent =
                "Cannot connect to the server.";

            loginMessage.style.color =
                "red";

        }

    }
);