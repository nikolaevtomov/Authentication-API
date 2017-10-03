### Authentication API

###### Endpoints
- `localost:3090/`
- `localost:3090/login`
- `localost:3090/register`

#### Getting up and running

##### Installing Mongo DB
1. Run `brew install mongodb`
2. Run `brew services start mongodb`
3. Run `brew services stop mongodb`

###### Alternative (custom db folder)
2. Run `mkdir ~/mongodb`
3. Run `mongod --dbpath ~/mongodb`

###### Running the API locally
1. Run `npm install`
2. Run `npm run dev`
