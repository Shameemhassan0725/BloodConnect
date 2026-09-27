const donorData =
    JSON.parse(localStorage.getItem("donor"));


// Check login

if (!donorData) {

    alert("Please login first.");

    window.location.href = "login.html";

}


// Display donor information

document.getElementById("donorName").textContent =
    donorData.name;

document.getElementById("name").textContent =
    donorData.name;

document.getElementById("email").textContent =
    donorData.email;

document.getElementById("phone").textContent =
    donorData.phone;

document.getElementById("bloodGroup").textContent =
    donorData.bloodGroup;

document.getElementById("age").textContent =
    donorData.age;

document.getElementById("gender").textContent =
    donorData.gender;

document.getElementById("city").textContent =
    donorData.city;


// Display availability

function updateAvailabilityUI() {

    document.getElementById("bloodGroupBadge").textContent =
    donorData.bloodGroup;

document.getElementById("statBloodGroup").textContent =
    donorData.bloodGroup;

document.getElementById("statCity").textContent =
    donorData.city;

document.getElementById("statAvailability").textContent =
    donorData.available
        ? "Available"
        : "Unavailable";

    const status =
        document.getElementById("availabilityStatus");

    const button =
        document.getElementById("availabilityBtn");


    if (donorData.available === true) {

        status.textContent =
            "🟢 You are currently AVAILABLE";

        status.className = "available";

        button.textContent =
            "Set as Unavailable";

    } else {

        status.textContent =
            "🔴 You are currently UNAVAILABLE";

        status.className = "unavailable";

        button.textContent =
            "Set as Available";

    }

}


// Initial display

updateAvailabilityUI();


// Change availability

document
    .getElementById("availabilityBtn")
    .addEventListener("click", async () => {

        const newAvailability =
            !donorData.available;


        try {

            const response = await fetch(
                `http://localhost:5000/api/donors/${donorData.id}/availability`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        available: newAvailability
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update availability"
                );

            }


            // Update localStorage

            donorData.available =
                data.donor.available;


            localStorage.setItem(
                "donor",
                JSON.stringify(donorData)
            );


            updateAvailabilityUI();


            document.getElementById(
                "availabilityMessage"
            ).textContent =
                "Availability updated successfully!";


        } catch (error) {

            console.error(error);

            document.getElementById(
                "availabilityMessage"
            ).textContent =
                "Unable to update availability.";

        }

    });


// Logout

document
    .getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.removeItem("donor");

        window.location.href = "login.html";

    });
    // =========================================
// LOAD MATCHING BLOOD REQUESTS
// =========================================

async function loadDonorRequests() {

    const donorData =
        JSON.parse(
            localStorage.getItem("donor")
        );


    if (!donorData) {

        return;

    }


    const container =
        document.getElementById(
            "donorRequestsContainer"
        );


    if (!container) {

        return;

    }


    try {

        const response =
            await fetch(
                `http://localhost:5000/api/requests/donor/${donorData.id}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load requests"
            );

        }


        const requests =
            await response.json();


        // No matching requests
        if (requests.length === 0) {

            container.innerHTML = `

                <div class="no-donor-requests">

                    <div class="no-donor-request-icon">
                        🩸
                    </div>

                    <h3>
                        No Matching Requests
                    </h3>

                    <p>
                        There are currently no pending
                        blood requests matching your
                        blood group and city.
                    </p>

                </div>

            `;

            return;

        }


        // Clear loading
        container.innerHTML = "";


        requests.forEach(request => {

            const card =
                document.createElement("div");

            card.className =
                "donor-request-card";


            card.innerHTML = `

                <div class="donor-request-top">

                    <div>

                        <span class="donor-request-label">
                            Blood Required
                        </span>

                        <strong class="donor-request-blood">
                            🩸 ${request.bloodGroup}
                        </strong>

                    </div>


                    <span class="donor-urgency">
                        ${request.urgency}
                    </span>

                </div>


                <div class="donor-request-details">

                    <div>

                        <span>
                            Patient
                        </span>

                        <strong>
                            ${request.patientName}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Units
                        </span>

                        <strong>
                            ${request.units}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Hospital
                        </span>

                        <strong>
                            ${request.hospital}
                        </strong>

                    </div>


                    <div>

                        <span>
                            City
                        </span>

                        <strong>
                            ${request.city}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Required Date
                        </span>

                        <strong>
                            ${formatDonorDate(
                                request.requiredDate
                            )}
                        </strong>

                    </div>

                </div>


                ${
                    request.message
                    ?
                    `
                    <div class="donor-request-message">

                        <span>
                            Additional Message
                        </span>

                        <p>
                            ${request.message}
                        </p>

                    </div>
                    `
                    :
                    ""
                }


                <button
                    class="accept-request-btn"
                    onclick="acceptBloodRequest(${request.id})">

                    Accept Blood Request

                </button>

            `;


            container.appendChild(card);

        });

    }

    catch (error) {

        console.error(
            "Donor request error:",
            error
        );


        container.innerHTML = `

            <div class="donor-requests-error">

                Unable to load blood requests.

                <button
                    onclick="loadDonorRequests()">

                    Try Again

                </button>

            </div>

        `;

    }

}


// =========================================
// ACCEPT BLOOD REQUEST
// =========================================

async function acceptBloodRequest(requestId) {

    const donorData =
        JSON.parse(
            localStorage.getItem("donor")
        );


    if (!donorData) {

        window.location.href =
            "login.html";

        return;

    }


    const confirmAccept =
        confirm(
            "Are you sure you want to accept this blood request?"
        );


    if (!confirmAccept) {

        return;

    }


    try {

        const response =
            await fetch(
                `http://localhost:5000/api/requests/${requestId}/accept`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        donorId:
                            donorData.id,

                        donorName:
                            donorData.name

                    })

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Unable to accept request"
            );

            return;

        }


        alert(
            "Blood request accepted successfully!"
        );


        // Reload requests
        loadDonorRequests();

    }

    catch (error) {

        console.error(
            "Accept request error:",
            error
        );

        alert(
            "Unable to connect to server."
        );

    }

}


// =========================================
// FORMAT DATE
// =========================================

function formatDonorDate(dateString) {

    if (!dateString) {

        return "Not specified";

    }


    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// =========================================
// LOAD REQUESTS WHEN PAGE LOADS
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadDonorRequests();

    }
);