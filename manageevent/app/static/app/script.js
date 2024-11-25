document.addEventListener('DOMContentLoaded', () => {
    const publicEvent = document.getElementById("public-events");
    const profileView = document.getElementById("profile");
    const createEventBtn = document.getElementById('create-event-btn');
    const createEventForm = document.getElementById('create-event-form');
    const eventMode = document.getElementById('event_mode');
    const venueField = document.getElementById('venue-field');
    const linkField = document.getElementById('link-field');
    const eventForm = document.getElementById("event-form");
  
    // Check for the public event and profile button clicks
    if(publicEvent) {
        publicEvent.addEventListener('click', showEvent);
    }

    if(profileView) {
        profileView.addEventListener('click', showProfile); // Attach event listener for profile
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

// Function to render events (you can modify this if needed)
function renderEvents(events) {
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
      eventElement.innerHTML = `
        <h3>${event.name}</h3>
        <p>Type: ${event.type}</p>
        <p>Date: ${event.date}</p>
        <p>Description: ${event.description}</p>
      `;
      container.appendChild(eventElement);
    });
}

// Function to fetch events on "Public Events" button click
function showEvent(event) {
    event.preventDefault();
    fetch('/show_event', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((data) => {
        console.log('Fetched data:', data);
        renderEvents(data);
    })
    .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function showProfile(event) {
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
