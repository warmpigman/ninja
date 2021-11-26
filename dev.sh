echo "\e[1;34mDeleting Previous Dist.."
(cd Ninja && rm -r dist)
echo "\e[1;34mDeleted Previous Dist.."
echo "\e[1;34mRunning Typescript Compiler..\e[0;37m"
(cd Ninja && tsc)
echo "\e[1;34mStarting Docker..\e[0;37m"
sudo docker-compose up --build --remove-orphans -d ninjabot
echo "\e[1;34mEntering a bash shell in the docker container.."
echo "\e[1;34mType 'exit' to exit the shell..\e[0;37m\n"
sudo docker exec -it ninjaBot bash