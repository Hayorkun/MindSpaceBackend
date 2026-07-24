# MindSpace Backend

This is the backend API for **MindSpace**, a task manager application. It handles authentication (email/password, Google, and GitHub OAuth) and full task management (CRUD), all secured per-user with JWT.

Frontend repo: [MindSpace Frontend](#) <!-- replace with your actual frontend repo link -->

## Features

- Email/password signup and login with hashed passwords (`bcrypt`)
- Google OAuth login
- GitHub OAuth login
- JWT-based authentication
- Auth middleware to protect routes
- Full task CRUD, scoped to the logged-in user
- MongoDB via Mongoose

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- `jsonwebtoken`
- `bcrypt`
- `cors`
- `dotenv`
- `axios` (for Google/GitHub OAuth verification)

## Project Structure

```
├── controllers/
│   ├── UserController.js      # signup, login, Google/GitHub auth, get user
│   └── TaskController.js      # task CRUD operations
├── middleware/
│   └── authMiddleware.js      # verifies JWT, protects routes
├── models/
│   ├── User.js                 # user schema
│   └── Tasks.js                # task schema
├── routes/
│   ├── UserRoute.js
│   └── TaskRoute.js
├── utils/
│   ├── PasswordManager.js      # hash/compare passwords
│   └── TokenManager.js         # generate/verify JWTs
└── server.js
```

## Environment Variables

Create a `.env` file in the root with:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_jwt_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

Generate a `JWT_SECRET` with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## API Endpoints

### Auth (`/api/users`)

| Method | Endpoint      | Description                       | Protected |
|--------|---------------|-------------------------------------|-----------|
| POST   | `/createUser` | Register a new user                 | No        |
| POST   | `/loginUser`  | Log in with email/password          | No        |
| POST   | `/google`     | Log in/sign up with Google           | No        |
| POST   | `/github`     | Log in/sign up with GitHub           | No        |
| GET    | `/getUser`    | Get the logged-in user's profile     | Yes       |

### Tasks (`/api/tasks`)

| Method | Endpoint          | Description                | Protected |
|--------|-------------------|------------------------------|-----------|
| POST   | `/createTask`     | Create a new task            | Yes       |
| GET    | `/getTask`        | Get all tasks for the user    | Yes       |
| PATCH  | `/updateTask/:id` | Update a specific task        | Yes       |
| DELETE | `/deleteTask/:id` | Delete a specific task        | Yes       |

Protected routes require:
```
Authorization: Bearer <token>
```

### Sample Request Bodies

**Create user**
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "yourpassword"
}
```

**Create task**
```json
{
  "title": "Groceries shopping",
  "description": "Rice, turkey, pepper, eggs",
  "category": "personal",
  "priority": "high",
  "status": "pending",
  "dueDate": "2026-07-25"
}
```

## Getting Started

```bash
npm install
npm run dev
```

Make sure `.env` is set up first (see above). The server runs on port `8080` by default.

## CORS

Update the allowed origins in `server.js` to match your deployed frontend URL(s):

```javascript
app.use(cors({ origin: ["http://localhost:5173", "https://your-frontend-url.vercel.app"] }));
```

## OAuth Setup Notes

- **Google**: Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/). This backend expects an `access_token` from the frontend, which it uses to call Google's `userinfo` endpoint.
- **GitHub**: Create an OAuth App under GitHub **Developer settings** → **OAuth Apps**. This backend receives an authorization `code`, exchanges it for an access token, then fetches the user's profile (falling back to `/user/emails` if no public email is set).

## Deployment

Deployed on [Render](https://render.com). Remember to add all environment variables in Render's dashboard under the service's **Environment** tab — they are not read from a local `.env` file in production.

## Roadmap

- [ ] Password reset flow
- [ ] Task categories as a separate model
- [ ] Task search and filtering
- [ ] Due date reminders/notifications

## License

Currently unlicensed / for personal and educational use.