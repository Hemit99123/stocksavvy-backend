<div align="center">
  <img src="https://github-production-user-asset-6210df.s3.amazonaws.com/66741904/425247566-601f601b-43bb-4aa7-b7cb-8ba5e8d57231.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250321%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250321T020850Z&X-Amz-Expires=300&X-Amz-Signature=0997d419c224db12907ffb9b6e3b7eab5b1e395b03cb34a2e174a02ff6f41376&X-Amz-SignedHeaders=host" width="30%" alt="Talem AI" />
</div>
<hr>
<div align="center" style="line-height: 1;">
  <a href="https://stocksavvy-backend.onrender.com/"><img alt="Demo"
    src="https://img.shields.io/badge/🚀%20Live%20Demo-API-2F80ED?color=2F80ED&logoColor=white"/></a>
  <a href="LICENSE-CODE"><img alt="Code License"
    src="https://img.shields.io/badge/Code%20License-Apache%202.0-00BFFF?color=00BFFF"/></a>
  <br>
</div>

## 💻 Technologies Used:

### - Drizzle ORM
Drizzle serves as both an ORM and a query builder, providing a mid-level abstraction from SQL code for improved performance. Developers are expected to have SQL knowledge, which is considered a fair trade-off by the developer, Hemit Patel.

### - NodeJS v23
NodeJS is a runtime environment for JavaScript, enabling server-side execution of JavaScript code. This allows for a unified programming language across the web app and API, enhancing developer experience. Its asynchronous features and promise-based structure add to its appeal. From NodeJS 23 and onwards, TypeScript can be natively ran, allowing developers to use it in place for JavaScript.

### - Redis Clusters
Redis is an in-memory database, storing data in RAM for faster access compared to traditional databases like SQL or NoSQL (e.g., MongoDB, Cassandra). However, this also means it is susceptible to data loss on server shutdown, making it suitable for ephemeral data like sessions and verification codes. Clusters enable horizontal sharding, improving scalability, especially for session-based authentication. Two separate Redis caches are used to host two different types of sessions:

- **Admin Session Cache:** For admin user sessions, providing secure storage and quicker access to admin-related session data.
- **Regular Session Cache:** For standard user sessions, ensuring scalability and performance for the majority of users.

### - Express Sessions
This technology abstracts session-based authentication logic from developers, leading to improved developer experience and adhering to industry best practices for security and scalability.

### - Swagger
Swagger is used for seamless API documentation.

### - Husky + ESLint
These are dev tools that make the code maintainable and production ready. ESLint is a linting software that ensures code follows a strict set of rules designed for longevity and production readiness. Both **ESLint** and **Husky** are configured to run automatically before each commit to the GitHub remote repository.

## 🧱 API Architecture:

The API logic is structured into three main folders. It is modelled after the MVC architecture. The "models" are taken care of by the `/drizzle` folder and the `schema.ts` file within `src`.

- #### Controllers
Contains all business logic, including database queries for API endpoints.

- #### Routes
Includes all endpoints for specific logic types, such as authentication.

- #### Middleware
Houses code that runs before any other logic in an endpoint, useful for pre-processing requests, such as checking user authentication.

## 🔑 Authentication Structure

The authentication system utilizes **Express Sessions** in conjunction with **Redis Clusters** for session storage. The sessions are divided into two separate Redis caches:

- **Admin Sessions:** Hosted on a dedicated Redis cache, providing isolated storage for admin sessions. This enhances security and makes admin session management more robust.
- **Regular Sessions:** Stored on a separate Redis cache, catering to standard users. This setup ensures the scalability of regular user sessions without affecting admin sessions.

Sessions are validated through middleware before API endpoints are accessed, ensuring only authenticated users can access protected routes.

## 📝 Endpoint Docs:

To explore the different endpoints and their intended use cases, please navigate to the route `/api-docs` from the API endpoint.

## Contributions?

Contributions are allowed! We ask that you follow certain rules whilst making contributions. All work that you do will be **voluntary** and not privy to payment. However, you can use **your** contributions as work experience for any future work you might apply for. This can only be done if you follow our rules as listed below...

#### The rules:

When making contributions to this codebase, start by creating an issue. The naming of the issue should start off with:

- feat: (for a new feature)
- fix: (for a fix to a bug/feature not working)
- chore: (for any other task that does not fit the other 2 categories)

Once the issue is made, be sure to comment on that issue for all progress made.

Now, we can create a branch for your work. **DO NOT COMMIT ON MAIN** 
The branch should have the following naming structure: `YOUR NAME/GITHUB USER/1-2 WORDS ON THE CONTRIBUTION MADE` Examples of such naming structure include `hemit99123/about-page`

Ok now create a PR with the **same name as the issue** and once you are done with your contribution, simply merge the PR and close the issue :)

### Happy Coding 🧑🏽‍💻
