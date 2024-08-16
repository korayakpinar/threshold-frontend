FROM node:slim

RUN useradd -ms /bin/sh user

WORKDIR app

COPY . /app

RUN chown -R user /app

USER user

RUN npm i
RUN npm run build

ENTRYPOINT ["npm", "run", "start"]