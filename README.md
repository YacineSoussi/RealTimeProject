# RealTimeProject

Platform with instant exchange system with its customers.

## Tech Stack

**Client:** Vue.js - Bootstrap - Vite

**Server:** Node.js - Express

**Others:** Docker

## Project installation

Clone the project

```bash
  git clone git@github.com:YacineSoussi/RealTimeProject.git
```

Go to the project directory

```bash
  cd RealTimeProject
```

### Linux and macOS

- Run the project

```bash
  make build
```

- Stop the project

```bash
  docker compose down --remove-orphans --volumes --timeout 0
```

### Windows

- Install dependencies for the server

```bash
  docker-compose run server npm install
```

- Install dependencies for the client

```bash
  docker-compose run client npm install
```

- Run the project

```bash
  docker-compose up -d
```

- Stop the project

```bash
  docker compose down --remove-orphans --volumes --timeout 0
```

## Project access

⏳ http://localhost:3001/ ⏳

## Authors

- [YacineSOUSSI](https://www.github.com/YacineSoussi)
- [Júlio Pereira](https://github.com/Roulioo)
- [Ali Raid](https://github.com/alilou-dev)

## License

[GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/)

## Tech Stack

**Client:** VueJs, Bootstrap, Vite

**Server:** Node JS, Express, MongoDB (mongoose)


## Run Locally

Clone the project

```bash
  git clone git@github.com:YacineSoussi/RealTimeProject.git
```

Go to the project directory

```bash
  cd RealTimeProject
```

Run the project

```bash
  docker-compose up -d --build
```

Install dependencies for the server

```bash
    docker-compose run server npm install {name of the library}
```

Install dependencies for the client

```bash
    docker-compose run client npm install {name of the library}
```


## Run fixtures

To run fixtures, run the following command:

Install sequelize & sequelize-cli 

```bash
docker-compose exec server npm install --save sequelize-cli

docker-compose exec server npm install --save sequelize 
```
To run fixtures

```bash
  docker-compose exec server npx sequelize-cli db:seed:all 
```


## Authors

- [@YacineSOUSSI](https://www.github.com/YacineSoussi)