# ShopMate

ShopMate is a full-stack e-commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js). It features a modern, responsive user interface and robust backend functionality for managing products, users, and orders.

## Tech Stack

### Frontend
-   **React**: UI library for building interactive user interfaces.
-   **Vite**: Next Generation Frontend Tooling.
-   **TailwindCSS**: A utility-first CSS framework for rapid UI development.
-   **React Router**: Declarative routing for React.
-   **Axios**: Promise based HTTP client for the browser and node.js.
-   **Sonner**: An opinionated toast component for React.
-   **Lucide React**: Beautiful & consistent icons.

### Backend
-   **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
-   **Express**: Fast, unopinionated, minimalist web framework for Node.js.
-   **MongoDB**: NoSQL database for flexible data storage.
-   **Mongoose**: Elegant mongodb object modeling for node.js.
-   **JWT (JSON Web Tokens)**: Securely transmitting information between parties as a JSON object.
-   **BcryptJS**: Secured password hashing.
-   **Helmet**: Security headers for Express apps.
-   **Express Rate Limit**: Basic rate-limiting middleware for Express.

## Prerequisites

Before running this project, ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v14 or higher recommended)
-   [MongoDB](https://www.mongodb.com/) (Local installation or Atlas URI)

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/venu-gopal12/ShopMate.git
    cd ShopMate
    ```

2.  **Install Server Dependencies:**
    Navigate to the `server` directory and install the necessary packages.
    ```bash
    cd server
    npm install
    ```

3.  **Install Client Dependencies:**
    Navigate to the `client` directory and install the necessary packages.
    ```bash
    cd ../client
    npm install
    ```

## Environment Variables

You need to set up environment variables for both the server and the client to run the application correctly.

### Server (`server/.env`)
Create a `.env` file in the `server` directory and add the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopmate  # Or your MongoDB Atlas URI
JWT_SECRET=your_super_secret_key_here
```

### Client (`client/.env`)
Create a `.env` file in the `client` directory and add the following variable:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

To run the application, you need to start both the backend server and the frontend development server.

### Start the Backend Server
In the `server` terminal:
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

### Start the Frontend Client
In the `client` terminal:
```bash
npm run dev
```
The client will start, usually on `http://localhost:5173`.

Open your browser and navigate to `http://localhost:5173` to view the application.

## License

This project is licensed under the MIT License.
