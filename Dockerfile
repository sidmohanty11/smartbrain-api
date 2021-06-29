FROM node:16

WORKDIR /usr/src/smartbrain-api

COPY ./ ./

RUN npm install

CMD [ "/bin/bash" ]