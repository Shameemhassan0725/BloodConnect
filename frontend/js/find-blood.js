const searchForm =
    document.getElementById("searchForm");

const donorResults =
    document.getElementById("donorResults");

const searchMessage =
    document.getElementById("searchMessage");


searchForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const bloodGroup =
            document.getElementById(
                "searchBloodGroup"
            ).value;


        const city =
            document.getElementById(
                "searchCity"
            ).value.trim();


        donorResults.innerHTML = "";

        searchMessage.textContent =
            "Searching for donors...";

        searchMessage.style.color =
            "#555";


        try {

            const response = await fetch(

                `http://localhost:5000/api/donors/search?bloodGroup=${encodeURIComponent(bloodGroup)}&city=${encodeURIComponent(city)}`

            );


            const data =
                await response.json();


            if (!response.ok) {

                searchMessage.textContent =
                    data.message ||
                    "Search failed.";

                searchMessage.style.color =
                    "red";

                return;

            }


            searchMessage.textContent =
                `${data.length} donor(s) found`;

            searchMessage.style.color =
                "green";


            if (data.length === 0) {

                donorResults.innerHTML = `

                    <div class="no-results">

                        <h3>
                            No donors found
                        </h3>

                        <p>
                            No available donors were
                            found for ${bloodGroup}
                            in ${city}.
                        </p>

                    </div>

                `;

                return;

            }


            data.forEach(donor => {

                const card =
                    document.createElement("div");


                card.className =
                    "donor-card";


                card.innerHTML = `

                    <h3>
                        ${donor.name}
                    </h3>

                    <span class="blood-badge">
                        ${donor.bloodGroup}
                    </span>

                    <div class="donor-info">

                        <div>
                            📍 ${donor.city}
                        </div>

                        <div>
                            👤 ${donor.age} years
                        </div>

                        <div>
                            ${donor.gender}
                        </div>

                    </div>

                    <div class="available-status">
                        ● Available
                    </div>

                    <a
                        href="tel:${donor.phone}"
                        class="contact-btn"
                    >
                        📞 Contact Donor
                    </a>

                `;


                donorResults.appendChild(card);

            });

        } catch (error) {

            console.error(error);


            searchMessage.textContent =
                "Cannot connect to the server.";

            searchMessage.style.color =
                "red";

        }

    }
);