import { create_event } from "./new_event.js";

document.addEventListener('DOMContentLoaded', () => {
    const createEventBtn = document.getElementById('create-event-btn');
    const createEventForm = document.getElementById('create-event-form');
    const eventMode = document.getElementById('event_mode');
    const venueField = document.getElementById('venue-field');
    const linkField = document.getElementById('link-field');
    const eventForm = document.getElementById("event-form");
    const publicEvent = document.getElementById("public-events");
    const profileView = document.getElementById("profile");
    publicEvent.addEventListener('click',showEvent);
    profileView.addEventListener('click',showProfile)
    document.querySelector('#home').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default navigation
    window.location.reload();
});

   



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

function showEvent(event){
    event.preventDefault();
        fetch('/show_event',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Add other headers if required, such as authorization tokens
                  },

            }
          
        ).then(response =>{
            if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json(); // Parse JSON data

        }).then((data) => {
            console.log('Fetched data:', data);
            renderEvents(data);
            // Process the data here
          }) .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
          });
}

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




  function showProfile(event){
    event.preventDefault();
    fetch('/show_profile',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add other headers if required, such as authorization tokens
              },
        }     
    ).then(response =>{
    

        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json(); // Parse JSON data
          console.log("everything is okay");
    }).then((data) => {
        console.log('Fetched data:', data);
        renderEvents(data);
        // Process the data here
      }) .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }