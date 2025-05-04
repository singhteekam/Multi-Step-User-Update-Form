# Multi-Step User Update Form  

This project is a full-stack MERN application that implements a multi-step user update form. The form allows users to update their information in a step-by-step process, ensuring a smooth and user-friendly experience.

## Features  
- Multi-step form with validation at each step.  
- Backend API for handling user data updates.  
- Responsive design for seamless usage across devices.  
- Built with the MERN stack (MongoDB, Express.js, React.js, Node.js).  

## Installation  

1. Clone the repository:  
    ```bash  
    git clone https://github.com/singhteekam/Multi-Step-User-Update-Form.git  
    cd Multi-Step-User-Update-Form  
    ```  

2. Install dependencies for both client and server:  
    ```bash  
    # Install server dependencies  
    cd server  
    npm install  

    # Install client dependencies  
    cd ../client  
    npm install  
    ```  

3. Set up environment variables:  
    - Create a `.env` file in the `server` directory.  
    - Add the following variables:  
      ```env  
      MONGO_URI=your_mongodb_connection_string  
      PORT=5000  
      ```  

4. Start the development servers:  
    ```bash  
    # Start the server  
    cd server  
    npm start  

    # Start the client  
    cd ../client  
    npm start  
    ```  

## Usage  

1. Navigate to `http://localhost:3000` in your browser.  
2. Follow the steps in the form to update user information.  
3. Submit the form to save changes to the database.  

## Folder Structure  

```plaintext  
Multi-Step-User-Update-Form/  
├── client/       # React frontend  
├── server/       # Node.js backend  
├── README.md     # Project documentation  
```  

## Technologies Used  

- **Frontend**: React.js, React-Bootstrap  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  

## Acknowledgments  

- Inspired by modern user-friendly form designs.  
- Built with the MERN stack for full-stack development.  
