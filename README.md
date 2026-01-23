# cricket-backend
a online booking system

🏏 Box Cricket Booking System
A full-stack Box Cricket Slot Booking Platform with a user booking interface, secure admin dashboard, booking analytics (charts), and cloud deployment.
🔗 Live Website:
👉 https://cricket-frontend-z1x2.onrender.com
✨ Features
👥 User Side
Book box cricket slots by date & time
Prevents double booking of the same slot
View live list of booked slots
Fully mobile-friendly UI
🔐 Admin Panel
Secure admin access using Admin Key
View all bookings
Edit / Delete bookings
Send Email & SMS (API-ready)
Bookings per day chart (analytics)
Real-time updates from database
🛠 Tech Stack
Frontend
React.js
HTML, CSS, JavaScript
Deployed on Render (Static Site)
Backend
Node.js
Express.js
Deployed on Render (Node Service)
Database
MongoDB Atlas (Cloud Database)

System Architecture
ASCII Architecture (GitHub-Readable)
+---------+
|  User   |
| Browser |
+----+----+
     |
     | HTTP Requests
     v
+----------------------+
| React Frontend       |
| (Render - Static)    |
+----------+-----------+
           |
           | API Calls
           v
+----------------------+
| Node.js + Express    |
| Backend API          |
| (Render Service)     |
+----------+-----------+
           |
           | MongoDB Queries
           v
+----------------------+
| MongoDB Atlas        |
| Cloud Database       |
+----------------------+
User → React UI → Express API → MongoDB
Admin → React Admin Dashboard → Express Admin APIs → MongoDB
Admin Authentication
Admin access is protected using an Admin Key
The key is stored securely in backend environment variables
Example .env (Backend)
Copy code
Env
MONGO_URI=your_mongodb_connection_string
PORT=5000
ADMIN_KEY=xxxxxkey

📊 API Overview
Method
Endpoint
Description
POST
/book
Create a new booking
GET
/bookings
Get all bookings
GET
/admin/bookings
Admin: View all bookings
PUT
/admin/bookings/:id
Admin: Update booking
DELETE
/admin/bookings/:id
Admin: Delete booking
POST
/admin/send-email
Admin: Send email
POST
/admin/send-sms
Admin: Send SMS




📸 Screenshots
Screenshots are kept separately for clarity.
Copy code

screenshots/
├── home.png
├── admin-dashboard.png
├── bookings-chart.png
├── admin-controls.png
Example usage in README:
Copy code
Md
![Home Page](screenshots/home.png)
![Admin Dashboard](screenshots/admin-dashboard.png)
![Bookings Chart](screenshots/bookings-chart.png)
![Admin Controls](screenshots/admin-controls.png)
🚀 Deployment
Frontend: Render (Static Site)
Backend: Render (Node Service)
Database: MongoDB Atlas
Both services are deployed independently and communicate via REST APIs.
🎯 Why This Project Matters
Real-world full-stack architecture
Secure admin authorization
Analytics-ready backend
Production deployment experience
Clean, scalable REST APIs.


---

## 👤 Author

**Gurram Karthikeya**  
🎓 B.Tech – CSE (AI & ML)  
🏫 St. Mary's Engineering College, Hyderabad  
📧 Email: karthikyanetha7@gmail.com  
📍 Location: Telangana, India  

🔗 GitHub: https://github.com/karthikeyanetha1  
🔗 LinkedIn: https://www.linkedin.com/in/your-link-here

---


