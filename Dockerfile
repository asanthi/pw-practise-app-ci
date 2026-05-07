FROM mcr.microsoft.com/playwright:v1.59.1-noble
# should match the exact versio in package.json "@playwright/test": "^1.59.1",

RUN mkdir /app
WORKDIR /app

#copy root directory to /app
COPY . /app 

# install all dependencies related to our test project
RUN npm install --force
# install all browsers required for playwright to run the tests
RUN npx playwright install


# to run this file and build the docker container "docker build -t pw-pageobject-test ."
