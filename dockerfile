FROM 'node'
WORKDIR /srv
EXPOSE 80
COPY . .
RUN yarn install --production
RUN mkdir logs
CMD yarn start