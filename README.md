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

## 📦 Selected Capability Boxes (100 pts total)

The following **10 capability boxes** have been selected to extend the application:

| Component | Capability | Link | Explanation |
|-----------|------------|------|-------------|
| Authenticaiton System | Added supabase capability for authentication | https://github.com/Jcalvert22/redesigned-memory/issues/5  | After enforcing the use of Supabase, we implemented the ANON key into our .env on our vm to provide extra security. |
| Database Upgrade | The Supabase implementation doubles as a database for storing the different username and passwords they are hashed for security. This is a proven upgrade in comparison to the previous database, MongoDB. | https://github.com/Jcalvert22/redesigned-memory/issues/5 | Being able to store the username and passwords help registering and signing in faster and more effecience |
| Ui/Ux Overhaul | Upgrading app appearance with features such as a navbar with functional links.  | https://github.com/Jcalvert22/redesigned-memory/issues/3 | We wanted to make it look modern without overwhelming |
| Search funcitonality | Implemented a search bar, featured as a navbar link, to filter/select muscle groups. | https://github.com/Jcalvert22/redesigned-memory/issues/6 | We wanted to add this funcitonality to make it easier to see what exercises are in the app or what needs to be added |
| User feedback System | A rating feature that includes a uers's name, a rating out of 5 stars, and a description. Existing ratings can be sorted and filtered by age and number of stars. | https://github.com/Jcalvert22/redesigned-memory/issues/7 | This helps people see what people think about the app |
| API Integration | We pulled an API for the exercises from a different website so we can add many different exercises without adding them manually | https://github.com/Jcalvert22/redesigned-memory/issues/4 | This implemented all of the exercises into an organized list |
| Debug Case Study | Debugging code we implemented in our yaml file. Performs directory inspections, file existence & integrity checks, and failure handling. | https://github.com/Jcalvert22/redesigned-memory/issues/8 | The problem was ownership issues in the vm itself |
| Monitoring and Logging | Implemented with NetStat | https://github.com/Jcalvert22/redesigned-memory/issues/9 | This allows to see activity on the vm and how heavy it is running |
| Automation Ci/Cd | Implemented so we did not have to manually pull everything on the repo | https://github.com/Jcalvert22/redesigned-memory/issues/10 | After we fixed the ownership issues this made it easiest to run |
| Deployment Guide | These are the exact steps we used to start up our VM | https://github.com/Jcalvert22/redesigned-memory/issues/11 | The deployment guide will help if the vm becomes corrupted and we need to restart from scratch |

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
