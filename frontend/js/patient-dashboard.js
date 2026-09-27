// =========================================
// PATIENT DASHBOARD
// =========================================

const patientData = JSON.parse(
    localStorage.getItem("patient")
);


// =========================================
// CHECK LOGIN
// =========================================

if (!patientData) {

    window.location.href = "patient-login.html";

}


// =========================================
// DISPLAY PATIENT INFORMATION
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    // If patient is not logged in, stop
    if (!patientData) {
        return;
    }


    // =========================================
    // WELCOME SECTION
    // =========================================

    const patientName =
        document.getElementById("patientName");

    if (patientName) {
        patientName.textContent = patientData.name;
    }


    // =========================================
    // STATISTICS
    // =========================================

    const patientCity =
        document.getElementById("patientCity");

    if (patientCity) {
        patientCity.textContent = patientData.city;
    }


    const patientBloodGroup =
        document.getElementById("patientBloodGroup");

    if (patientBloodGroup) {
        patientBloodGroup.textContent = "Not Set";
    }


    // =========================================
    // PROFILE INFORMATION
    // =========================================

    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");

    const profilePhone =
        document.getElementById("profilePhone");

    const profileAge =
        document.getElementById("profileAge");

    const profileGender =
        document.getElementById("profileGender");

    const profileCity =
        document.getElementById("profileCity");


    if (profileName) {
        profileName.textContent = patientData.name;
    }


    if (profileEmail) {
        profileEmail.textContent = patientData.email;
    }


    if (profilePhone) {
        profilePhone.textContent = patientData.phone;
    }


    if (profileAge) {
        profileAge.textContent = patientData.age;
    }


    if (profileGender) {
        profileGender.textContent = patientData.gender;
    }


    if (profileCity) {
        profileCity.textContent = patientData.city;
    }


    // =========================================
    // LOAD BLOOD REQUESTS
    // =========================================

    loadPatientRequests();


    // =========================================
    // CREATE BLOOD REQUEST BUTTON
    // =========================================

    const requestBloodBtn =
        document.getElementById("requestBloodBtn");

    if (requestBloodBtn) {

        requestBloodBtn.addEventListener("click", () => {

            window.location.href = "blood-request.html";

        });

    }


    // =========================================
    // LOGOUT
    // =========================================

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", () => {

            localStorage.removeItem("patient");

            window.location.href =
                "patient-login.html";

        });

    }

});


// =========================================
// LOAD PATIENT REQUESTS
// =========================================

async function loadPatientRequests() {

    const container =
        document.getElementById(
            "patientRequestsContainer"
        );


    if (!container) {
        return;
    }


    try {

        // =========================================
        // GET PATIENT REQUESTS
        // =========================================

        const response = await fetch(
            `http://localhost:5000/api/requests/patient/${patientData.id}`
        );


        if (!response.ok) {

            throw new Error(
                "Unable to load requests"
            );

        }


        const requests =
            await response.json();


        // =========================================
        // UPDATE REQUEST COUNT
        // =========================================

        const requestCount =
            document.getElementById("requestCount");


        if (requestCount) {

            requestCount.textContent =
                requests.length;

        }


        // =========================================
        // NO REQUESTS
        // =========================================

        if (requests.length === 0) {

            container.innerHTML = `

                <div class="no-requests">

                    <div class="no-requests-icon">
                        🩸
                    </div>

                    <h3>No Blood Requests Yet</h3>

                    <p>
                        You haven't submitted any blood
                        requests yet.
                    </p>

                    <a
                        href="blood-request.html"
                        class="request-now-btn"
                    >
                        Request Blood
                    </a>

                </div>

            `;

            return;

        }


        // =========================================
        // CLEAR CONTAINER
        // =========================================

        container.innerHTML = "";


        // =========================================
        // NEWEST REQUEST FIRST
        // =========================================

        const sortedRequests =
            [...requests].reverse();


        // =========================================
        // DISPLAY REQUESTS
        // =========================================

        sortedRequests.forEach(request => {

            const requestCard =
                document.createElement("div");


            requestCard.className =
                "patient-request-card";


            // =========================================
            // STATUS CLASS
            // =========================================

            let statusClass =
                "status-pending";


            if (
                request.status &&
                request.status.toLowerCase() === "matched"
            ) {

                statusClass =
                    "status-matched";

            }


            else if (
                request.status &&
                request.status.toLowerCase() === "completed"
            ) {

                statusClass =
                    "status-completed";

            }


            else if (
                request.status &&
                request.status.toLowerCase() === "cancelled"
            ) {

                statusClass =
                    "status-cancelled";

            }


            // =========================================
            // FORMAT DATES
            // =========================================

            const requiredDate =
                formatDate(
                    request.requiredDate
                );


            const createdDate =
                formatDateTime(
                    request.createdAt
                );


            // =========================================
            // REQUEST CARD
            // =========================================

            requestCard.innerHTML = `

                <!-- REQUEST TOP -->

                <div class="request-card-top">

                    <div class="request-blood-group">

                        <span class="blood-drop">
                            🩸
                        </span>

                        <div>

                            <span class="request-label">
                                Blood Group
                            </span>

                            <strong>
                                ${request.bloodGroup}
                            </strong>

                        </div>

                    </div>


                    <span
                        class="request-status ${statusClass}"
                    >
                        ${request.status || "Pending"}
                    </span>

                </div>


                <!-- REQUEST DETAILS -->

                <div class="request-card-details">


                    <div class="request-detail">

                        <span>
                            Units
                        </span>

                        <strong>
                            ${request.units}
                        </strong>

                    </div>


                    <div class="request-detail">

                        <span>
                            Hospital
                        </span>

                        <strong>
                            ${request.hospital}
                        </strong>

                    </div>


                    <div class="request-detail">

                        <span>
                            City
                        </span>

                        <strong>
                            ${request.city}
                        </strong>

                    </div>


                    <div class="request-detail">

                        <span>
                            Required Date
                        </span>

                        <strong>
                            ${requiredDate}
                        </strong>

                    </div>


                    <div class="request-detail">

                        <span>
                            Urgency
                        </span>

                        <strong>
                            ${request.urgency}
                        </strong>

                    </div>


                    <div class="request-detail">

                        <span>
                            Requested On
                        </span>

                        <strong>
                            ${createdDate}
                        </strong>

                    </div>


                </div>


                <!-- PATIENT MESSAGE -->

                ${
                    request.message
                    ?
                    `

                    <div class="request-message">

                        <span>
                            Message
                        </span>

                        <p>
                            ${request.message}
                        </p>

                    </div>

                    `
                    :
                    ""
                }


                <!-- =====================================
                     MATCHED DONOR SECTION
                     ===================================== -->

                ${
                    request.status &&
                    request.status.toLowerCase() === "matched"
                    ?
                    `

                    <div class="matched-donor-section">


                        <!-- MATCHED DONOR HEADER -->

                        <div class="matched-donor-header">

                            <span class="matched-icon">
                                ✓
                            </span>


                            <div>

                                <h3>
                                    Donor Matched
                                </h3>

                                <p>
                                    A donor has accepted
                                    your blood request.
                                </p>

                            </div>

                        </div>


                        <!-- DONOR DETAILS -->

                        <div class="matched-donor-details">


                            <!-- DONOR NAME -->

                            <div class="matched-detail">

                                <span>
                                    Donor Name
                                </span>

                                <strong>
                                    ${
                                        request.donorName ||
                                        "Not available"
                                    }
                                </strong>

                            </div>


                            <!-- BLOOD GROUP -->

                            <div class="matched-detail">

                                <span>
                                    Blood Group
                                </span>

                                <strong>
                                    ${
                                        request.donorBloodGroup ||
                                        request.bloodGroup
                                    }
                                </strong>

                            </div>


                            <!-- PHONE -->

                            <div class="matched-detail">

                                <span>
                                    Phone
                                </span>

                                <strong>
                                    ${
                                        request.donorPhone ||
                                        "Not available"
                                    }
                                </strong>

                            </div>


                            <!-- CITY -->

                            <div class="matched-detail">

                                <span>
                                    City
                                </span>

                                <strong>
                                    ${
                                        request.donorCity ||
                                        request.city
                                    }
                                </strong>

                            </div>


                        </div>


                        <!-- =================================
                             MARK AS COMPLETED BUTTON
                             ================================= -->

                        <button
                            class="complete-request-btn"
                            onclick="completeRequest(${request.id})"
                        >
                            Mark as Completed
                        </button>


                    </div>

                    `
                    :
                    ""
                }


            `;


            // =========================================
            // ADD CARD TO PAGE
            // =========================================

            container.appendChild(
                requestCard
            );

        });

    }


    catch (error) {

        console.error(
            "Error loading patient requests:",
            error
        );


        container.innerHTML = `

            <div class="requests-error">

                <h3>
                    Unable to load requests
                </h3>

                <p>
                    Please make sure the BloodConnect
                    server is running.
                </p>

                <button
                    onclick="loadPatientRequests()"
                >
                    Try Again
                </button>

            </div>

        `;

    }

}


// =========================================
// MARK REQUEST AS COMPLETED
// =========================================

async function completeRequest(requestId) {

    // =========================================
    // CONFIRMATION
    // =========================================

    const confirmComplete = confirm(
        "Has the blood donation been completed?"
    );


    if (!confirmComplete) {

        return;

    }


    try {

        // =========================================
        // SEND REQUEST TO BACKEND
        // =========================================

        const response =
            await fetch(
                `http://localhost:5000/api/requests/${requestId}/complete`,
                {
                    method: "PUT"
                }
            );


        // =========================================
        // GET SERVER RESPONSE
        // =========================================

        const result =
            await response.json();


        // =========================================
        // ERROR RESPONSE
        // =========================================

        if (!response.ok) {

            alert(
                result.message ||
                "Unable to complete request"
            );

            return;

        }


        // =========================================
        // SUCCESS
        // =========================================

        alert(
            "Blood request marked as completed!"
        );


        // Reload request list
        loadPatientRequests();

    }


    catch (error) {

        console.error(
            "Complete request error:",
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

function formatDate(dateString) {

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
// FORMAT DATE + TIME
// =========================================

function formatDateTime(dateString) {

    if (!dateString) {

        return "Not available";

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