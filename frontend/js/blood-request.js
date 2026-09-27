// =========================================
// BLOOD REQUEST
// =========================================


// Get logged-in patient

const patientData =
    JSON.parse(
        localStorage.getItem("patient")
    );


// =========================================
// CHECK LOGIN
// =========================================

if (!patientData) {

    alert(
        "Please login to create a blood request."
    );

    window.location.href =
        "patient-login.html";
}


// =========================================
// FORM
// =========================================

const bloodRequestForm =
    document.getElementById(
        "bloodRequestForm"
    );

const requestMessage =
    document.getElementById(
        "requestMessage"
    );


// =========================================
// SUBMIT REQUEST
// =========================================

bloodRequestForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const bloodGroup =
            document.getElementById(
                "bloodGroup"
            ).value;


        const units =
            document.getElementById(
                "units"
            ).value;


        const hospital =
            document.getElementById(
                "hospital"
            ).value.trim();


        const city =
            document.getElementById(
                "city"
            ).value.trim();


        const requiredDate =
            document.getElementById(
                "requiredDate"
            ).value;


        const urgency =
            document.getElementById(
                "urgency"
            ).value;


        const message =
            document.getElementById(
                "message"
            ).value.trim();


        requestMessage.textContent =
            "Submitting request...";

        requestMessage.style.color =
            "#555";


        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/requests",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            patientId:
                                patientData.id,

                            patientName:
                                patientData.name,

                            bloodGroup:
                                bloodGroup,

                            units:
                                Number(units),

                            hospital:
                                hospital,

                            city:
                                city,

                            requiredDate:
                                requiredDate,

                            urgency:
                                urgency,

                            message:
                                message

                        })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                requestMessage.textContent =
                    data.message ||
                    "Failed to submit request.";

                requestMessage.style.color =
                    "#d90429";

                return;

            }


            requestMessage.textContent =
                "Blood request submitted successfully!";

            requestMessage.style.color =
                "green";


            // Clear form

            bloodRequestForm.reset();


            // Redirect after success

            setTimeout(() => {

                window.location.href =
                    "patient-dashboard.html";

            }, 1200);


        } catch (error) {

            console.error(
                "Blood request error:",
                error
            );


            requestMessage.textContent =
                "Cannot connect to server.";

            requestMessage.style.color =
                "#d90429";

        }

    }
);


// =========================================
// LOGOUT
// =========================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


logoutBtn.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "patient"
        );


        window.location.href =
            "patient-login.html";

    }
);