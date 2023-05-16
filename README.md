# No Ads React Weather App

## About

This project is a ReactJS and NodeJS based application that can display weather information.

## Services utilized

The application leverages the [OpenCage Geocoding API](https://opencagedata.com/) as well as the [Open-meteo Weather API](https://open-meteo.com/)

## Limitations

The application uses the first result of the place name lookup.
In future versions this will be addressed so the user can select the place name if there are multiple matches.

## Installation

### Requirements

You need to have at least NodeJS 16 installed to run the app locally.

You will also need to get an API KEY for place name lookups here: https://opencagedata.com/api#quickstart

This is required because the application looks up latitude and longitude information for the place names entered by the user using the GEO API, then the
latitude and longitude are passed down to the weather API.

### Running the server

Simply run the following commands inside the server directory

```
    export GEO_API_KEY=YOUR_API_KEY
    npm install
    npm run build
    npm run start
```

You should see a message "App listening on the port 3000".

Hint: You could also put the GEO_API_KEY into a .env file

### Running the client

Simply run the following commands inside the server directory

```
    npm install
    export PORT=3001
    npm run start
```

Hint: You could also put the PORT into a .env file

##