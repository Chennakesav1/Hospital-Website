// 1. Create a database of your doctors
const doctorDatabase = {
    smith: {
        name: "Dr. Alan Smith",
        profession: "Senior Cardiologist",
        experience: "<i class='fa-solid fa-award'></i> 15+ Years Experience",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
        description: "Dr. Alan Smith is a highly skilled cardiologist with over 15 years of experience in diagnosing and treating cardiovascular diseases. He is dedicated to providing compassionate, state-of-the-art care focusing on preventative cardiology.",
        specialties: ["Preventative Cardiology", "Echocardiography", "Heart Failure Management"],
        education: ["MD - Johns Hopkins University", "Residency - Mayo Clinic", "Fellowship - American College of Cardiology"]
    },
    jane: {
        name: "Dr. Jane Doe",
        profession: "Lead Neurologist",
        experience: "<i class='fa-solid fa-award'></i> 12+ Years Experience",
        image: "https://images.unsplash.com/photo-1594824436951-7f12bc00fa31?w=400&q=80",
        description: "Dr. Jane Doe specializes in complex neurological disorders. She is known for her pioneering research in nerve regeneration and her holistic approach to patient recovery and stroke rehabilitation.",
        specialties: ["Stroke Rehabilitation", "Epilepsy Management", "Migraine Treatment"],
        education: ["MD - Harvard Medical School", "Residency - Mass General", "Board Certified Neurologist"]
    },
    brown: {
        name: "Dr. Sarah Brown",
        profession: "Pediatrician",
        experience: "<i class='fa-solid fa-award'></i> 8+ Years Experience",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
        description: "Dr. Sarah Brown is a compassionate pediatrician who loves working with children of all ages. From newborn checkups to teenage wellness, she ensures every child feels comfortable and safe.",
        specialties: ["Newborn Care", "Childhood Immunizations", "Adolescent Medicine"],
        education: ["MD - Stanford University", "Residency - Seattle Children's Hospital"]
    },
    lee: {
        name: "Dr. Michael Lee",
        profession: "Orthopedic Surgeon",
        experience: "<i class='fa-solid fa-award'></i> 20+ Years Experience",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
        description: "Dr. Michael Lee is a board-certified orthopedic surgeon specializing in sports injuries and joint replacements. He has worked with top athletes to help them get back on the field.",
        specialties: ["Joint Replacement", "Sports Medicine", "Spinal Surgery"],
        education: ["MD - Yale School of Medicine", "Residency - Hospital for Special Surgery"]
    },
    white: {
        name: "Dr. Emily White",
        profession: "Dermatologist",
        experience: "<i class='fa-solid fa-award'></i> 10+ Years Experience",
        image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80",
        description: "Dr. Emily White is a renowned dermatologist focusing on medical and cosmetic skin treatments. She believes in personalized skincare routines tailored to each patient's unique genetic makeup.",
        specialties: ["Acne Treatment", "Skin Cancer Screening", "Cosmetic Dermatology"],
        education: ["MD - UCLA", "Residency - UCSF Medical Center"]
    }
};

// 2. Get the 'doc' ID from the URL (e.g., ?doc=smith)
const urlParams = new URLSearchParams(window.location.search);
const doctorId = urlParams.get('doc');

// 3. Find the doctor in the database and update the HTML
if (doctorId && doctorDatabase[doctorId]) {
    const doctor = doctorDatabase[doctorId];

    // Update text and images
    document.getElementById('docImage').src = doctor.image;
    document.getElementById('docName').textContent = doctor.name;
    document.getElementById('docProfession').textContent = doctor.profession;
    document.getElementById('docExperience').innerHTML = doctor.experience;
    document.getElementById('docAboutTitle').textContent = "About " + doctor.name;
    document.getElementById('docDescription').textContent = doctor.description;

    // Build the Specialties list dynamically
    const specialtiesList = document.getElementById('docSpecialties');
    doctor.specialties.forEach(specialty => {
        const li = document.createElement('li');
        li.textContent = specialty;
        specialtiesList.appendChild(li);
    });

    // Build the Education list dynamically
    const educationList = document.getElementById('docEducation');
    doctor.education.forEach(edu => {
        const li = document.createElement('li');
        li.textContent = edu;
        educationList.appendChild(li);
    });

} else {
    // If someone types an invalid URL, show an error message
    document.getElementById('docName').textContent = "Doctor Not Found";
    document.getElementById('docDescription').textContent = "Please return to the home page and select a valid doctor profile.";
}