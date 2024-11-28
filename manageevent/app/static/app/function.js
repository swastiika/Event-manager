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
   <div class="card my-3">
    <div class="card-body">
        <h3 class="card-title">${event.name}</h3>
        <p class="card-text"><strong>Type:</strong> ${event.type}</p>
        <p class="card-text"><strong>Date:</strong> ${event.date}</p>
        <p class="card-text"><strong>Description:</strong> ${event.description}</p>
        <p class="card-text"><strong>Creator:</strong> ${event.owner.username}</p>
       <button type="button" class="btn btn-success" onclick="window.location.href='http://127.0.0.1:8000/send-invitation/3'">View Invitation Status</button>

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
            return response.json();  // Parse the JSON data from the response
        })
        .then(data => {
            console.log('Fetched profile data:', data);
            const container = document.getElementById('events-container');
            container.innerHTML = '';
            if(data.length===0)
                {
                     container.innerHTML = `<p>No Invitations Available`;
                     return;
                }
            data.forEach((event) =>{
                const eventElement = document.createElement('div');
                eventElement.classList.add('invite-event');
                eventElement.innerHTML = `
                <div class="card m-3">
                <div class="card-body">
                <h3 class="card-title">${event.event.name}</h3>
                <p class="card-text">Received at:${event.invitation_sent_at}</p>
                <p class="card-text">Status:${event.rsvp_status}</p>
                <p class="card-text">Owner:${event.event.owner.username}</p>
                </div>
                </div>
                `;
                container.appendChild(eventElement);
            })

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    
}

export function send_invitation(eventId){
    console.log(eventId);

}

