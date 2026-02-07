🧺 Fresh Laundry - Smart SaaS Solution for Modern Laundry Services
Fresh Laundry is a premium, full-stack SaaS platform designed to revolutionize how laundry services operate. Built with the MERN/Vite stack and powered by Supabase, this project offers a seamless experience for both customers and administrators.

🚀 Key Features
💳 Subscription-Based SaaS Model: Customers can purchase monthly plans tailored to their needs.

🧺 Service Allocation: Laundry services and offers are automatically assigned based on the active subscription plan.

🔐 Secure Authentication: Integrated Login and Signup system using Supabase Auth for data security.

📊 User Dashboard: A dedicated panel for users to track their orders, active plans, and usage history.

🛠️ Admin Control Panel: A comprehensive dashboard for managers to handle properties, requests, and user messages.

📱 Modern UI/UX: Built with React, Tailwind CSS, and Shadcn UI for a fast, responsive, and "Premium" feel.

🛠️ Tech Stack
Frontend: React.js (Vite), TypeScript, Tailwind CSS, Shadcn UI.

Backend/Database: Supabase (PostgreSQL) with Row Level Security (RLS).

State Management: TanStack Query (React Query).

Deployment: Optimized for Vercel with custom routing.

🏗️ Project Structure
/src/components: Reusable UI elements (Buttons, Forms, Navbar).

/src/pages: Main application views (Home, Admin, Dashboard).

/src/integrations: Supabase client configuration and API logic.

/public: Static assets including the official Codesphinx branding.

🔧 Installation & Setup
Clone the repository:

Bash
git clone https://github.com/your-username/fresh-laundry.git
Install dependencies:

Bash
npm install
Set up Environment Variables: Create a .env file and add your Supabase credentials:

Code snippet
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
Run the development server:

Bash
npm run dev
💼 Business Logic
The platform operates on a tiered subscription logic. Based on the selected monthly plan, the system unlocks specific laundry credits (e.g., Wash & Fold, Dry Cleaning, or Premium Handling), allowing for a truly automated SaaS experience.

Developed with ❤️ by Codesphinx.