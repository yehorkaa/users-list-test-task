# UsersPlatform
Backend

How to set up project:
	1.	use pnpm install to install all dependencies in the root directory “users-platform”
	2.	Make sure that Docker is installed on your computer, since you will need it to launch PostgreSQL
	3.	In case you’ve installed Docker, launch DB with command “docker-compose up -d”
    4.  Add .env file to the apps/backend/admin and add there:
    NODE_ENV=development
    POSTGRES_HOST=localhost
    POSTGRES_PORT=5432
    POSTGRES_USER=admin
    POSTGRES_PASSWORD=test22
    POSTGRES_NAME=postgres
	5.	To run nest app, use “nx serve backend-admin”, if nx isn’t installed you can read the guide “https://nx.dev/getting-started/installation”
	6.	Once you’ve done all steps above BE should be running on http://localhost:3000/api/users :-)

Thoughts:
	1.	I suppose that probably roles should be a distinct table since in the requirements we have GET /roles as a distinct endpoint but it wasn’t specified in any way, so I used standard approach and wrote enum
	2.	Ideally logging should use Elasticsearch but to keep it simple I’ve added just simple Logger
	3.	Wasn’t specified in the requirements but I’ve added this endpoint since we need somehow to create users.
Also it would be better to create public API for creating users but for simplicity I’ve added this endpoint here

⸻

Frontend

How to set up project:
	1.	use pnpm install to install all dependencies in the root directory “users-platform”
	2.	To make it simple, I’ve added fallbacks for env variables so you don’t need to add .env file
	3.	Run FE project with following command “nx serve frontend-admin”, if nx isn’t installed you can read the guide “https://nx.dev/getting-started/installation”
	4.	Once you have nx and run “nx serve frontend-admin” everything must work :-)

General comments:
	1.	I’ve used ready solutions from shadcn or shadcn-based solutions to make good-looking table, multi-select for roles and page styling