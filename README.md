# My_React_S3

Storing files on Amazon S3.

## Development

React + Vite frontend with an Express.js backend.

### AWS setup

1. Copy `.env.example` to `.env`
2. Fill in your AWS credentials and bucket name:

```env
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

Your IAM user needs `s3:PutObject` permission on the bucket.

### Setup

```bash
npm install
npm run dev
```

This starts both:
- **Frontend** (Vite) → http://localhost:5173
- **Backend** (Express) → http://localhost:3001

API routes are available at `/api/*`. During development, Vite proxies `/api` requests to Express.

Test the API: http://localhost:3001/api/health

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run frontend + backend together |
| `npm run dev:client` | Run Vite only |
| `npm run dev:server` | Run Express only |
| `npm run build` | Build React app for production |
| `npm start` | Serve production build via Express |

### Project structure

```
server/
  index.js        # Express entry point
  routes/
    api.js        # API routes (add S3 routes here)
src/              # React frontend
```
