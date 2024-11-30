// Function to render events (you can modify this if needed)
export function renderEvents(events) {
    const container = document.getElementById('events-container');
    
    // Clear any existing content
    container.innerHTML = '';
  
    // Check if events exist
    if (events.length === 0) {
      container.innerHTML = '<p>No events found.</p>';
      return;
    }
  
    // Create and append event elements
    events.forEach((event) => {
      const eventElement = document.createElement('div');
      eventElement.classList.add('event');
      const button = event.is_owner ? `
      <button type="button" class="btn btn-success" onclick="window.location.href='http://127.0.0.1:8000/send-invitation/${event.id}'">View Invitation Status</button>`:'';
      eventElement.innerHTML = `
   <div class="card my-3">
    <div class="card-body">
        <h3 class="card-title">${event.name}</h3>
        <p class="card-text"><strong>Type:</strong> ${event.type}</p>
        <p class="card-text"><strong>Date:</strong> ${event.date}</p>
        <p class="card-text"><strong>Description:</strong> ${event.description}</p>
        <p class="card-text"><strong>Creator:</strong> ${event.owner.username}</p>
        ${button}

    </div>
   </div>

      `;
      container.appendChild(eventElement);
    });
}


export function showEvent(event) {
    // If the event is triggered by a button click, prevent default behavior
    if (event) event.preventDefault();
        // Fetch profile data if on the home page
        fetch('http://127.0.0.1:8000/show_event', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();  // Parse the JSON data from the response
        })
        .then(data => {
            console.log('Fetched profile data:', data);
            renderEvents(data);  // You can render profile or event details
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    
}

export function showProfile(event) {
    // If the event is triggered by a button click, prevent default behavior
    if (event) event.preventDefault();
        // Fetch profile data if on the home page
        fetch('http://127.0.0.1:8000/show_profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();  // Parse the JSON data from the response
        })
        .then(data => {
            console.log('Fetched profile data:', data);
            renderEvents(data);  // You can render profile or event details
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    
}




export function showInvitations(event) {
    // If the event is triggered by a button click, prevent default behavior
    if (event) event.preventDefault();

    // Fetch profile data if on the home page
    fetch('http://127.0.0.1:8000/showInvitations', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the JSON data from the response
        })
        .then(data => {
            const container = document.getElementById('events-container');
            container.innerHTML = '';
            
            if (data.length === 0) {
                container.innerHTML = `<p>No Invitations Available</p>`;
                return;
            }

            data.forEach(event => {
                const buttons =
                    event.rsvp_status === 'Pending'
                        ? `
                            <button class="btn btn-primary accept-btn" data-id="${event.id}">Accept</button>
                            <button class="btn btn-danger decline-btn" data-id="${event.id}">Decline</button>
                          `
                        : `<p>Invitations Accepted at: ${event.responded_at}</p>`;
                const eventElement = document.createElement('div');
                eventElement.classList.add('invite-event');

                eventElement.innerHTML = `
                    <div class="card m-3">
                        <div class="card-body">
                            <h3 class="card-title">${event.event.name}</h3>
                            <p class="card-text">Received at: ${event.invitation_sent_at}</p>
                            <p class="card-text">Status: ${event.rsvp_status}</p>
                            <p class="card-text">Owner: ${event.event.owner.username}</p>
                            <button class="btn btn-success view-details-btn" data-id="${event.id}">View Details</button>
                            ${buttons}
                        </div>
                    </div>
                `;
                container.appendChild(eventElement);
            });

            // Add event listeners to Accept and Decline buttons
            const acceptButtons = document.querySelectorAll('.accept-btn');
            const declineButtons = document.querySelectorAll('.decline-btn');

            acceptButtons.forEach(button => {
                button.addEventListener('click', () => updateRSVP(button, "Accepted"));
            });

            declineButtons.forEach(button => {
                button.addEventListener('click', () => updateRSVP(button, "Declined"));
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Function to get CSRF token from cookies
function getCSRFToken() {
    let cookieValue = null;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('csrftoken=')) {
            cookieValue = cookie.substring('csrftoken='.length, cookie.length);
            break;
        }
    }
    return cookieValue;
}

// Function to update RSVP status
function updateRSVP(button, status) {
    // Get the event ID from the button's data-id attribute
    const eventId = button.getAttribute('data-id');
    const apiUrl = `/update_status/${eventId}`; // Ensure this matches your Django URL pattern

    // Send the POST request
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({ status }), // Send status in the body
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update RSVP status.');
            }
            return response.json();
        })
        .then(data => {
            console.log(`RSVP ${status} sent for Event ID: ${eventId}`, data);
            alert(`RSVP ${status} successfully sent!`);
            showInvitations(); // Reload invitations to reflect changes
        })
        .catch(error => {
            console.error('Error updating RSVP:', error);
        });
}
