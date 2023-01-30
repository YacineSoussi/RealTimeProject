.PHONY: client server start stop

client:
	docker-compose run client npm install

server:
	docker-compose run server npm install

start:
	docker-compose up -d

stop:
	docker compose down --remove-orphans --volumes --timeout 0

restart: stop start