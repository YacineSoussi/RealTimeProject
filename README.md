# RealTimeProject

Platform d'echange entre passionnés de motos.

## Tech Stack

**Client:** Vue.js - Bootstrap - Vite

**Server:** Node.js - Express - Socket.io

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
  make stop
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

- Run the fixtures

```bash
  docker-compose exec server npx sequelize-cli db:seed:all
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
