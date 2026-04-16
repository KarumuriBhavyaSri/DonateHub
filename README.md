<<<<<<< HEAD
# DonateHub
=======
# DonateHub

A centralized item-donation web platform connecting Receivers (who post needs) and Donors (who fulfill them).

## Prerequisites
- Java 17+
- Maven
- Node.js & npm
- MySQL Server (running on localhost:3306)

## Getting Started

### 1. Database Setup
Ensure MySQL is running. The application is configured to use:
- **Username**: `root`
- **Password**: `password`
- **Database**: `donation_db` (Created automatically if not exists)

*You can change these in `backend/src/main/resources/application.properties`.*

### 2. Backend Setup
Navigate to the `backend` directory and run:

```bash
cd backend
mvn spring-boot:run
```
The backend will start on `http://localhost:8080`.

### 3. Frontend Setup
Navigate to the `frontend` directory and run:

```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`.

## Usage Guide
1. **Sign Up** as a **Receiver**.
2. **Post a Request** (e.g., "Winter Clothes" in "Chicago", Items: "Coats" - 10).
3. **Log Out** and **Sign Up** as a **Donor**.
4. **Browse Requests** on the dashboard.
5. **Fulfill** a request (e.g., Donate 5 Coats).
6. The progress bar updates instantly!

## Technologies
- **Backend**: Spring Boot, Spring Data JPA, MySQL
- **Frontend**: React, Vite, Tailwind CSS, Axios
>>>>>>> 89d8b4a (Initial commit)
