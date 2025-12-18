# Learnix 🎓

> **Stream. Learn. Grow.** — A modern video learning platform

Learnix is a full-stack online video learning platform where instructors can publish courses and students can learn, track progress, and earn completion certificates.

![Learnix Banner](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80)

## ✨ Features

### For Students

- 📚 Browse and search courses by category, level, and rating
- 🎥 HD video streaming with progress tracking
- 📊 Personal dashboard with enrolled courses
- 🏆 Earn certificates upon course completion
- ⏱️ Resume from where you left off

### For Instructors

- 🎬 Create and publish video courses
- 📝 Organize content with modules and lessons
- 📈 Track enrollments and student progress
- 💰 Monetize courses with Stripe integration
- ⭐ View course ratings and reviews

### For Admins

- 👥 User management and moderation
- 📊 Platform analytics and revenue tracking
- ✅ Course approval workflow
- 🛡️ Role-based access control

## 🛠️ Tech Stack

### Backend

- **Java 17** with **Spring Boot 3.2**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with MySQL
- **Stripe SDK** for payment processing
- **Cloudinary** for media storage

### Frontend

- **Angular 19** with standalone components
- **Tailwind CSS v3** for styling
- **RxJS** for reactive programming
- **Signals** for state management
- **Dark mode** support

## 📁 Project Structure

```
Learnix/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/learnix/
│   │   ├── config/            # Configuration classes
│   │   ├── controller/        # REST controllers
│   │   ├── dto/               # Data transfer objects
│   │   ├── model/             # JPA entities
│   │   ├── repository/        # Data access layer
│   │   ├── security/          # JWT & Spring Security
│   │   └── service/           # Business logic
│   └── src/main/resources/
│       └── application.yml    # Application config
├── frontend/                   # Angular application
│   └── src/app/
│       ├── core/              # Services, guards, models
│       ├── shared/            # Reusable components
│       └── pages/             # Feature pages
└── .env.example               # Environment template
```

## 🚀 Getting Started

### Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- MySQL 8.x
- Yarn package manager

### Backend Setup

1. **Create MySQL Database**

   ```sql
   CREATE DATABASE learnix;
   ```

2. **Configure Environment**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Run the Backend**

   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

### Frontend Setup

1. **Install Dependencies**

   ```bash
   cd frontend
   yarn install
   ```

2. **Start Development Server**

   ```bash
   yarn dev
   ```

3. **Open in Browser**

   ```
   http://localhost:4200
   ```

## ⚙️ Configuration

### Required Environment Variables

```env
# Database
DB_URL=jdbc:mysql://localhost:3306/learnix
DB_USERNAME=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-256-bit-secret-key-here
JWT_EXPIRATION=86400000

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# URLs
FRONTEND_URL=http://localhost:4200
BACKEND_URL=http://localhost:8080
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Courses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | List all courses |
| GET | `/api/courses/:id` | Get course details |
| GET | `/api/courses/search?q=` | Search courses |
| POST | `/api/courses` | Create course (Instructor) |
| PUT | `/api/courses/:id` | Update course |
| DELETE | `/api/courses/:id` | Delete course |

### Enrollments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/courses/:id/enroll` | Enroll in course |
| GET | `/api/enrollments` | Get user enrollments |
| PUT | `/api/lessons/:id/progress` | Update progress |
| POST | `/api/lessons/:id/complete` | Mark lesson complete |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create-checkout` | Create Stripe session |
| POST | `/api/webhooks/stripe` | Stripe webhook handler |

## 🧪 Testing

### Backend Tests

```bash
cd backend
./mvnw test
```

### Frontend Tests

```bash
cd frontend
yarn test
```

## 📦 Deployment

### Backend (Azure App Service)

1. Build the JAR: `./mvnw clean package`
2. Deploy to Azure App Service
3. Configure environment variables

### Frontend (Netlify/Vercel)

1. Build: `yarn build`
2. Deploy `dist/frontend` folder
3. Configure redirects for SPA

## 🔒 Security

- JWT-based authentication with secure token storage
- Password hashing with BCrypt
- Role-based access control (STUDENT, INSTRUCTOR, ADMIN)
- CORS configuration for frontend origin
- Stripe webhook signature verification

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Made with ❤️ by the Learnix Team
