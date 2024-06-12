# API Assessment

An assessment based on the provided tasks, built using TypeScript, Express, Prisma, Docker, Swagger. 

## Requirements

- npm >= v10.7.0
- node >= v22.2.0

> It might work on lower versions but it's not been tested.  

OR

- Docker
- Docker-compose

## Setup

- `git clone https://github.com/xiarx/api.git`
- `cd api`

> Change .env.example to .env and make sure to update the variables to your local ones.  

### Node

- `npm install`
- `npm run dev`

### Docker

- `npm run docker` (production)

OR

- docker-compose up

> I would recommend you to use docker-compose to automatically configure your database as well.  

> The API will listen on localhost:4000 and the database on localhost:4001

> All documentation can be found at localhost:4000/api/v1

## Project Structure

- src - All core app components like the router goes in the root directory of src.  
- server.ts - All server related functionality.   
- router.ts - All application routes imported here.  
- prisma - All prisma related files and schemas.  
- routes - All application routes the router will import.  
- models - Does not currently exist but should implement if the prisma schema gets too large and properly supports multi file schemas.  
