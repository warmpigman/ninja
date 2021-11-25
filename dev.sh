(cd Ninja && rm -r dist)
(cd Ninja && tsc)
sudo docker-compose up --build --remove-orphans -d ninjabot
sudo docker exec -it ninjaBot bash