up-dev:
	docker compose --env-file .env.dev
up-prod:
	docker compose --env-file .env.prod up
down:
	docker compose down
login:
	docker compose exec dev-minio bash
