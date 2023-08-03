# VirtuaVisage

A full-stack application for AI enthusiasts, VirtuaVisage allows users to:

- Generate images using the Stable Diffusion model.
- Signup to keep track of all of their artifacts.
- Share artifacts with the community.

Users can signup either using local authentication or through their Google account via the OAuth 2.0 standard.

Stability AI's JavaScript gRPC client is used to generate and fetch the artifacts, while Cloudinary's SDK is utilized to store the artifacts, and MongoDB is used as the database.

On the Collection page, the real-time search functionality utilizes the debouncing technique to delay the search until a certain amount of time has passed since the user stopped typing. This ensures that the search function is not run with every keystroke, which can be inefficient and cause performance issues.

## Stable Diffusion

The following parameters are used to setup Stable Diffusion:

**Engine**: stable-diffusion-512-v2-1  
**Width**: 512  
**Height**: 512
**Samples**: 1  
**CFG Scale**: 13  
**Steps**: 25

## Demo

The demo can be accessed at https://virtuavisage.onrender.com/.

You can log into the application using the following credentials:

**Email**: jackson@domain.com  
**Password**: demopassword123

## Scripts

Run the server in development mode:

    cd server
    npm run dev

Run the server in production mode:

    cd server
    npm start

Run the client in development mode:

    cd client
    npm run dev

Build the client for production:

    cd client
    npm run build

Preview the client build:

    cd client
    npm run preview
