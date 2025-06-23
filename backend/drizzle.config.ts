import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: ["./src/db/schema/stores.ts", "./src/db/schema/customers.ts", "./src/db/schema/profiles.ts", './src/db/schema/staff-invitations.ts'],
    out: "./sql/01_app",
    dbCredentials: {
        host: "localhost",
        port: 5432,
        user: "user",
        password: "password",
        database: "db",
        ssl: false
    }
});
