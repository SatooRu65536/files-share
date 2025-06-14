up:
	docker compose --env-file .env.dev up
down:
	docker compose down
login:
	docker compose exec dev-minio bash
