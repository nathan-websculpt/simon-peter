# Single-page Bible + Search

### started project with [my boilerplate](https://github.com/nathan-websculpt/supabase_auth_drizzle_boilerplate)

#### which has the following additions made to Supabase Starter Kit + Drizzle

- pg
- drizzle-orm
- drizzle-kit
- drizzle-zod
- tsx
- faker (for seeding)

### ways to use [boilerplate](https://github.com/nathan-websculpt/supabase_auth_drizzle_boilerplate)

1. Clone boilerplate repo & install dependencies

```
git clone https://github.com/nathan-websculpt/supabase_auth_drizzle_boilerplate.git PROJ_NAME
cd PROJ_NAME
npm i
```

#### OR

2. Start from scratch

```
npx create-next-app -e with-supabase
cd PROJ_NAME
npm i drizzle-orm drizzle-zod pg dotenv dotenv-expand
npm i -D drizzle-kit @types/pg eslint-plugin-drizzle tsx @faker-js/faker
```


Learn more about the [Supabase Template](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## simon-peter is built like this...

- SPA (NextJS + React)
- Drizzle Migrations
- Postgres
- Full Text Search (FTS) implemented on verses


##### DEV NOTES:

- Too early to make big decisions or to do big refactors, but I ended up writing SQL more-so than using the ORM.
- For what this will become, getting rid of the ORM may make more sense.
- My honest opinion after 15 years of DEV is that ORMs are only the way to go for enterprise apps that employ more project managers than developers.
- I have built this app multiple ways throughout the years, so I simply have a view of the structure - I don't think I need/want an ORM.
- As I started to run migrations across different environments, I opted to just maintain my own SQL.
- BUT, the Drizzle Migration is only missing the citext generated column for FTS (barely out-of-date).