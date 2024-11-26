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
      eventElement.innerHTML = `
        <h3>${event.name}</h3>
        <p>Type: ${event.type}</p>
        <p>Date: ${event.date}</p>
        <p>Description: ${event.description}</p>
        <p>Creater: ${event.owner.username}</p>
      `;
      container.appendChild(eventElement);
    });
}

export function showEvent(event) {
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

export function send_invitation(eventId){
    console.log(eventId);

}