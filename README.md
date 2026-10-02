# GlowGears — MERN Store

A beginner-friendly online store project made with **MongoDB, Express, React, and Node.js**.

## How the parts work together

1. A customer clicks something in the React website.
2. React sends a request to the Express API.
3. Express reads or changes data in MongoDB using Mongoose.
4. Express sends a response back to React.

The backend setup is kept in one main file: `backend/src/server.js`.
## What works

- Create an account and sign in.
- Browse products and categories.
- Add products to a guest or signed-in cart.
- Manage categories, products, and stock as an admin.
- Place orders as **cash on delivery**.
- See your orders and update their delivery status in the admin page.

This project does not take online payments or store card details.

## What you need

- Node.js 20 or newer
- npm
- A MongoDB database (MongoDB Atlas is an option)

The backend reads these values from `backend/.env`:

```text
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=some_long_random_text
PORT=5000
CLIENT_URL=http://localhost:5173
```

Keep your real `.env` private. Do not upload it to GitHub. The `.gitignore` file ignores `.env` files that are not already tracked by Git.

## Start the project

### 1. Start the backend

Open a terminal in the project folder and run:

```bash
cd backend
npm install
npm run dev
```

When the terminal says `MongoDB connected`, the API is connected to your database.

### 2. Start the frontend

Open a second terminal in the project folder and run:

```bash
cd frontend
npm install
npm run dev
```

Open the local website address printed by Vite (usually `http://localhost:5173`).

### 3. Add sample products

In another terminal:

```bash
cd backend
npm run seed
```

This adds the sample categories and products to MongoDB. Run it once on a fresh database. Running it again resets those sample items to their original sample values.

### 4. Make an admin account

In a terminal, run:

```bash
cd backend
npm run create-admin
```

Enter the admin email when asked. If that email is not in MongoDB yet, the script asks for a password and creates the account. If the account already exists, it makes that account an admin; you keep using its existing password. Then sign in on the website and open `/admin`.

The password is typed into the terminal, so run this command somewhere private.

## Sign-in in simple terms

After login, the API gives the frontend a token. The frontend keeps it in browser `localStorage` and sends it to the API with later requests. The API checks the token to see which user is making each request. Passwords are hashed before they are saved to MongoDB.

This is a simple learning-project setup. Storing a token in `localStorage` is easier to understand, but it is less secure than an HttpOnly cookie if a website has a cross-site scripting bug. Add production security before launching a public store.

## Main API routes

| Method | Route | What it does |
| --- | --- | --- |
| `POST` | `/api/auth/signup` | Create an account |
| `POST` | `/api/auth/login` | Sign in and receive a token |
| `GET` | `/api/auth/me` | Get the signed-in user's profile |
| `PATCH` | `/api/auth/me` | Change the display name |
| `GET` | `/api/categories` | List categories |
| `GET` | `/api/products` | List products |
| `GET` | `/api/cart` | Show the current cart |
| `POST` | `/api/cart/items` | Add an item to the cart |
| `POST` | `/api/orders` | Place a COD order |
| `GET` | `/api/orders/mine` | Show the signed-in user's orders |
| `GET` | `/api/admin/orders` | Admin: show orders |
| `PATCH` | `/api/admin/orders/:id/fulfillment` | Admin: change delivery status |

Admin product and category routes are under `/api/admin/products` and `/api/admin/categories`.

## Live-Website Link:

https://glow-gears.vercel.app/
