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

1. Clone this repo & install dependencies

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