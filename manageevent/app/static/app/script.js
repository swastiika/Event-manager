document.addEventListener('DOMContentLoaded', () => {
    const createEventBtn = document.getElementById('create-event-btn');
    const createEventForm = document.getElementById('create-event-form');
    const eventMode = document.getElementById('event_mode');
    const venueField = document.getElementById('venue-field');
    const linkField = document.getElementById('link-field');
    const eventForm = document.getElementById("event-form");

    // Toggle form display
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

    // Handle form submission
    eventForm.addEventListener("submit", function (event) {
        create_event(event, eventForm);
    });
});

function create_event(event, form) {
    event.preventDefault(); // Prevent normal form submission
    const createEventURL = document.getElementById('create-event-form').getAttribute('data-create-url');
    let formData = new FormData(form);

    // Create an object from FormData to send as JSON
    let data = {};
    formData.forEach((value, key) => {
        data[key] = value;
        console.log(key);
    });
    console.log(JSON.stringify(data));
    // Use fetch API to send the data as JSON
    fetch(createEventURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: JSON.stringify(data)
        
    })
    .then(response => {
        
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(errorData => {
                throw new Error(errorData.message || "Failed to create event");
            });
        }
    })
    .then(data => {
        alert("Event created successfully!");
        // Optionally, reset the form and hide it
        form.reset();
        document.getElementById("create-event-form").style.display = "none";
        document.getElementById('create-event-btn').innerText = "Create New Event";
        document.getElementById('create-event-btn').classList.remove('btn-danger');
        document.getElementById('create-event-btn').classList.add('btn-primary');
        
    })
    .catch(error => {
        alert("An error occurred: " + error.message);
    });
}
