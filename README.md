# Health Insurance Portal

Spring Boot API for the educational health insurance portal. The database and
plan records are sample data; this is not a real insurance service.

## Requirements

- Java 17
- Maven 3.8+
- MySQL 8

## Configure and run

1. Create the database by running `database/schema.sql`, then load
   `database/sample_data.sql`.
2. Set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` for the MySQL connection.
   The default URL points to `localhost:3306/health_insurance_portal`.
3. Set `ADMIN_PASSWORD` to a strong local development value. The admin account
   is not exposed through the API yet; this variable is reserved for the
   planned authentication implementation.
4. From the `backend` directory, run `mvn spring-boot:run`.

The service listens on port 8080 by default.

Open the separate `health-insurance` frontend with a local web server (for
example, VS Code Live Server on port 5500). Its Plans page requests
`http://localhost:8080/api/plans` and falls back to built-in sample cards if
the API is unavailable. For a different frontend origin, set
`APP_CORS_ALLOWED_ORIGINS` to a comma-separated list of allowed origins.

## Available endpoints

- `GET /api/health` — service status and timestamp.
- `GET /api/plans` — active plans from active companies.
- `GET /api/plans?category=FAMILY_FLOATER` — filter plans by category.
- `GET /api/plans/{id}` — one active plan, including its benefits and exclusions.
- `POST /api/contact` — validate and save a support message to the sample database.

Only these endpoints are currently exposed. Other paths are denied; user
authentication and policy/claim write workflows have not been implemented yet.
The API does not provide insurance advice, real quotations, or real policy
transactions. Contact messages are stored as sample data and will not reach a
real support team.
