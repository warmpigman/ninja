FROM node:16.6
ENV NODE_ENV=production
WORKDIR /application
COPY . .
# RUN npm install --production
RUN ["./node_modules/typescript/bin/tsc", "-p", "tsconfig.json"]
# CMD ["node", "."]
ENTRYPOINT ["tail"]
CMD ["-f","/dev/null"]