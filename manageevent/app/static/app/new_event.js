export function create_event(event, form) {
    event.preventDefault(); // Prevent normal form submission
    const createEventURL = document.getElementById('create-event-form').getAttribute('data-create-url');
    let formData = new FormData(form);

    // Create an object from FormData to send as JSON
    let data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Disable the button to prevent multiple submissions
    const submitButton = document.getElementById('create-event-btn');
    submitButton.disabled = true;
    submitButton.innerText = 'Submitting...';

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
        form.reset();
        document.getElementById("create-event-form").style.display = "none";
        submitButton.innerText = "Create New Event";
        submitButton.classList.remove('btn-danger');
        submitButton.classList.add('btn-primary');
        submitButton.disabled = false; // Enable button again

        // Redirect to the invitation page with the event ID
        const invitationPageURL = `send-invitation/${data.id}`; 
        console.log(invitationPageURL); // Replace with your backend route
        window.location.href = invitationPageURL;
    })
    .catch(error => {
        submitButton.disabled = false; // Enable button in case of error
        submitButton.innerText = "Create New Event";
        alert("An error occurred: " + error.message);
    });
}
