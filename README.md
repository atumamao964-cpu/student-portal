# Student Portal (React + JSON)

A simple Student Portal web app built with **React**, **Vite**, and **JSON** data files.

## Features
- Login system (demo accounts)
- Dashboard with summary stats
- View enrolled courses
- View grades
- View attendance
- Announcements

## How to run (on any PC)

### 1. Requirements
- Node.js 18+ installed (https://nodejs.org)

### 2. Install & Start
```bash
cd student-portal
npm install
npm run dev
```

Then open the URL shown (usually http://localhost:5173)

### 3. Demo Login Accounts
| Username     | Password    | Note              |
|--------------|-------------|-------------------|
| **angelyne** | student123  | **PC1 – You**     |
| john.doe     | student123  |                   |
| jane.smith   | student123  |                   |
| mike.wilson  | student123  |                   |

## Using 2 PCs
1. **PC 1 – ANGELYNE (Developer / Creator)**: Edit the code or JSON files, then copy the whole `student-portal` folder to a USB / shared drive / cloud.
2. **PC 2 (Runner / Upload)**: Paste the folder, run `npm install` + `npm run dev` (or `npm run build` then serve the `dist` folder).

## Editing Data
All student data is in simple JSON files inside `src/data/`:
- `students.json` → login accounts
- `courses.json` → enrolled subjects
- `grades.json` → marks
- `attendance.json` → attendance
- `announcements.json` → notices

Just edit these files and refresh the browser.

## Build for production
```bash
npm run build
```
The finished files will be in the `dist` folder. You can upload that folder to any static hosting (Netlify, Vercel, GitHub Pages, or a simple web server).
