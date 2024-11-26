import { showEvent,showProfile,send_invitation } from "./function.js";
import { create_event } from "./new_event.js";
document.addEventListener('DOMContentLoaded', () => {
    const publicEvent = document.getElementById("public-events");
    const profileView = document.getElementById("profile");
    const createEventBtn = document.getElementById('create-event-btn');
    const createEventForm = document.getElementById('create-event-form');
    const eventMode = document.getElementById('event_mode');
    const venueField = document.getElementById('venue-field');
    const linkField = document.getElementById('link-field');
    const eventForm = document.getElementById("event-form");
    const invitation_form = document.getElementById("send_invitation");


  
    // Check for the public event and profile button clicks
    if(publicEvent) {
        publicEvent.addEventListener('click', showEvent);
    }

    if(profileView) {
        profileView.addEventListener('click', showProfile); // Attach event listener for profile
    }
    if(invitation_form){


        invitation_form.addEventListener('submit', function (e) {
            e.preventDefault();
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            const emailInput = document.querySelector('#email').value;
            const emails = emailInput.split(",").map(email => email.trim());
            const eventId = 30;
            const rsvpStatus = "Pending";
        
            // Map over emails to construct the data array
            const data = emails.map(email => ({
                event: eventId,
                email: email,
                rsvp_status: rsvpStatus
            }));
        
            // Send the POST request with the constructed data
            fetch('http://127.0.0.1:8000/send-invitation/30', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                body: JSON.stringify(data),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    invitation_form.reset();
                    console.log("Everything okay:", data);
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        });
        
}

    // Home button redirect
    document.querySelector('#home').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default navigation
        const homePageURL = "http://127.0.0.1:8000/"; // Replace with your actual home URL
        window.location.href = homePageURL; // Redirect to the home page
    });

    // Toggle create event form visibility
    if(createEventBtn) {
        createEventBtn.addEventListener('click', () => {
            if (createEventForm.style.display === 'none' || createEventForm.style.display === '') {
                createEventForm.style.display = 'block';
                createEventBtn.innerText = 'Cancel';
                createEventBtn.classList.remove('btn-primary');
                createEventBtn.classList.add('btn-danger');
            } else {
                createEventForm.style.display = 'none';
                createEventBtn.innerText = 'Create New Event';
                createEventBtn.classList.remove('btn-danger');
                createEventBtn.classList.add('btn-primary');
            }
        });

        // Toggle venue/link fields based on event mode
        eventMode.addEventListener('change', () => {
            if (eventMode.value === 'offline') {
                venueField.style.display = 'block';
                linkField.style.display = 'none';
            } else if (eventMode.value === 'online') {
                linkField.style.display = 'block';
                venueField.style.display = 'none';
            } else {
                venueField.style.display = 'none';
                linkField.style.display = 'none';
            }
        });

        // Handle event form submission
        eventForm.addEventListener("submit", function (event) {
            create_event(event, eventForm); // Call the create_event function
        });
    }
});


