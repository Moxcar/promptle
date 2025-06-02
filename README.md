# Promptle

A web app built with the T3 Stack where users guess a daily AI-generated image. The image is created using a random word and the FAL AI API. Includes secure cron jobs, Postgres database, and modern React features.

## Features

- Daily AI-generated image guessing game
- Next.js 14, React 18, TypeScript
- Prisma ORM with PostgreSQL
- tRPC for end-to-end typesafe APIs
- Tailwind CSS for styling
- Secure cron job endpoint
- FAL AI integration for image generation

## Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable                   | Description                                   |
| -------------------------- | --------------------------------------------- |
| `DATABASE_URL`             | Main database connection string (Postgres)    |
| `POSTGRES_PRISMA_URL`      | Prisma connection string (with pooling)       |
| `POSTGRES_URL_NON_POOLING` | Prisma direct connection string (no pooling)  |
| `CRON_SECRET`              | Secret for securing cron job API              |
| `FAL_API_KEY`              | API key for FAL AI image generation           |
| `VERCEL_URL`               | (Optional) Vercel deployment URL              |
| `PORT`                     | (Optional) Port for local dev (default: 3000) |
| `NODE_ENV`                 | "development", "test", or "production"        |

Example `.env`:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
POSTGRES_PRISMA_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
POSTGRES_URL_NON_POOLING=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
CRON_SECRET=your_cron_secret
FAL_API_KEY=your_fal_api_key
VERCEL_URL=your-vercel-url
PORT=3000
NODE_ENV=development
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd promptle
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up your environment variables** (see above)
4. **Set up the database**
   ```bash
   npx prisma migrate dev
   ```
5. **Start the development server**
   ```bash
   npm run dev
   ```

## Database

- Uses PostgreSQL
- Prisma schema is in `prisma/schema.prisma`
- Migrations handled via Prisma CLI

## Deployment

- Ready for Vercel, Docker, or custom Node.js hosting
- Set all required environment variables in your deployment platform

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
