### Youtube Video and Playlist Downloader

This is a simple web application that allows users to download videos and playlists from Youtube.

### How to use the application
1. Copy the URL of the video or playlist you want to download.
2. Paste the URL in the input field.
3. Click the download button.
4. Wait for the download to complete.

### Technologies used
1. Node.js
2. Express.js
3. React.js
4. Bootstrap
5. Youtube API

### How to run the application
1. Clone the repository.
#### For the server
2. Navigate to the server directory.
3. Run `npm install` to install the dependencies.
4. Create a `.env` file in the server directory and add the environment variables.
    - `PORT` - The port on which the server will run.
    - `YT_API_KEY` - Your Youtube API key.
    - `YT_API_URI` - The Youtube API URL.
5. To get the Youtube API key, follow the instructions [here](https://developers.google.com/youtube/registering_an_application).
6. Run `npm run server` to start the server.
7. The server will run on `http://localhost:${PORT}`.
#### For the client
8. Navigate to the client directory.
9. Run `npm install` to install the dependencies.
10. Run `npm start` to start the client.
11. Open your browser and navigate to `http://localhost:${PORT}`.
