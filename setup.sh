#!/bin/bash

echo 'Starting docker container with process name ninjabot'
sudo docker-compose up --build --remove-orphans -d ninjabot

echo 'Entering bash shell for ninjabot'
sudo docker exec -it ninjabot bash

