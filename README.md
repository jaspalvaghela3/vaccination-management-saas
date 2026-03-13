# Vaccination Management SaaS

An enterprise-grade SaaS system for managing child vaccination schedules. Designed for healthcare providers (doctors) and parents/guardians to track, schedule, and manage vaccinations based on WHO, CDC, and IAP (Indian Academy of Pediatrics) guidelines.

## Features

### For Doctors / Healthcare Providers
- Manage multiple patients with full profile details
- View and update vaccination records
- Mark vaccines as administered with batch numbers and notes
- Analytics dashboard with vaccination coverage statistics
- Search and filter patients
- Send notifications to parents

### For Parents / Guardians
- Register and manage multiple children
- View complete vaccination schedules (upcoming, completed, overdue)
- Track vaccination history
- Email reminders for upcoming vaccinations
- Download vaccination records

### System Features
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Complete WHO/CDC/IAP vaccination schedule (37 vaccines from birth to 16 years)
- Automated schedule generation based on child's date of birth
- Email notification system
- API documentation with Swagger/OpenAPI
- Docker containerization support

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Material-UI v5, Redux Toolkit |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL with Prisma ORM |
| Authentication | JWT (access + refresh tokens), bcrypt |
| Email | Nodemailer |
| Logging | Winston |
| Validation | Zod (backend), React Hook Form + Yup (frontend) |
| Documentation | Swagger/OpenAPI |
| Containerization | Docker + Docker Compose |

## Project Structure

```
vaccination-management-saas/
├── frontend/          # React + TypeScript application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page-level components
│   │   ├── services/    # API service layer
│   │   ├── store/       # Redux Toolkit state management
│   │   ├── hooks/       # Custom React hooks
│   │   ├── utils/       # Helper utilities
│   │   ├── types/       # TypeScript type definitions
│   │   └── constants/   # Application constants
│   └── package.json
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── controllers/ # Route handlers
│   │   ├── routes/      # Express routes
│   │   ├── middlewares/ # Auth, error handling, validation
│   │   ├── services/    # Business logic services
│   │   ├── utils/       # Utility functions
│   │   └── config/      # App configuration
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.ts        # Vaccine data seed
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm 9+

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/jaspalvaghela3/vaccination-management-saas.git
cd vaccination-management-saas

# Create environment file
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Start all services
docker-compose up -d

# Run database migrations and seed
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run prisma:seed
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database connection and secrets

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with vaccine data
npm run prisma:seed

# Start development server
npm run dev
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env if needed (default: REACT_APP_API_URL=http://localhost:5000/api)

# Start development server
npm start
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret for access token signing | Required |
| `JWT_REFRESH_SECRET` | Secret for refresh token signing | Required |
| `JWT_EXPIRES_IN` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `7d` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Frontend origin for CORS | `http://localhost:5173` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username/email | Required for emails |
| `SMTP_PASS` | SMTP password/app password | Required for emails |
| `EMAIL_FROM` | Sender email address | `noreply@vaccination-saas.com` |
| `BCRYPT_ROUNDS` | bcrypt hashing rounds | `12` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` |

## API Documentation

Once the backend is running, API documentation is available at:
`http://localhost:5000/api-docs`

### Key API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user (doctor/parent)
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

#### Children Management
- `GET /api/children` - List children
- `POST /api/children` - Register a new child
- `GET /api/children/:id` - Get child details
- `PUT /api/children/:id` - Update child profile
- `DELETE /api/children/:id` - Delete child record

#### Vaccination Schedule
- `GET /api/children/:childId/schedule` - Get auto-generated vaccination schedule
- `GET /api/children/:childId/vaccination-records` - Get vaccination history
- `POST /api/vaccination-records` - Create vaccination record
- `PUT /api/vaccination-records/:id` - Update record (mark as administered)

#### Vaccines
- `GET /api/vaccines` - List all vaccines
- `GET /api/vaccines/:id` - Get vaccine details

## Database Schema

The system uses PostgreSQL with the following main tables:

- **Users** - Authentication and base user info
- **Doctors** - Doctor-specific profile data
- **Parents** - Parent-specific profile data
- **Children** - Child profiles with DOB, medical info
- **Vaccines** - Comprehensive vaccine catalogue (37 vaccines)
- **VaccinationRecords** - Vaccination history and scheduling
- **Notifications** - System notifications
- **RefreshTokens** - JWT refresh token management

## Vaccination Schedule

The system implements vaccination schedules based on IAP, WHO, and CDC guidelines:

| Age | Vaccines |
|-----|----------|
| Birth (0 months) | BCG, Hepatitis B (Dose 1), OPV Zero Dose |
| 6 weeks (1.5 months) | DTwP/DTaP (D1), IPV (D1), Hib (D1), Rotavirus (D1), PCV (D1), Hepatitis B (D2) |
| 10 weeks (2.5 months) | DTwP/DTaP (D2), IPV (D2), Hib (D2), Rotavirus (D2), PCV (D2) |
| 14 weeks (3.5 months) | DTwP/DTaP (D3), IPV (D3), Hib (D3), Rotavirus (D3), PCV (D3), Hepatitis B (D3) |
| 6 months | Influenza (yearly) |
| 9 months | MMR (Dose 1) |
| 12 months | Hepatitis A (D1), Typhoid Conjugate |
| 15 months | MMR (D2), Varicella (D1), PCV Booster |
| 18 months | DTwP/DTaP Booster 1, IPV Booster, Hib Booster |
| 24 months | Hepatitis A (D2) |
| 4-6 years | DTwP/DTaP Booster 2, MMR (D3), Varicella (D2) |
| 10-12 years | Tdap, HPV |
| 16 years | Tdap Booster |

## Security

- All passwords hashed with bcrypt (12 rounds)
- JWT access tokens expire in 15 minutes
- Refresh token rotation on each use
- Helmet.js security headers
- CORS protection
- Rate limiting (100 requests per 15 minutes)
- Input validation on all endpoints
- SQL injection prevention via Prisma ORM
- XSS protection via React's JSX escaping

## Development

### Code Quality
- TypeScript for end-to-end type safety
- ESLint for code linting
- Consistent API response format: `{ success, data, message, errors }`

### Running Tests
```bash
# Backend tests (when test suite is added)
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Building for Production
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.
