FROM node:20

WORKDIR /app/frontend

COPY . .

RUN ["npm", "install"]

# backend
EXPOSE 4173

CMD ["npm", "run", "start:prod"]
