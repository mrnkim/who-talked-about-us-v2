## 🔑 Getting Started

### Step 1. Generate Twelve Labs API Key

Visit [Twelve Labs Playground](https://playground.twelvelabs.io/) to generate your API Key

- Upon signing up, you'll receive free credits to index up to 10 hours of video content!

### Step 2 (Option 1). Start the App on Replit

1. Click the button below and fork the repl

   [![Run on Replit](https://replit.com/badge/github/mrnkim/who-talked-about-us-v2)](https://replit.com/@twelvelabs/who-talked-about-us-v2)

2. Update Secrets (equivalent to .env)

   ```
   REACT_APP_API_KEY=<YOUR API KEY>
   ```

3. Stop and Run the Repl again

### Step 2 (Option 2). Start the App Locally

1. Clone the current repo

   ```sh
   git clone git@github.com:mrnkim/who-talked-about-us-v2.git
   ```

2. Create `.env` file in the root directory and provide the values for each key

   ```
    REACT_APP_API_KEY=<YOUR API KEY>
    REACT_APP_SERVER_URL=<YOUR SERVER URL> //e.g., http://localhost
    REACT_APP_PORT_NUMBER=<YOUR PORT NUMBER> // e.g., 4000
   ```

3. Start the server

   ```sh
   node server.js
   ```

4. Install and start the client

   ```sh
   npm install
   npm start
   ```