# redesigned-memory for CIS 486 Projects in Information Systems Spring 2026
## Contributors 

* [Jace Calvert](https://github.com/Jcalvert22)
* [Carly Copley](https://github.com/carlycopley)
* [Gunnar Schmidt](https://github.com/Gunnar-Schmidtt/)

# 🏋️ Workout Generator App (Proposal)
[Link to app](http://34.16.191.24/)

## 💡 App Idea
As a new gym goer I want to be able to plan a workout without having to pay for a trainer that are tailored to absolute beginners that helps users quickly generate simple workouts based on their preferences.

Users will be able to select:
- A target muscle group (e.g., chest, legs, back)
- Available equipment (e.g., dumbbells, bodyweight, machines)
- How many movements they want to do

The application will generate a workout tailored to those inputs. Users can save exercises, view them later, and manage their personal exercise collection.

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
- Choose the amount of movements
- Add exercises to user account
- View saved exercises
- Delete exercises

---

## 💪 Our Value Proposition Statement: "Generate, Lift, Achieve." 

## ✅ What has improved
- The original app provided limited exercises making it hard to create an elaborate workout. Also, the API we called from provided 117 exercises with the ablility to add more.
- When it comes to workout generation, our app implements random logic to create fresh, innovative workouts to prevent users from experiencing gym burnout. 
- The original app was confusing because users could not edit their exercises or view exercises that the generator is being pulled from.
- The new and improved app provides more detailed organization and freedom to choose which muscle category, equipment, and number exercises desired.

---

## 📦 Selected Capability Boxes (100 pts total)

The following **10 capability boxes** have been selected to extend the application:

| Box | What We Did | Evidence | Notes |
|-----------|------------|------|
| Authenticaiton System | Added supabase capability for authentication. Using the ANON key and Website key when users sign up, it pings the website and private key to store the information and give user status back to the client. | https://github.com/Jcalvert22/redesigned-memory/issues/5  | After enforcing the use of Supabase, we implemented the ANON key into our .env on our vm to provide extra security.
| Database Upgrade | The Supabase implementation doubles as a database for storing the different username and passwords they are hashed for security. We wanted to move away from MongoDB because using Supabase disaster recovery is as simple as plugging a SQL script into the database. | https://github.com/Jcalvert22/redesigned-memory/issues/5 |
| Ui/Ux Overhaul | Upgrading app appearance with features such as a navbar with functional links. We also improved the overall look. We wanted to go for a more professional look that would be visually appealing for users. | https://github.com/Jcalvert22/redesigned-memory/issues/3 |
| Search funcitonality | Implemented a search bar, featured as a navbar link, to filter/select muscle groups. This is conviently linked near the add exercise button so you can see if an exercise is available, if its not add it in the same screen. | https://github.com/Jcalvert22/redesigned-memory/issues/6 |
| User feedback System | A rating feature that includes a uers's name, a rating out of 5 stars, and a description. Existing ratings can be sorted and filtered by age and number of stars. | https://github.com/Jcalvert22/redesigned-memory/issues/7 |
| API Integration | We pulled an API for the exercises from a different website so we can add many different exercises without adding them manually. We pulled from a database from a similar website to ours. | https://github.com/Jcalvert22/redesigned-memory/issues/4 |
| Debug Case Study | Debugging code we implemented in our yaml file. Performs directory inspections, file existence & integrity checks, and failure handling. | https://github.com/Jcalvert22/redesigned-memory/issues/8 |
| Monitoring and Logging | Implemented with NetStat, this shows us what ports are open and what network connections our website is making. We also have logging enabled to be able to track network evens. | https://github.com/Jcalvert22/redesigned-memory/issues/9 |
| Automation Ci/Cd | Implemented so we did not have to manually pull everything on the repo. Using this, we save so much time being able to push to our produciton site. | https://github.com/Jcalvert22/redesigned-memory/issues/10 |
| Deployment Guide | These are the exact steps we used to start up our VM. We wanted to give the exact commands and steps so if something went wrong, we could reset it and it not be as much of a problem. | https://github.com/Jcalvert22/redesigned-memory/issues/11 | 

---

## 🛠️ Tech Stack

### Frontend
- **React** – builds a responsive and interactive user interface  
- **CSS** – simple and clean styling  

### Backend
- **Node.js + Fetch** – REST API for handling workout generation, user data, and integrations  

### Database
- **Supabase** – stores users and saved workouts  

### Authentication
- **Supabase** – secure login and session handling  

### Integrations
- **External Json** – for exercise or fitness-related data  

### Testing & Debugging
- Basic testing and documented debugging process  

### DevOps / Deployment
- **Google Cloud Platform (GCP)** – deployment environment  
- **GitHub Actions** – CI/CD automation  

### Collaboration & Workflow
- **GitHub Milestones** – task dashboard  
- **Pull Requests** – structured code review process  
