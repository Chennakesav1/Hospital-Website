const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. Email Transporter Setup ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// --- 2. Google Sheets Setup ---
// This logs your server into Google using the credentials in your .env file
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        // The .replace() fixes how standard text editors handle newline characters
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });
const SHEET_ID = process.env.SPREADSHEET_ID;

// --- Route for Appointments ---
app.post('/api/appointments', async (req, res) => {
    try {
        const { patientName, phone, email, place, appointmentDate, appointmentTime, selectedDoctor } = req.body;
        values: [
            [patientName, parentName, phone, email, place, appointmentDate, appointmentTime, selectedDoctor]
        ]


        const selectedDate = new Date(appointmentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return res.status(400).json({ error: 'You cannot book an appointment in the past.' });
        }

        // --- 3. Check Google Sheet for 2-Day Cooldown ---
        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: SHEET_ID,
                range: 'Appointments!A:G' // Reads Columns A through G
            });

            const rows = response.data.values || [];
            let canBook = true;
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

            // Loop through existing rows in the cloud
            for (let i = 1; i < rows.length; i++) { // Start at 1 to skip header
                const rowPatient = rows[i][0]; // Column A
                const rowParent = rows[i][1];  // Column B
                const rowSubmittedAt = new Date(rows[i][6]); // Column G

                if (rowPatient === patientName && rowParent === parentName) {
                    if (rowSubmittedAt > twoDaysAgo) {
                        canBook = false;
                    }
                }
            }

            if (!canBook) {
                return res.status(400).json({
                    error: 'You have already booked an appointment recently. Please wait 2 days before booking another one.'
                });
            }
        } catch (err) {
            console.error("Warning: Could not read Google Sheet for cooldown check.", err.message);
        }

        // --- 4. Send Success Message to User Immediately ---
        res.status(201).json({ message: 'Appointment processing in background!' });
        console.log(`Received appointment for ${patientName}. Processing...`);

        // --- 5. Send Email Notification ---
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // sends to yourself
            subject: `New Appointment: ${patientName}`,
            text: ` You have a new appointment!
      
            Patient: ${patientName}
            Phone: ${phone}
            Email: ${email}
            Place: ${place}
            Date: ${appointmentDate}
            Time: ${appointmentTime}
            Doctor: ${selectedDoctor}
                                      `
        };

        transporter.sendMail(mailOptions).catch(err => console.error("Email failed:", err));

        // --- 6. Append Data to Google Sheets ---
        const rowData = [
            patientName,
            phone,
            email,
        
            place,
            appointmentDate,
            appointmentTime,
            selectedDoctor,
            new Date().toISOString()
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: 'Appointments!A:G',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [rowData]
            }
        });

        console.log(`✅ Success! Data successfully written to Google Sheets for ${patientName}.`);

    } catch (error) {
        console.error("Backend Error:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to process appointment.' });
        }
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running! Connected to Google Sheets.`);
});