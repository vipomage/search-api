## Prerequisites
- Node.js: v14.16.1
- npm: 7.14.0
- postgresql 12

# Task 1

## Database Config
1. Update your DB Options in [server/.env](server/.env) file
2. Create DB if non existing with the name you have used in .env file
2. If you have a DB password Uncomment DB_Password and password field in [ConfigModule](src/shared/config/config.module)'s typeorm options

## Server
### 1. npm install
### 2. npm run build-all
This will install UI Dependencies and build both UI and Server
### 3. npm run start:prod
Starts the built server which serves UI and the task endpoint


# Task 2

## Exercise Tasks
1. npm install

 - npm run palindrome
 - npm run largest-number
 - npm run min-start-value
