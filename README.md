# Task Management System (Kanban Board)

A full-stack task management application featuring a drag-and-drop Kanban board, user authentication, and responsive design. This project was developed as an SDE Intern Assignment for OZi Technologies.

## 🚀 Live Demo
- **Frontend:** https://harshdeep-btech-10920-22.vercel.app/
- **Backend:** https://task-manager-api-e81e.onrender.com
- **GitHub Repository:** https://github.com/Co-ctrl-hash/Harshdeep_btech-10920-22

## ✨ Features
- **User Authentication:** Secure Sign Up, Login, and Logout functionality
- **Profile Management:** Users can update and delete their profiles
- **Kanban Board:** Visual task management with **Pending**, **In Progress**, and **Completed** columns
- **Drag & Drop:** Interactive task movement between status columns
- **Task Management:** Create, Read, Update, and Delete (CRUD) tasks
- **Filtering:** Filter tasks by status
- **Responsive Design:** Optimized for both desktop and mobile views

## 🎯 Advanced Features
- 🎯 **Activity/Audit Log** - Track all user actions with detailed activity history
- ⚡ **Optimistic UI Updates** - Instant feedback with automatic rollback on errors
- 📅 **Due-Date Intelligence** - Visual indicators for overdue, due today, and upcoming tasks
- 🗑️ **Soft Delete** - Non-destructive deletion for both users and tasks
- 🛡️ **Global Error Handling** - Centralized error management with proper status codes

## � Screenshots
![Login Screen](screenshots/login.png)
*Login Screen*

![Kanban Board](screenshots/kanban-board.png)
*Kanban Board Dashboard*

## �🛠️ Tech Stack
- **Frontend:** React.js, Vite, HTML5 Drag and Drop API
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens)
- **Version Control:** Git & GitHub

## 📁 Project Structure

```
Harshdeep_btech-10920-22/
├── backend/            # Backend API (Node.js/Express)
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── taskController.js  # Task CRUD + Activity logging
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication middleware
│   │   └── errorHandler.js    # Global error handling
│   ├── models/
│   │   ├── User.js            # User schema (with soft delete)
│   │   ├── Activity.js        # Activity/Audit log schema
│   │   └── Task.js            # Task schema (with soft delete)
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   └── taskRoutes.js      # Task + Activity endpoints
│   ├── .env                   # Environment variables
│   ├── .env.example           # Environment variables template
│   ├── server.js              # Entry point with error handling
│   └── package.json
│
├── frontend/           # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskCard.jsx    # Task card with due-date intelligence
│   │   │   ├── TaskModal.jsx   # Task create/edit modal
│   │   │   └── ActivityLog.jsx # Activity log component
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Signup.jsx      # Signup page
│   │   │   ├── Dashboard.jsx   # Kanban board with optimistic UI
│   │   │   └── Profile.jsx     # User profile edit/delete
│   │   ├── services/
│   │   │   └── api.js          # API service with interceptors
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Co-ctrl-hash/Harshdeep_btech-10920-22.git
cd Harshdeep_btech-10920-22
```

### 2. Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB installation)
- npm or yarn

### 3. Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### 4. Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🎮 Usage

1. **Sign Up**: Create a new account with name, email, and password
2. **Login**: Login with your credentials
3. **Profile Management**:
   - Click "Profile" button to edit your profile
   - Update name, email, or password
   - Delete account (with confirmation)
4. **Create Tasks**: Click "Add New Task" to create a new task
5. **Manage Tasks**: 
   - Edit tasks by clicking the "Edit" button
   - Delete tasks by clicking the "Delete" button
   - Drag and drop tasks between columns to change status
6. **Filter Tasks**: Use query parameters to filter by status (API level)
7. **Logout**: Click "Logout" to end your session

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
  - Body: `{ name, email, password }`
  - Response: `{ _id, name, email, token }`
  
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Response: `{ _id, name, email, token }`
  
- `GET /api/auth/me` - Get current user (protected)
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ _id, name, email, createdAt, updatedAt }`
  
- `PUT /api/auth/profile` - Update user profile (protected)
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ name?, email?, password? }`
  - Response: `{ _id, name, email, token }`
  
- `DELETE /api/auth/profile` - Delete user profile (soft delete, protected)
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ message }`

### Tasks
- `GET /api/tasks` - Get all user tasks (excludes soft-deleted, protected)
  - Headers: `Authorization: Bearer {token}`
  - Query params: `?status=pending|in-progress|completed` (optional)
  - Response: `[{ _id, title, description, status, due_date, user, is_deleted, createdAt, updatedAt }]`
  
- `POST /api/tasks` - Create new task with activity logging (protected)
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ title, description, status?, due_date }`
  - Response: `{ _id, title, description, status, due_date, user, is_deleted, createdAt, updatedAt }`
  
- `GET /api/tasks/:id` - Get single task (protected)
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ _id, title, description, status, due_date, user, is_deleted, createdAt, updatedAt }`
  
- `PUT /api/tasks/:id` - Update task with activity logging (protected)
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ title?, description?, status?, due_date? }`
  - Response: `{ _id, title, description, status, due_date, user, is_deleted, createdAt, updatedAt }`
  
- `DELETE /api/tasks/:id` - Soft delete task with activity logging (protected)
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ message }`

### Activity Log
- `GET /api/tasks/activities` - Get last 5 user activities (protected)
  - Headers: `Authorization: Bearer {token}`
  - Response: `[{ _id, user, action, taskTitle, details, oldStatus, newStatus, createdAt }]`

## Task Schema

```javascript
{
  title: String (required),
  description: String (required),
  status: String (enum: ['pending', 'in-progress', 'completed']),
  due_date: Date (required),
  user: ObjectId (reference to User),
  is_deleted: Boolean (default: false),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## Activity Schema

```javascript
{
  user: ObjectId (reference to User, required),
  action: String (enum: ['task_created', 'task_updated', 'task_deleted', 'status_changed']),
  taskTitle: String (required),
  details: String (required),
  oldStatus: String (optional),
  newStatus: String (optional),
  createdAt: Date (auto-generated)
}
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement
JWT_SECRET=your_secure_secret_key
NODE_ENV=development
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication with 30-day expiry
- Protected API routes
- User-specific task access
- Input validation with Mongoose
- Soft delete for users and tasks
- Last login tracking
- Global error handling with proper status codes
- Active user verification on protected routes
- Active/inactive user management

## Advanced Features Explained

### 1. Activity/Audit Log 🎯
- **Backend**: New `Activity` model tracks all user actions (task_created, task_updated, task_deleted, status_changed)
- **Implementation**: Automatic logging in all task operations (create, update, delete)
- **Frontend**: `ActivityLog` component displays last 5 activities with icons, timestamps, and status changes
- **Benefits**: Full audit trail for debugging, compliance, and user transparency

### 2. Optimistic UI Updates ⚡
- **Implementation**: Updates UI immediately when dragging tasks between columns
- **Error Handling**: Stores previous state and rolls back automatically on API failure
- **User Experience**: Instant feedback without waiting for server response
- **Benefits**: Feels responsive even on slow connections

### 3. Due-Date Intelligence 📅
- **Logic**: Calculates days until due date and categorizes tasks:
  - **Overdue**: Past due date (red badge with pulse animation)
  - **Due Today**: Due date is today (yellow badge)
  - **Due Soon**: 1-3 days remaining (blue badge)
- **Visual Feedback**: Color-coded badges next to due dates
- **Benefits**: Helps users prioritize urgent tasks at a glance

### 4. Soft Delete (Tasks & Users) 🗑️
- **Users**: `is_active` field marks deleted accounts without removing data
- **Tasks**: `is_deleted` field marks deleted tasks
- **Query Filtering**: All GET requests exclude soft-deleted records
- **Benefits**: Data recovery possible, maintains referential integrity, audit trail intact

### 5. Global Error Handling 🛡️
- **Middleware**: `errorHandler.js` catches all errors centrally
- **Error Types Handled**:
  - Mongoose CastError (invalid ObjectId) → 404
  - Duplicate key errors → 400
  - Validation errors → 400 with detailed messages
  - JWT errors → 401 with specific messages
- **Benefits**: Consistent error responses, no unhandled exceptions, cleaner code

---

# ✅ SUBMISSION CHECKLIST

**Ozi SDE Assignment – Task Management System (Kanban Based)**

## 🧩 1. Core Functionality

* ✅ Application runs without errors (backend + frontend)
* ✅ Environment variables configured correctly
* ✅ No secrets committed to GitHub
* ✅ Fresh clone + setup works using README instructions

## 🔐 2. Authentication & User Management

* ✅ User can sign up
* ✅ User can log in
* ✅ User can log out
* ✅ Protected routes blocked without authentication
* ✅ JWT implemented securely
* ✅ Passwords are hashed (bcryptjs)
* ✅ User can update profile details
* ✅ User can delete account (soft delete implemented)
* ✅ `last_login_at` updates on every login
* ✅ User data is isolated (users cannot see others' tasks)

## 👤 3. User Profile

* ✅ Profile includes: name, email, created_at, updated_at, last_login_at
* ✅ Profile edit functionality works
* ✅ Password update handled securely
* ✅ Inactive users cannot access protected routes

## 🗂️ 4. Task Management (CRUD)

* ✅ User can create a task
* ✅ User can view their tasks
* ✅ User can update a task
* ✅ User can delete a task
* ✅ Each task contains:
  * ✅ title
  * ✅ description
  * ✅ status (pending / in-progress / completed)
  * ✅ due_date
  * ✅ created_at
* ✅ Tasks are user-specific
* ✅ Filtering tasks by status works (GET /api/tasks?status=pending)
* ✅ Invalid input is handled gracefully

## 📌 5. Kanban Board (Frontend)

* ✅ Kanban board has exactly **3 columns**
  * ✅ Pending
  * ✅ In Progress
  * ✅ Completed
* ✅ Tasks load correctly into columns based on status
* ✅ Task card displays:
  * ✅ Title
  * ✅ Short description
  * ✅ Due date
* ✅ UI is clean and minimal
* ✅ UI is mobile responsive

## 🖱️ 6. Drag & Drop

* ✅ Tasks can be dragged between columns
* ✅ Dragging updates task status immediately
* ✅ Backend API is called on drag end
* ✅ Task status persists after page refresh
* ✅ Drag errors are handled safely
* ✅ Invalid status updates are blocked

## 🛠️ 7. Backend Quality

* ✅ Clean folder structure
* ✅ RESTful API conventions followed
* ✅ Input validation on all endpoints
* ✅ Meaningful error messages returned
* ✅ Correct HTTP status codes used (200, 201, 400, 401, 403, 404, 500)
* ✅ Authorization checks on every protected route
* ✅ Centralized error handling

## 🗄️ 8. Database

* ✅ Proper schema/models defined (User, Task)
* ✅ Clear user → task relationship
* ✅ Safe deletes with soft delete
* ✅ Timestamps on all models

## 📄 9. README & Documentation

* ✅ Project overview included
* ✅ Tech stack clearly mentioned
* ✅ Backend setup instructions
* ✅ Frontend setup instructions
* ✅ Environment variable explanation
* ✅ Complete API documentation
* ✅ Assignment clearly described

## 🌱 10. Git & Repository Hygiene

* ✅ Single repository for frontend + backend
* ✅ Meaningful commit messages
* ✅ `.env` excluded
* ✅ `node_modules` excluded
* ✅ `.env.example` provided

## ⭐ 11. Bonus Features

* ✅ Clear separation of concerns
* ✅ Reusable components (TaskCard, TaskModal, Profile)
* ✅ Code is readable and well-structured

---

## 🏁 FINAL CONFIRMATION

* ✅ Project reviewed against assignment requirements
* ✅ All mandatory features implemented
* ✅ No missing functionality
* ✅ Ready for technical review
* ✅ Ready for interview explanation

---

## Future Enhancements

- Task categories/tags
- Task priority levels
- Due date notifications
- Task search and filter
- User profile management
- Task collaboration
- Dark mode

---

## 👨‍💻 Author

**Harshdeep Singh**
- GitHub: [@Co-ctrl-hash](https://github.com/Co-ctrl-hash)
- Repository: [Harshdeep_btech-10920-22](https://github.com/Co-ctrl-hash/Harshdeep_btech-10920-22)

## 📝 Assignment Details

**Developed for:** OZi Technologies  
**Position:** SDE Intern Assignment  
**Project Type:** Full-Stack Task Management System (Kanban Based)

---

## 📄 License

ISC

---

**Note**: Make sure MongoDB is running and properly configured before starting the application.
