# FinEase API - README

A secure financial management backend built with **Express.js**, **Firebase Authentication**, and **MongoDB**. This API handles transactions, reports, balance overview, and full CRUD with authentication.

---

## 🚀 Features

* User authentication with Firebase ID Token
* Add, Read, Update, Delete (CRUD) transactions
* User-protected routes (email verification)
* Overview calculation (income, expense, balance)
* Monthly and category-based report generation
* Secure MongoDB connection

---

## 📦 Tech Stack

* **Node.js + Express.js** (Server)
* **Firebase Admin SDK** (Token verification)
* **MongoDB Atlas** (Database)
* **CORS & dotenv** (Security & config)

---

## 📁 Project Structure

```
├── server.js
├── firebase-service-key.json
├── package.json
├── .env
```

---

## ⚙️ Environment Variables (.env)

```
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
```

---

## 🔥 Firebase Setup

Add your downloaded **firebase-service-key.json** file in the root.

```js
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
```

---

## ▶️ Start Server

```bash
npm install
node server.js
```

Runs on: `http://localhost:3000`

---

# 📚 API Endpoints

All secured routes require:

```
Authorization: Bearer <Firebase_ID_Token>
```

---

## 🟢 1. Add a Transaction

### **POST /transactions**

Body:

```json
{
  "email": "user@gmail.com",
  "amount": 500,
  "category": "Food",
  "type": "expense",
  "date": "2025-01-20"
}
```

---

## 🟦 2. Get User Transactions

### **GET /my-transactions?email=[user@gmail.com](mailto:user@gmail.com)**

Returns all transactions of logged-in user.

---

## 🟣 3. Get Single Transaction + Category Total

### **GET /transaction/:id**

Returns:

```json
{
  "transaction": {...},
  "categoryTotal": 1200
}
```

---

## 🟠 4. Delete a Transaction

### **DELETE /transaction/:id**

Deletes only if transaction belongs to logged-in user.

---

## 🟡 5. Update a Transaction

### **PUT /transaction/:id**

Body includes updated fields.

---

## 🟩 6. Total Overview (Income, Expense, Balance)

### **GET /totalOverview**

Response:

```json
{
  "totalIncome": 3000,
  "totalExpense": 1500,
  "totalBalance": 1500
}
```

---

## 🟤 7. Report by Category & Month

### **GET /reports?email=[user@gmail.com](mailto:user@gmail.com)**

Returns:

* categoryData → Pie chart
* monthlyData → Bar/Line chart

Example:

```json
{
  "categoryData": [
    { "name": "Food", "value": 1200 },
    { "name": "Travel", "value": 800 }
  ],
  "monthlyData": [
    { "month": "Jan", "income": 2000, "expense": 800 }
  ]
}
```

---

# 🧪 Token Verification Middleware

```js
const verifyToken = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).send({ message: "Unauthorized" });

  const token = authorization.split(" ")[1];
  try {
    const decoderUser = await admin.auth().verifyIdToken(token);
    req.user = decoderUser;
    next();
  } catch {
    res.status(401).send({ message: "Unauthorized access." });
  }
};
```

---

# 🏁 Root Route

```js
GET /
Response: "Server is running Fine."
```

---

# 📌 Notes

✔ Each user can access only their own data.
✔ MongoDB aggregation used for reports & totals.
✔ Firebase token must be sent with every protected request.

---

# ⭐ Author

FinEase API – Secure financial tracking backend.
