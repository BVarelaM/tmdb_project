# MOVIE DATABASE
API developed with Node.js, Express and MongoDB, integrating the extern API TMDB (The movie database). This will allow to the user to have personalisated list of movies (movies already watched, favourites and next ones). Also they could see some recomendation from other friends or if they want to do a marathon movie, they will have the time that it could take.

# APPLIED TECHNOLOGIES
- runtime environment : Node.js
- Framework           : Express.js
- DataBase            : MongoDB
- Authentication      : JSON Web Tokens (JWT)
- Documentation       : Swagger UI Express & JSDoc

# Prerequisites
* [Docker Desktop](https://docker.com) installed and running.
* Your TMDB API credentials (`API_KEY` and `TMDB_ACCESS_TOKEN`).

# REQUIREMENTS
- [Node.js](https://nodejs.org/) (v18 or higher )
- [MongoDB](https://www.mongodb.com/)
- An API Key from [The Movie Database (TMDB)](https://www.themoviedb.org/documentation/api)

# HOW TO RUN THE PROJECT

# CLONE REPOSITORY
- git clone https://github.com/BVarelaM/tmdb_project.git
- cd tmdb_project

# Download the latest pre-built version of the application
docker pull bastianevm/assessment_movies:latest

# START INFRAESTRUCTURE SERVICES (DATABASE AND MESSAGING SERVICES)

docker compose up -d mongodb
docker compose up -d rabbitmq

# RUN APPLICATION CONTAINER

docker run -d \
  --name assessment_movies_app \
  --network tmdb_project_default \
  -p 3000:3000 \
  -e TMDB_API_KEY="your_api_key_here" \
  bastianevm/assessment_movies:latest

# When initialized, the services will be available at:
* API REST: `http://localhost:3000`
* RabbitMQ Management Dashboard: `http://localhost:15672` (User/Password: `guest` / `guest`)
* MongoDB Port: `27017`
