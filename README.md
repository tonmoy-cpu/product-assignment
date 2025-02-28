## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://inspiredgrow:pPM0ggZq2cJ8GV39@cluster0.cfzsy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

4. Start the development servers:
   ```bash
   # Start backend server (from root directory)
   npm run server

   # Start frontend server (from frontend directory)
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

