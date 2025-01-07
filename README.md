# Time Management and Focus Tracker

The **Time Management and Focus Tracker** is a feature designed for the Learning Management System (LMS) platform to help students effectively manage their study time and focus. This includes a Pomodoro timer, focus analytics, and gamification elements to motivate consistent study habits.

## Features

### Pomodoro Timer
- Start, pause, and reset the timer.
- Focus (25 minutes) and break (5 minutes) periods.
- Sound notifications or visual cues when sessions end.
- Display of session count and streak progress.

### Focus Analytics
- Daily and weekly metrics:
  - Total focus time.
  - Number of completed sessions.
- Visual representations:
  - Bar charts, heatmaps, or pie charts.
- Motivational messages based on performance (e.g., streak achievements).

### Gamification
- Rewards for consistent study habits:
  - Progress bars and badges.
  - Highlights of longest streaks.

### Responsiveness
- Fully responsive for mobile, tablet, and desktop devices.

### Real-time Updates
- Dynamic timer updates without requiring page refresh.

## Tech Stack

### Frontend
- **Framework**: Next.js
- **State Management**: React Query, Redux Toolkit
- **TypeScript**: Ensures type safety and scalability
- **Visualization**: Chart.js or Recharts for analytics
- **Styling**: Responsive design for all screen sizes

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Caching**: Redis for improved performance
- **Authentication**: JWT for secure API access
- **Containerization**: Docker for consistent deployment
- **Monitoring**: Prometheus for API performance, Winston/Pino for logging

## API Endpoints

1. **POST /focus-session**  
   Log a completed focus session.
   - **Request Body**: 
     ```json
     {
       "userId": "string",
       "duration": "number"
     }
     ```
   - **Response**: 
     ```json
     {
       "message": "Session logged successfully."
     }
     ```

2. **GET /focus-metrics**  
   Fetch daily/weekly focus metrics for a user.
   - **Response**: 
     ```json
     {
       "dailyMetrics": {
         "totalFocusTime": "2 hours",
         "sessionsCompleted": 4
       },
       "weeklyMetrics": {
         "totalFocusTime": "10 hours",
         "sessionsCompleted": 20
       }
     }
     ```

3. **GET /streaks**  
   Fetch the current and longest streak for a user.
   - **Response**: 
     ```json
     {
       "currentStreak": 5,
       "longestStreak": 12
     }
     ```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- Docker
- Redis
- PostgreSQL

## Setup Instructions

### Prerequisites

-   Node.js and npm installed
-   PostgreSQL database running

### Frontend Setup:

1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file in the root of the frontend directory and add the following:
    ```env
    NEXT_PUBLIC_BASE_URL=<your-database-url>
    AUTH_SECRET=<your-jwt-secret>
    ```
4. Start the development server:
    ```bash
    npm run dev
    ```

Access the application at http://localhost:3000.


### Demo
- Live Demo: Time Management Tracker
- Demo Credentials:
- user: ali@gmail.com / 123456
- Deployment
- The application is deployed and can be accessed via [Focusly](https://focusly-swart.vercel.app/)


### Caching:
Redis is used for storing daily/weekly metrics for fast retrieval.
### Gamification:
Logic to calculate streaks and assign badges.