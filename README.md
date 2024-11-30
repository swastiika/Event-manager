# Event Manager Application

## Overview
The **Event Manager Application** is a web-based platform designed to simplify event management. Users can create, manage, and RSVP to events. The application includes a dynamic calendar view, RSVP tracking, and email notifications, ensuring seamless organization and participation.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)

---

## Features
- **Event Creation and Management**: Users can create events with details like title, date, time, description, and location.
- **RSVP System**: RSVP functionality allows users to confirm attendance. Organizers can view RSVP lists.
- **Dynamic Calendar View**: Events are displayed dynamically in an interactive calendar.
- **Notifications**: Reminders are sent to attendees before events.
- **Mobile-Responsive Design**: Fully responsive layout for seamless use on mobile and desktop.
- **Search and Filter**: Search for events by keywords or filter them by date or category.

---

## Tech Stack
- **Backend**: Django (Python)
- **Frontend**: HTML, CSS (Bootstrap/Tailwind), JavaScript 
- **Database**: SQLite (Development)
- **Notifications**: Django Email Framework, Celery + Redis

---

## Installation
Follow these steps to set up and run the application locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/swastiika/event-manager.git
   cd event-manager

2. **Setup a vitual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
 
3. **Install dependencies**
   ```bash
     pip install -r requirement.txt 