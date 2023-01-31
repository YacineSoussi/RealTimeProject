.PHONY: client server fixtures start stop

client:
	docker-compose run client npm install

server:
	docker-compose run server npm install

start:
	docker-compose up -d

fixtures:
	docker-compose exec server npx sequelize-cli db:seed:all

stop:
	docker compose down --remove-orphans --volumes --timeout 0

restart: stop start

build: client server start fixtures