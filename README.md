# redesigned-memory for CIS 486 Projects in Information Systems Spring 2026
## Contributors 

* [Jace Calvert](https://github.com/Jcalvert22)
* [Carly Copley](https://github.com/carlycopley)
* [Gunnar Schmidt](https://github.com/Gunnar-Schmidtt/)

# 🏋️ Workout Generator App (Proposal) 12345678910
[Link to app](http://34.16.191.24/)

## 💡 App Idea
This project is a beginner-friendly full-stack web application that helps users quickly generate simple workouts based on their preferences.

Users will be able to select:
- A target muscle group (e.g., chest, legs, back)
- Available equipment (e.g., dumbbells, bodyweight, machines)

The application will generate a **3-exercise workout routine** tailored to those inputs. Users can save exercises, view them later, and manage their personal exercise collection.

The app will also include additional integrations and features to enhance usability, reliability, and overall user experience.

---

## 🎯 Target Users
- Beginner gym-goers who don’t know how to structure workouts  
- Students looking for quick and simple workout routines  
- Users working out at home with limited equipment  
- Anyone who wants to generate and save basic workouts quickly  

---

## ⚙️ Features

### Core Features (MVP)
- User authentication (signup/login)
- Select muscle group and available equipment
- Generate a 3-exercise workout
- Save exercises to user account
- View saved exercises
- Delete exercises

---

## 📦 Selected Capability Boxes (100 pts total)

The following **10 capability boxes** have been selected to extend the application:

### 🔹 Development & Architecture
1. **Authentication System (Login System)**  
   - Implement secure user authentication
    - https://supabase.com/dashboard/project/itledwbcorbmpeogbtgn/auth/users?filter=id 

2. **Database Upgrade (Supabase)**  
   - Use Supabase for database management and storage  
     - https://supabase.com/dashboard/project/itledwbcorbmpeogbtgn/database/schemas
---

### 🔹 Product & User Experience
3. **UI/UX Design Improvement (Clean Navigation)**  
   - Design an intuitive and user-friendly interface with clear navigation
   ```
   <nav class="main-nav" aria-label="Primary navigation">
        <a href="#" class="active">Workout Generator</a>
        <a href="exercises.html">Manage Exercises</a>
        <a href="search.html">Search</a>
        <a href="feedback.html">Feedback</a>
        <a href="login.html">Login / Register</a>
      </nav>
   ```

4. **Search Functionality (Muscle Groups)**  
   - Implement a search bar to filter/select muscle groups
    - https://github.com/Jcalvert22/redesigned-memory/blob/main/search.html

5. **User Feedback System**  
   - Allow users to submit feedback and store it
     - https://github.com/Jcalvert22/redesigned-memory/blob/main/feedback.html

---

### 🔹 Integration & Features
6. **API Integration**  
   - Integrate an external fitness/exercise API
     ```
     try {
      const res  = await fetch('https://raw.githubusercontent.com/Jcalvert22/congenial-train-app-server/main/public/data/exercises.json');
      const raw  = await res.json();
      const flat = [];
     ```

---

### 🔹 Testing & Reliability
7. **Debug Case Study**  
   - Document a major bug encountered and how it was resolved
     - https://github.com/Jcalvert22/redesigned-memory/blob/main/docs/debug_case_study.md

---

### 🔹 DevOps & Infrastructure
8. **Monitoring & Logging**  
   - Log requests, errors, and important backend events
    - http://34.16.191.24:19999/#metrics_correlation=false&after=-900&before=0&modal=&modalTab=

9. **Automation (CI/CD)**  
   - Set up automated workflows (e.g., GitHub Actions) for testing or deployment
    -  https://github.com/Jcalvert22/redesigned-memory/actions/runs/24848723761 

10. **Deployment Guide (GCP Setup)**  
   - Provide a step-by-step guide for deploying the app using Google Cloud Platform
     -  https://github.com/Jcalvert22/redesigned-memory/blob/main/docs/deploymentGuide.md

---

## 🛠️ Tech Stack

### Frontend
- **React** – builds a responsive and interactive user interface  
- **CSS** – simple and clean styling  

### Backend
- **Node.js + Express** – REST API for handling workout generation, user data, and integrations  

### Database
- **Supabase** – stores users and saved workouts  

### Authentication
- **JWT (JSON Web Tokens)** – secure login and session handling  

### Integrations
- **External API** – for exercise or fitness-related data  

### Testing & Debugging
- Basic testing and documented debugging process  

### DevOps / Deployment
- **Google Cloud Platform (GCP)** – deployment environment  
- **GitHub Actions** – CI/CD automation  

### Collaboration & Workflow
- **GitHub Issues & Projects** – product backlog and task tracking  
- **Pull Requests** – structured code review process  
