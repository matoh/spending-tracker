Spending tracker is a web application designed to help managing expenses with ease. It allows to track and visualize financial data, making it simple to stay on top of your spending habits.

## Technology Stack
Spending tracker is built using the following tech stack:

* **[Next.js (App)](https://nextjs.org/docs/)**: A lightweight framework for React applications
* **[React](https://react.dev/)**: A library for building user interfaces
* **[Shadcn/ui](https://chakra-ui.com/)**: A component library for creating beautiful and accessible user interfaces
* **[Kysely](https://kysely.dev/)**: A TypeScript-friendly query builder for PostgreSQL
* **[PostgreSQL](https://www.postgresql.org/)**: A powerful, open-source object-relational database system

## Local Setup by Docker Compose

Project includes Dockerfile for all services together with Docker compose configuration.
Start the application using Docker Compose by running: `docker-compose up`

Following services are included:
* **spending-tracker**: Next js app hosted on: http://localhost:3000
* **postgresql**: PostreSQL database
* **postgresql-adminer**: PHP tool for managing content in databases, hosted on: http://localhost:8081/

## App development
Run the Next.js development server: `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

