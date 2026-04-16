# RentEase - Rental House Management System

A modern full-stack web application for managing rental properties, featuring role-based access for Tenants, Landlords (Owners), and Admins.

## Features

- **Multi-Role Authentication**: Dedicated login and registration for Tenants, Landlords, and Admins.
- **Property Listings**: Browse verified properties with advanced filters (Price, Type, Availability).
- **Search Functionality**: Search for properties by title or city.
- **Booking System**: Tenants can request bookings for specific dates.
- **Owner Dashboard**: Landlords can list properties, manage availability, and accept/decline booking inquiries.
- **Admin Panel**: Oversee all users, listings, and bookings on the platform.
- **Modern UI**: Fully responsive design built with Tailwind CSS 4 and Lucide icons.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS 4, Lucide Icons, React Router, Axios.
- **Backend**: Node.js, Express, Sequelize ORM.
- **Database**: SQLite (Local file-based database).

## Getting Started

### Prerequisites

To run this application, you need to have **Node.js** (v16 or higher) installed on your machine.

- [Download Node.js](https://nodejs.org/)

### Installation & Running

#### 1. Start the Backend Server

```bash
cd backend
npm install
node index.js
```
The backend will run on `http://localhost:5000`.

#### 2. Start the Frontend Development Server

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Default Accounts for Testing

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | administrator | SecureAdmin123! |
| **Landlord** | owner1 | owner123 |
| **Tenant** | tenant1 | tenant123 |

## Project Structure

- `/backend`: Express API, Sequelize models, and SQLite database.
- `/frontend`: React application with Tailwind CSS.
