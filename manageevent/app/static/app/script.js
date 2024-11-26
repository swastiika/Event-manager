import { showEvent, showProfile, send_invitation } from "./function.js";
import { create_event } from "./new_event.js";

document.addEventListener("DOMContentLoaded", () => {
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

    // Event Listeners
    if (publicEvent) {
        publicEvent.addEventListener("click", showEvent);
    }

    if (profileView) {
        profileView.addEventListener("click", showProfile);
    }

    if (invitationForm) {
        console.log("Invitation form detected.");

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
                email: email,
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
});
