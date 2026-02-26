// --- Image Slider Logic ---
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}
// Change slide every 4 seconds
setInterval(nextSlide, 4000);


// --- Modal & Form Logic ---
const modal = document.getElementById("appointmentModal");
const form = document.getElementById("appointmentForm");
const successMessage = document.getElementById("successMessage");

function openModal() {
    modal.style.display = "block";
    form.style.display = "block";
    successMessage.classList.add("hidden");
    form.reset();
}

function closeModal() {
    modal.style.display = "none";
}

// Close modal if user clicks outside of it
window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
}

// --- Prevent Past Dates in Calendar ---
const dateInput = document.querySelector('input[type="date"]');
if (dateInput) {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    // Set the minimum selectable date to today
    dateInput.setAttribute('min', today);
}


// --- Handle Form Submission (To Local Node Server) ---
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.innerText = "Saving...";

    // Convert form data to a clean JSON object
    const formData = new FormData(form);
    const data = {
    patientName: formData.get("Patient_Name"),
    phone: formData.get("Phone_Number"), // <-- Added Phone
    email: formData.get("Email_Address"), // <-- Added Email
    place: formData.get("Place"),
    appointmentDate: formData.get("Appointment_Date"),
    appointmentTime: formData.get("Appointment_Time"),
    selectedDoctor: formData.get("Selected_Doctor") || "General"
};

    try {
        // Pointing to your new local Node.js backend
        // Make sure you keep the /api/appointments at the very end!
        const response = await fetch("https://hospital-backend-zv0l.onrender.com/api/appointments", {
            method: "POST",
            // ... the rest of your code stays exactly the same
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        // Parse the JSON response from the backend to get the success/error messages
        const result = await response.json();

        if (response.ok) {
            form.style.display = "none";
            successMessage.classList.remove("hidden");

            setTimeout(() => {
                closeModal();
                form.reset();
                submitBtn.innerText = "Register";
                form.style.display = "block";
                successMessage.classList.add("hidden");
            }, 3000);
        } else {
            // Display the specific error message sent from the backend (e.g., the 2-day rule)
            alert(result.error || "An error occurred while booking.");
            submitBtn.innerText = "Register";
        }
    } catch (error) {
        alert("Server error: Is your Node server running?");
        submitBtn.innerText = "Register";
    }
});


// --- Animated Performance Counters ---
const counters = document.querySelectorAll('.counter');
const speed = 200; // Lower number = faster animation

// Function to start animation when scrolled into view
function animateCounters() {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;

            // Calculate increment
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target + "+";
            }
        };
        updateCount();
    });
}

// Simple Intersection Observer to trigger counter animation when section is visible
const performanceSection = document.getElementById('performance');
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        animateCounters();
        observer.disconnect(); // Only animate once
    }
});

if (performanceSection) {
    observer.observe(performanceSection);
}


// --- Contact Form Logic with Formspree ---
const contactForm = document.getElementById("contactForm");
const contactSuccess = document.getElementById("contactSuccess");
const contactSubmitBtn = document.getElementById("contactSubmitBtn");

contactForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent page reload

    // Gather all the data from the contact form
    const formData = new FormData(contactForm);

    // Change button text to show loading state
    contactSubmitBtn.innerText = "Sending...";

    try {
        // Sending to your actual Formspree endpoint URL
        const response = await fetch("https://formspree.io/f/xbdaqvwn", {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Success! Hide form and show success message
            contactForm.style.display = "none";
            contactSuccess.classList.remove("hidden");

            // Auto reset the form after 3 seconds
            setTimeout(() => {
                contactForm.reset();
                contactSubmitBtn.innerText = "Send Message";
                // Restore the display property used in your CSS for this form
                contactForm.style.display = "flex";
                contactSuccess.classList.add("hidden");
            }, 3000);
        } else {
            alert("Oops! There was a problem sending your message.");
            contactSubmitBtn.innerText = "Send Message";
        }
    } catch (error) {
        alert("Oops! Network error. Please try again.");
        contactSubmitBtn.innerText = "Send Message";
    }
});