# FinaPay

## [See the App!](https://finapay.netlify.app/)

![App Logo](https://finapay.netlify.app/assets/finapayLogoSinFondo-834b27d9.png)


## Description
- Finapay is a web application to send and receive money from your friends, manage your expenses and invest your savings.

#### [Client Repo here](https://github.com/aaridoms/finapay-client)
#### [Server Repo here](https://github.com/aaridoms/finapay-server)

## Backlog Functionalities
- Implementing a real payments system
- Implement SocketIO for real time messages

## Technologies used
- NodeJs
- bcryptjs
- Cloudinary
- express-jwt
- jsonwebtoken
- nodemailer

# Server Structure

## Models

### User Model
```javascript
{
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    role: {
      type: String,
      enum: ['Admin', 'User'],
      default: 'User'
    },
    expenses: [{
      type: Schema.Types.ObjectId,
      ref: 'Expense'
    }],
    operation: [{
      type: Schema.Types.ObjectId,
      ref: 'Operation'
    }],
    funds: {
      type: Number,
      required: [true, 'Funds is required.'],
      default: 0
    },
    profilePic: {
      type: String,
  },
},
```

### Expense Model

````javascript
{
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required.'],
    },
    category: {
      type: [String],
      enum: ['Food', 'Transportation', 'Housing', 'Utilities', 'Insurance', 'Medical & Healthcare', 'Debt Payments', 'Personal', 'Recreation & Entertainment', 'Miscellaneous'],
      required: [true, 'Category is required.']
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
    }
},  
````

### Investment Model

````javascript
{
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    risk: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: [true, "Risk is required."],
    },
    interesRate: {
      type: Number,
      required: [true, "Interest Rate is required."],
    },
    category: {
      type: [String],
      enum: [
        "Stocks",
        "Bonds",
        "Mutual Funds",
        "ETFs",
        "Real Estate",
        "Commodities",
        "Cryptocurrency",
        "Cash Equivalents",
      ],
      required: [true, "Category is required."],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required."],
    },
    notes: {
      type: String,
    },
    users: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
},  
````

### Operation Model

````javascript
{
    amount: {
      type: Number,
      required: [true, "Name is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending"
    },
    earnings: {
      type: Number
    }
},  
````

### Transaction Model

`````javascript
{
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required."],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    concept: {
      type: String,
    },
  
},
`````

## API Endpoints (backend routes)

| HTTP Method | URL                         | Request Body                 | Success status | Error Status | Description                                                    |
| ----------- | --------------------------- | ---------------------------- | -------------- | ------------ | -------------------------------------------------------------- |
| POST        | `/auth/signup`              | {name, email, password}      | 201            | 400          | Registers the user in the Database                             |
| POST        | `/auth/login`               | {email, password}            | 200            | 400          | Validates credentials, creates and sends Token                 |
| GET         | `/auth/verify`              |                              | 200            | 401          | Verifies the user Token                                        |
| GET         | `/account/summary`          |                              | 200            | 400          | Show the user summary                                          |
| POST        | `/account/add-funds`        | {funds}                      | 201            | 400          | Adds funds to the user                                         |
| GET         | `/account/profile`          |                              | 200            | 400, 401     | Shows user profile                                             |
| PATCH       | `/''/profile/edit-email`    | {email}                      | 200            | 400, 401     | Edits user email                                               |
| POST        | `/profile/edit-img`         |                              | 200            | 401          | Edits user img                                                 |
| POST        | `/account/send`             | {to, amount, concept}        | 200            | 401          | Sends money to an user                                         |
| GET         | `/investments`              |                              | 200            | 400, 401     | Get all investments                                            |
| POST        | `/add`                      | {name, risk, interesRate, category, duration, notes}         | 200            | 401          | Add a new investment           |
| DELETE      | `/:investmentId:delete`     |                              | 200            | 401          | Delete an investment                                           |
| POST        | `/:investmentId:join`       | {amount}                     | 200            | 401          | User can join to investments                                   |
| GET         | `/investment/userinvestment`|                              | 200            | 400          | Get all user investment                                        |
| GET         | `/account/expenses`         |                              | 200            | 400          | Get all expenses                                               |
| GET         | `/''/''/:id/details`        |                              | 200            | 400          | Get a specific expense                                         |
| POST        | `''/''/add`                 | {name, amount, category, notes} | 200         | 400          | Create a new expense                                           |
| DELETE      | `''/''/:id/delete`          |                              | 200            | 400          | Delete an expense                                              |
| PUT         | `''/''/:id/edit`            | {name, amount, category, notes} | 200         | 400          | Edit an expense                                                |

## Links

### Collaborators

[Sergio Puyod](https://github.com/SergioPYD)

[Ángel Arias](https://github.com/aaridoms)

### Project

[Repository Link Client](https://github.com/aaridoms/finapay-client)

[Repository Link Server](https://github.com/aaridoms/finapay-server)

[Deploy Link](https://finapay.netlify.app/)
