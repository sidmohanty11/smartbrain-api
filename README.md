# SmartBrain-api
For development use,

1. Clone this repo
2. ```cd smartbrain-api```
3. Add a .env file with your own Clarifai api and JWT_SECRET
4. Make sure you are running docker in the background
5. Run ```docker-compose up --build```
6. To access backend's bash run, ```docker-compose exec smartbrain-api bash```
7. To access redis run, ```docker-compose exec redis redis-cli```
8. To access postgres run, ```psql postgres://<username>:<password>@localhost:5432/smartbrain-docker```

You can grab Clarifai API key [here](https://www.clarifai.com/)
