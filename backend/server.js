const bcrypt = require("bcryptjs");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 5000;


// =========================================
// MIDDLEWARE
// =========================================

app.use(cors());

app.use(express.json());


// =========================================
// DATABASE FILES
// =========================================

const dataFolder = path.join(
    __dirname,
    "data"
);


const donorsFile = path.join(
    dataFolder,
    "donors.json"
);


const patientsFile = path.join(
    dataFolder,
    "patients.json"
);


const requestsFile = path.join(
    dataFolder,
    "requests.json"
);


// =========================================
// CREATE DATA FOLDER IF NEEDED
// =========================================

if (!fs.existsSync(dataFolder)) {

    fs.mkdirSync(dataFolder);

}


// =========================================
// CREATE donors.json IF NEEDED
// =========================================

if (!fs.existsSync(donorsFile)) {

    fs.writeFileSync(
        donorsFile,
        "[]"
    );

}


// =========================================
// CREATE patients.json IF NEEDED
// =========================================

if (!fs.existsSync(patientsFile)) {

    fs.writeFileSync(
        patientsFile,
        "[]"
    );

}


// =========================================
// CREATE requests.json IF NEEDED
// =========================================

if (!fs.existsSync(requestsFile)) {

    fs.writeFileSync(
        requestsFile,
        "[]"
    );

}


// =========================================
// HOME ROUTE
// =========================================

app.get("/", (req, res) => {

    res.send(
        "BloodConnect API is running"
    );

});


// =========================================
// TEST ROUTE
// =========================================

app.get("/api/test", (req, res) => {

    res.json({

        message:
            "Backend connected successfully"

    });

});


// =========================================
// GET ALL DONORS
// =========================================

app.get("/api/donors", (req, res) => {

    try {

        const data =
            fs.readFileSync(
                donorsFile,
                "utf8"
            );


        const donors =
            JSON.parse(data);


        res.json(donors);


    } catch (error) {

        console.error(
            "Error reading donors:",
            error
        );


        res.status(500).json({

            message:
                "Unable to read donor data"

        });

    }

});


// =========================================
// SEARCH DONORS
// =========================================

app.get(
    "/api/donors/search",
    (req, res) => {

        try {

            const bloodGroup =
                req.query.bloodGroup;

            const city =
                req.query.city;


            if (!bloodGroup || !city) {

                return res.status(400).json({

                    message:
                        "Blood group and city are required"

                });

            }


            const data =
                fs.readFileSync(
                    donorsFile,
                    "utf8"
                );


            const donors =
                JSON.parse(data);


            const matchingDonors =
                donors.filter(

                    donor =>

                        donor.bloodGroup
                            .toLowerCase()
                        ===
                        bloodGroup.toLowerCase()

                        &&

                        donor.city
                            .toLowerCase()
                        ===
                        city.toLowerCase()

                        &&

                        donor.available === true

                );


            res.json(
                matchingDonors
            );


        } catch (error) {

            console.error(
                "Search error:",
                error
            );


            res.status(500).json({

                message:
                    "Unable to search donors"

            });

        }

    }
);


// =========================================
// REGISTER DONOR
// =========================================

app.post(
    "/api/donors",
    async (req, res) => {

        try {

            console.log(
                "================================"
            );

            console.log(
                "New donor registration received"
            );

            console.log(req.body);

            console.log(
                "================================"
            );


            const {
                name,
                email,
                password,
                phone,
                bloodGroup,
                age,
                gender,
                city
            } = req.body;


            // Validation

            if (
                !name ||
                !email ||
                !password ||
                !phone ||
                !bloodGroup ||
                !age ||
                !gender ||
                !city
            ) {

                return res.status(400).json({

                    message:
                        "Please fill all fields"

                });

            }


            // Read existing donors

            const data =
                fs.readFileSync(
                    donorsFile,
                    "utf8"
                );


            const donors =
                JSON.parse(data);


            // Check duplicate email

            const existingDonor =
                donors.find(

                    donor =>
                        donor.email.toLowerCase()
                        ===
                        email.toLowerCase()

                );


            if (existingDonor) {

                return res.status(409).json({

                    message:
                        "Email is already registered"

                });

            }


            // Hash password

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );


            // Create donor

            const newDonor = {

                id: Date.now(),

                name: name,

                email: email,

                password:
                    hashedPassword,

                phone: phone,

                bloodGroup:
                    bloodGroup,

                age: Number(age),

                gender: gender,

                city: city,

                available: true

            };


            // Add donor

            donors.push(
                newDonor
            );


            // Save donor

            fs.writeFileSync(

                donorsFile,

                JSON.stringify(
                    donors,
                    null,
                    2
                )

            );


            console.log(
                "Donor saved successfully"
            );


            // Response

            res.status(201).json({

                success: true,

                message:
                    "Donor registered successfully",

                donor:
                    newDonor

            });


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Server error"

            });

        }

    }
);


// =========================================
// DONOR LOGIN
// =========================================

app.post(
    "/api/login",
    async (req, res) => {

        try {

            const {
                email,
                password
            } = req.body;


            if (!email || !password) {

                return res.status(400).json({

                    message:
                        "Email and password are required"

                });

            }


            const data =
                fs.readFileSync(
                    donorsFile,
                    "utf8"
                );


            const donors =
                JSON.parse(data);


            const donor =
                donors.find(

                    donor =>
                        donor.email.toLowerCase()
                        ===
                        email.toLowerCase()

                );


            if (!donor) {

                return res.status(401).json({

                    message:
                        "Invalid email or password"

                });

            }


            const passwordMatch =
                await bcrypt.compare(
                    password,
                    donor.password
                );


            if (!passwordMatch) {

                return res.status(401).json({

                    message:
                        "Invalid email or password"

                });

            }


            // Do not send password

            const safeDonor = {

                id: donor.id,

                name: donor.name,

                email: donor.email,

                phone: donor.phone,

                bloodGroup:
                    donor.bloodGroup,

                age: donor.age,

                gender: donor.gender,

                city: donor.city,

                available:
                    donor.available

            };


            res.json({

                success: true,

                message:
                    "Login successful",

                donor:
                    safeDonor

            });


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


// =========================================
// UPDATE DONOR AVAILABILITY
// =========================================

app.put(
    "/api/donors/:id/availability",
    (req, res) => {

        try {

            const donorId =
                req.params.id;

            const {
                available
            } = req.body;


            if (
                typeof available !==
                "boolean"
            ) {

                return res.status(400).json({

                    message:
                        "Availability must be true or false"

                });

            }


            // Read donors

            const data =
                fs.readFileSync(
                    donorsFile,
                    "utf8"
                );


            const donors =
                JSON.parse(data);


            // Find donor

            const donorIndex =
                donors.findIndex(

                    donor =>
                        donor.id.toString()
                        ===
                        donorId

                );


            if (donorIndex === -1) {

                return res.status(404).json({

                    message:
                        "Donor not found"

                });

            }


            // Update availability

            donors[donorIndex].available =
                available;


            // Save

            fs.writeFileSync(

                donorsFile,

                JSON.stringify(
                    donors,
                    null,
                    2
                )

            );


            res.json({

                success: true,

                message:
                    "Availability updated successfully",

                donor:
                    donors[donorIndex]

            });


        } catch (error) {

            console.error(
                "Availability update error:",
                error
            );


            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


// =========================================
// PATIENT REGISTRATION
// =========================================

app.post(
    "/api/patients",
    async (req, res) => {

        try {

            const {
                name,
                email,
                password,
                phone,
                age,
                gender,
                city
            } = req.body;


            // Validation

            if (
                !name ||
                !email ||
                !password ||
                !phone ||
                !age ||
                !gender ||
                !city
            ) {

                return res.status(400).json({

                    message:
                        "All fields are required"

                });

            }


            // Read patients

            const data =
                fs.readFileSync(
                    patientsFile,
                    "utf8"
                );


            const patients =
                JSON.parse(data);


            // Check duplicate email

            const existingPatient =
                patients.find(

                    patient =>
                        patient.email.toLowerCase()
                        ===
                        email.toLowerCase()

                );


            if (existingPatient) {

                return res.status(409).json({

                    message:
                        "Email is already registered"

                });

            }


            // Hash password

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );


            // Create patient

            const newPatient = {

                id: Date.now(),

                name: name,

                email: email,

                password:
                    hashedPassword,

                phone: phone,

                age: Number(age),

                gender: gender,

                city: city

            };


            // Save patient

            patients.push(
                newPatient
            );


            fs.writeFileSync(

                patientsFile,

                JSON.stringify(
                    patients,
                    null,
                    2
                )

            );


            res.status(201).json({

                success: true,

                message:
                    "Patient registered successfully"

            });


        } catch (error) {

            console.error(
                "Patient registration error:",
                error
            );


            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


// =========================================
// PATIENT LOGIN
// =========================================

app.post(
    "/api/patient-login",
    async (req, res) => {

        try {

            const {
                email,
                password
            } = req.body;


            // Check required fields

            if (!email || !password) {

                return res.status(400).json({

                    message:
                        "Email and password are required"

                });

            }


            // Read patients

            const data =
                fs.readFileSync(
                    patientsFile,
                    "utf8"
                );


            const patients =
                JSON.parse(data);


            // Find patient

            const patient =
                patients.find(

                    patient =>
                        patient.email.toLowerCase()
                        ===
                        email.toLowerCase()

                );


            if (!patient) {

                return res.status(401).json({

                    message:
                        "Invalid email or password"

                });

            }


            // Compare password

            const passwordMatch =
                await bcrypt.compare(
                    password,
                    patient.password
                );


            if (!passwordMatch) {

                return res.status(401).json({

                    message:
                        "Invalid email or password"

                });

            }


            // Safe patient object

            const safePatient = {

                id: patient.id,

                name: patient.name,

                email: patient.email,

                phone: patient.phone,

                age: patient.age,

                gender: patient.gender,

                city: patient.city

            };


            res.json({

                success: true,

                message:
                    "Patient login successful",

                patient:
                    safePatient

            });


        } catch (error) {

            console.error(
                "Patient login error:",
                error
            );


            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


// =========================================
// CREATE BLOOD REQUEST
// =========================================

app.post(
    "/api/requests",
    (req, res) => {

        try {

            const {
                patientId,
                patientName,
                bloodGroup,
                units,
                hospital,
                city,
                requiredDate,
                urgency,
                message
            } = req.body;


            // =================================
            // VALIDATION
            // =================================

            if (
                !patientId ||
                !patientName ||
                !bloodGroup ||
                !units ||
                !hospital ||
                !city ||
                !requiredDate ||
                !urgency
            ) {

                return res.status(400).json({

                    message:
                        "Please fill all required fields"

                });

            }


            // =================================
            // READ REQUESTS
            // =================================

            const data =
                fs.readFileSync(
                    requestsFile,
                    "utf8"
                );


            const requests =
                JSON.parse(data);


            // =================================
            // CREATE REQUEST
            // =================================

            const newRequest = {

                id: Date.now(),

                patientId:
                    patientId,

                patientName:
                    patientName,

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
                    message || "",

                status:
                    "Pending",

                createdAt:
                    new Date().toISOString()

            };


            // =================================
            // SAVE REQUEST
            // =================================

            requests.push(
                newRequest
            );


            fs.writeFileSync(

                requestsFile,

                JSON.stringify(
                    requests,
                    null,
                    2
                )

            );


            // =================================
            // RESPONSE
            // =================================

            res.status(201).json({

                success: true,

                message:
                    "Blood request created successfully",

                request:
                    newRequest

            });


        } catch (error) {

            console.error(
                "Blood request error:",
                error
            );


            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


// =========================================
// GET ALL BLOOD REQUESTS
// =========================================

app.get(
    "/api/requests",
    (req, res) => {

        try {

            const data =
                fs.readFileSync(
                    requestsFile,
                    "utf8"
                );


            const requests =
                JSON.parse(data);


            res.json(
                requests
            );


        } catch (error) {

            console.error(
                "Error reading requests:",
                error
            );


            res.status(500).json({

                message:
                    "Unable to read blood requests"

            });

        }

    }
);


// =========================================
// GET PATIENT REQUESTS
// =========================================

app.get(
    "/api/requests/patient/:patientId",
    (req, res) => {

        try {

            const patientId =
                req.params.patientId;


            const data =
                fs.readFileSync(
                    requestsFile,
                    "utf8"
                );


            const requests =
                JSON.parse(data);


            const patientRequests =
                requests.filter(

                    request =>
                        request.patientId.toString()
                        ===
                        patientId.toString()

                );


            res.json(
                patientRequests
            );


        } catch (error) {

            console.error(
                "Patient requests error:",
                error
            );


            res.status(500).json({

                message:
                    "Unable to read patient requests"

            });

        }

    }
);
// =========================================
// GET MATCHING BLOOD REQUESTS FOR DONOR
// =========================================

app.get("/api/requests/donor/:donorId", (req, res) => {

    try {

        const donorId = req.params.donorId;

        // Read donors
        const donorData =
            fs.readFileSync(donorsFile, "utf8");

        const donors =
            JSON.parse(donorData);

        // Find donor
        const donor =
            donors.find(
                donor =>
                    donor.id.toString() ===
                    donorId.toString()
            );

        if (!donor) {

            return res.status(404).json({
                message: "Donor not found"
            });

        }


        // Read requests
        const requestData =
            fs.readFileSync(requestsFile, "utf8");

        const requests =
            JSON.parse(requestData);


        // Find matching requests
        const matchingRequests =
            requests.filter(request =>

                request.status === "Pending" &&

                request.bloodGroup.toLowerCase()
                === donor.bloodGroup.toLowerCase() &&

                request.city.toLowerCase()
                === donor.city.toLowerCase()

            );


        res.json(matchingRequests);

    }

    catch (error) {

        console.error(
            "Donor requests error:",
            error
        );

        res.status(500).json({
            message: "Unable to load donor requests"
        });

    }

});

// =========================================
// DONOR ACCEPT BLOOD REQUEST
// =========================================

app.put("/api/requests/:requestId/accept", (req, res) => {

    try {

        const requestId =
            req.params.requestId;

        const {
            donorId,
            donorName
        } = req.body;


        if (!donorId || !donorName) {

            return res.status(400).json({
                message: "Donor information is required"
            });

        }


        // Read requests
        const data =
            fs.readFileSync(
                requestsFile,
                "utf8"
            );

        const requests =
            JSON.parse(data);


        // Find request
        const requestIndex =
            requests.findIndex(
                request =>
                    request.id.toString()
                    === requestId.toString()
            );


        if (requestIndex === -1) {

            return res.status(404).json({
                message: "Blood request not found"
            });

        }


        // Check whether already accepted
        if (
            requests[requestIndex].status
            !== "Pending"
        ) {

            return res.status(400).json({
                message:
                    "This request is no longer available"
            });

        }


        // =========================================
// GET DONOR DETAILS
// =========================================

const donorData =
    fs.readFileSync(donorsFile, "utf8");

const donors =
    JSON.parse(donorData);

const donor =
    donors.find(
        donor =>
            donor.id.toString()
            === donorId.toString()
    );


if (!donor) {

    return res.status(404).json({
        message: "Donor not found"
    });

}


// =========================================
// UPDATE REQUEST
// =========================================

requests[requestIndex].status =
    "Matched";

requests[requestIndex].donorId =
    donor.id;

requests[requestIndex].donorName =
    donor.name;

requests[requestIndex].donorPhone =
    donor.phone;

requests[requestIndex].donorBloodGroup =
    donor.bloodGroup;

requests[requestIndex].donorCity =
    donor.city;

requests[requestIndex].matchedAt =
    new Date().toISOString();


        // Save
        fs.writeFileSync(
            requestsFile,
            JSON.stringify(
                requests,
                null,
                2
            )
        );


        res.json({

            success: true,

            message:
                "Blood request accepted successfully",

            request:
                requests[requestIndex]

        });

    }

    catch (error) {

        console.error(
            "Accept request error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });

    }

});

// =========================================
// MARK REQUEST AS COMPLETED
// =========================================

app.put("/api/requests/:requestId/complete", (req, res) => {

    try {

        const requestId = req.params.requestId;

        const data =
            fs.readFileSync(requestsFile, "utf8");

        const requests =
            JSON.parse(data);


        // Find request
        const requestIndex =
            requests.findIndex(
                request =>
                    request.id.toString()
                    === requestId.toString()
            );


        // Request not found
        if (requestIndex === -1) {

            return res.status(404).json({
                message: "Blood request not found"
            });

        }


        // Only matched requests can be completed
        if (
            requests[requestIndex].status !== "Matched"
        ) {

            return res.status(400).json({
                message:
                    "Only matched requests can be marked as completed"
            });

        }


        // Update status
        requests[requestIndex].status =
            "Completed";


        // Add completion time
        requests[requestIndex].completedAt =
            new Date().toISOString();


        // Save requests
        fs.writeFileSync(
            requestsFile,
            JSON.stringify(requests, null, 2)
        );


        // Send response
        res.json({

            success: true,

            message:
                "Blood request marked as completed",

            request:
                requests[requestIndex]

        });

    }


    catch (error) {

        console.error(
            "Complete request error:",
            error
        );

        res.status(500).json({

            message:
                "Server error"

        });

    }

});


// =========================================
// START SERVER
// =========================================

app.listen(
    PORT,
    () => {

        console.log("");

        console.log(
            "================================"
        );

        console.log(
            "      BLOODCONNECT BACKEND"
        );

        console.log(
            "================================"
        );

        console.log(
            `Server: http://localhost:${PORT}`
        );

        console.log(
            `Test:   http://localhost:${PORT}/api/test`
        );

        console.log(
            `Donors: http://localhost:${PORT}/api/donors`
        );

        console.log(
            `Requests: http://localhost:${PORT}/api/requests`
        );

        console.log(
            "================================"
        );

        console.log("");

    }
);