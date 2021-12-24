FROM node:16.6
ENV NODE_ENV=production
WORKDIR /application
COPY . .
# RUN npm install --production
RUN ["tsc"]
CMD ["node", "."]