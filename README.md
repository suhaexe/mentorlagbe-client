Here is the complete, professional `README.md` that fulfills all the assignment requirements. 

You should put this file in the root of **BOTH** your client and server repositories (or at least definitely in the client repo).

### 📋 Copy everything below this line into your `README.md`

***

# MentorLagbe - Smart Tuition & Mentorship Platform

## 📖 Project Purpose
MentorLagbe is a full-stack EdTech platform designed to bridge the gap between qualified Tutors and eager Students. It provides a seamless ecosystem where tutors can post their tuition batches, students can search and apply for them, and admins can moderate the platform. 

## 🌐 Live URLs
- **Frontend Live Site:** [PASTE YOUR VERCEL FRONTEND URL HERE]
- **Backend API URL:** [PASTE YOUR VERCEL BACKEND URL HERE]

## 🔐 Test Credentials (For Evaluation)
To test the different dashboards, please use the following accounts:

**Admin Account:**
- **Email:** admin@mentorlagbe.com
- **Password:** Admin@123456

**Tutor Account (Quick Testing):**
- **Email:** tutor@mentorlagbe.com
- **Password:** Tutor@123456

**Student Account (Quick Testing):**
- **Email:** student@mentorlagbe.com
- **Password:** Student@123456

## ✨ Key Features
- **Role-Based Authentication:** Secure login and registration using BetterAuth and JWT, with 3 distinct roles (Student, Tutor, Admin).
- **Dynamic Dashboards:** 
  - **Student:** Track applications, view stats, and cancel pending applications.
  - **Tutor:** Post tuitions, manage applicants (accept/reject), toggle listing visibility, and full CRUD on tuition posts.
  - **Admin:** Moderate tuition listings (approve/reject), manage user roles, and track Stripe revenue.
- **Tuition Marketplace:** Advanced server-side search, filtering (by class, mode, subject), and pagination.
- **Image Uploads:** Direct image uploading via the ImgBB API for banners and profile pictures.
- **Stripe Payments:** Integrated Stripe Checkout for upgrading to Pro plans (Tutor Pro $15, Student Pro $10).
- **Modern UI/UX:** Fully responsive, Awwwards-level design featuring a 3D scroll-journey Hero section, Dark/Light mode toggle, and Framer Motion animations.
- **Security:** Protected Express API routes using custom JWT verification middlewares (`verifyToken`, `verifyStudent`, `verifyTutor`, `verifyAdmin`).

## 🛠️ Tech Stack & Packages Used

**Frontend:**
- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Auth:** Better Auth Client
- **Theme:** Next Themes
- **Notifications:** Sonner (react-hot-toast alternative)

**Backend:**
- **Framework:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Auth:** Better Auth, JSON Web Tokens (JWT)
- **Payments:** Stripe Node SDK
- **Image Hosting:** ImgBB API