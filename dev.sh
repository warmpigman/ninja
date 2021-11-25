(cd Ninja && rm -r dist)
(cd Ninja && tsc)
sudo docker-compose up --build --remove-orphans ninjabot 