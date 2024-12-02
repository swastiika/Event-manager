import { showEvent, showProfile, showInvitations} from "./function.js";
import { create_event } from "./new_event.js";

document.addEventListener("DOMContentLoaded", () => {
    const blockView = document.getElementById('block-container');
    const publicEvent = document.getElementById("public-events");
    const profileView = document.getElementById("profile");
    const createEventBtn = document.getElementById("create-event-btn");
    const createEventForm = document.getElementById("create-event-form");
    const eventMode = document.getElementById("event_mode");
    const venueField = document.getElementById("venue-field");
    const linkField = document.getElementById("link-field");
    const eventForm = document.getElementById("event-form");
    const invitationForm = document.getElementById("send_invitation");
    const homeButton = document.querySelector("#home");
    const invitations = document.querySelector('#invitations');
    const calendarEl = document.querySelector('#calendar');

    if (calendarEl) {
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth', // Default view is month
            locale: 'en', // Set locale (optional)
    
            // Fetch the events from your API endpoint
            events: function (info, successCallback, failureCallback) {
                fetch('/accepted_events') // Adjust the URL to your API
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Map your API response to FullCalendar's format
                        const events = data.map(event => ({
                            title: event.title,
                            start: event.date, // Map 'date' to 'start'
                            extendedProps: {
                                location: event.location // Add custom property
                            }
                        }));
                        successCallback(events); // Pass the adapted events to FullCalendar
                    })
                    .catch(error => {
                        console.error('Error fetching events:', error);
                        failureCallback(error); // Handle errors if needed
                    });
            },
    
            // Event click handler to display location or custom info
            eventClick: function(info) {
                alert(`Event: ${info.event.title}\nLocation: ${info.event.extendedProps.location}`);
            }
        });
    
        calendar.render(); // Render the calendar
    }
    
    
    
    
    if (publicEvent) {
        publicEvent.addEventListener("click", ()=>{
            showEvent();
        })
    }

    if (profileView) {
        profileView.addEventListener("click",()=>{
            showProfile();
            blockView.style.display = 'none';
        });
    }
    if (invitations){
        invitations.addEventListener("click",function(){
            showInvitations();
        })
    }
    if (calendarEl) {
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth', // Default view is month
            locale: 'en', // Set locale (optional)
    
            events: function (info, successCallback, failureCallback) {
                fetch('/accepted_events') // Adjust the URL to your API
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Map your API response to FullCalendar's format
                        const events = data.map(event => ({
                            title: event.title,
                            start: event.date, // Map 'date' to 'start'
                            extendedProps: {
                                location: event.location // Add custom property
                            }
                        }));
                        successCallback(events); // Pass the adapted events to FullCalendar
                    })
                    .catch(error => {
                        console.error('Error fetching events:', error);
                        failureCallback(error); // Handle errors if needed
                    });
            },
    
            // Event click handler to display a pop-up
            eventClick: function(info) {
                const popup = document.getElementById("event-popup");
    
                // Populate the popup with event details
                popup.innerHTML = `
                    <strong>${info.event.title}</strong><br>
                    Location: ${info.event.extendedProps.location || 'N/A'}<br>
                    Date: ${info.event.start.toLocaleDateString()}
                `;
    
                // Get the event's coordinates
                const rect = info.el.getBoundingClientRect();
                popup.style.top = `${rect.top + window.scrollY - 10}px`;
                popup.style.left = `${rect.left + window.scrollX + 50}px`;
    
                // Show the popup
                popup.style.display = "block";
    
                // Hide the popup when clicking outside
                document.addEventListener("click", function hidePopup(event) {
                    if (!popup.contains(event.target) && event.target !== info.el) {
                        popup.style.display = "none";
                        document.removeEventListener("click", hidePopup);
                    }
                });
            }
        });
    
        calendar.render(); // Render the calendar
    }
    
    
    // Home button redirect
    if (homeButton) {
        homeButton.addEventListener("click", function (event) {
            event.preventDefault();
            const homePageURL = "http://127.0.0.1:8000/"; // Replace with your actual home URL
            window.location.href = homePageURL;
        });
    }

    // Toggle create event form visibility
    if (createEventBtn) {
        createEventBtn.addEventListener("click", () => {
            const isFormHidden = createEventForm.style.display === "none" || createEventForm.style.display === "";
            calendarEl.style.display = isFormHidden ? "none" : ""; 
            createEventForm.style.display = isFormHidden ? "block" : "none";
            createEventBtn.innerText = isFormHidden ? "Cancel" : "Create New Event";
            createEventBtn.classList.toggle("btn-primary", !isFormHidden);
            createEventBtn.classList.toggle("btn-danger", isFormHidden);
        });

        // Toggle venue/link fields based on event mode
        if (eventMode) {
            eventMode.addEventListener("change", () => {
                const isOffline = eventMode.value === "offline";
                const isOnline = eventMode.value === "online";

                venueField.style.display = isOffline ? "block" : "none";
                linkField.style.display = isOnline ? "block" : "none";
            });
        }

        // Handle event form submission
        if (eventForm) {
            eventForm.addEventListener("submit", function (event) {
                create_event(event, eventForm); // Call the create_event function
            });
        }
    }
    if (invitationForm) {
        invitationForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;
            const emailInput = document.querySelector("#email").value;
            const emails = emailInput.split(",").map((email) => email.trim());
            const eventId = 3; // Update this dynamically if needed
            const rsvpStatus = "Pending";

            console.log("Event ID being used:", eventId);

            const data = emails.map((email) => ({
                event: eventId,
                recipient : email,
                rsvp_status: rsvpStatus,
            }));

            fetch(`http://127.0.0.1:8000/send-invitation/${eventId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                body: JSON.stringify(data),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((responseData) => {
                    invitationForm.reset();
                    console.log("Invitation sent successfully:", responseData);
                })
                .catch((error) => {
                    console.error("Error sending invitations:", error);
                });
        });
    }
});
