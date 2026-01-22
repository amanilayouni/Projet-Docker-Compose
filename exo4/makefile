COMPOSE = docker compose -f docker-compose.yaml

all:
	$(COMPOSE) up -d --build

clean:
	$(COMPOSE) down

fclean:
	$(COMPOSE) down --rmi all

purge\ bdd: clean
	docker volume rm -f exo4_pg_data exo4_pgadmin_data || true

purge\ all:
	$(COMPOSE) down --rmi all --volumes --remove-orphans
	docker system prune -f

re: purge\ all all
