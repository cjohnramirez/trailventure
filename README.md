# TrailVenture
**TrailVenture** is a travel package website that allows users to search, filter, and book travel packages. It integrates with Stripe for payment processing and provides a seamless, user-friendly experience. The platform features beautiful UI components, login/signup functionality, and fast image loading with Cloudinary.

## Features

- **Search and Filter**: Users can search for travel packages and filter them based on various criteria like destination, price range, duration, and activities.
- **Booking**: Secure booking system integrated with the Stripe API for seamless payment processing.
- **User Authentication**: Login and signup features for registered users with email verification.
- **User Dashboard**: Personalized dashboard for users to manage bookings, favorites, and account details.
- **Fast Image Loading**: Uses Cloudinary API for optimized image delivery and manipulation.
- **Beautiful UI**: Designed with a modern, user-friendly interface using **Tailwind** and several UI libraries.
- **State Management**: Uses **Zustand** for global state management and **TanStack** for efficient data fetching.
- **Responsive Design**: Fully responsive layout that works seamlessly across desktop, tablet, and mobile devices.
- **Reviews & Ratings**: Users can leave reviews and ratings for packages they've experienced.
- **Wishlist**: Save favorite packages for future reference.
- **Admin Panel**: Comprehensive admin interface for managing packages, users, and bookings.

## Technologies

### Frontend:
- **React** - JavaScript library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework for fast UI development
- **Vite** - Next-generation frontend tooling for fast development and build
- **TypeScript** - A statically typed superset of JavaScript for better developer experience
- **React Router** - For handling client-side routing

### Backend:
- **Django** - Python web framework for rapid development and clean design
- **Django REST Framework** - For building RESTful APIs
- **Stripe API** - Payment gateway for handling bookings and transactions
- **PostgreSQL** - Relational database powered by **Neon** for scalable data storage
- **JWT Authentication** - For secure user authentication

### Plugins and Libraries:
- **Cloudinary API** - For optimized image loading and delivery
- **Zustand** - Lightweight state management for global state handling
- **TanStack Query** - For handling data fetching, caching, and state management
- **Aceternity UI** - Pre-built UI components for faster development
- **ShadCn** - UI component library for consistent and customizable components
- **React Hook Form** - For form validation and handling
- **Zod** - TypeScript-first schema validation
- **Framer Motion** - For smooth animations and transitions

## Demo

[Live Demo]([https://trailventure.example.com](https://trailventure-main.vercel.app/)
![TrailVenture Image](https://github.com/user-attachments/assets/fe9869d4-ae2a-4a47-9cbe-d862474c4c87)

## Setup

### Prerequisites
- **Node.js** (v16 or above)
- **Python** (v3.8 or above)
- **Django** (v3.2 or above)
- **PostgreSQL** Database
- **Stripe API Keys** (for payment processing)
- **Cloudinary Account** (for image management)

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/TrailVenture.git
   ```

2. Navigate to the frontend directory:
   ```bash
   cd TrailVenture/frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file with necessary environment variables:
   ```
   VITE_API_URL=http://localhost:8000/api
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd TrailVenture/backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file with necessary environment variables:
   ```
   DEBUG=True
   SECRET_KEY=your_django_secret_key
   DATABASE_URL=your_postgresql_connection_string
   STRIPE_SECRET_KEY=your_stripe_secret_key
   CLOUDINARY_URL=your_cloudinary_url
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Create a superuser for admin access:
   ```bash
   python manage.py createsuperuser
   ```

7. Start the backend server:
   ```bash
   python manage.py runserver
   ```
   
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Vercel](https://vercel.com) for frontend hosting
- [Neon](https://neon.tech) for PostgreSQL database hosting
- [Stripe](https://stripe.com) for payment integration
- [Cloudinary](https://cloudinary.com) for optimized image delivery
- [Tailwind CSS](https://tailwindcss.com), [Aceternity UI](https://aceternity.com), [ShadCn](https://ui.shadcn.com), [Zustand](https://github.com/pmndrs/zustand), and [TanStack](https://tanstack.com) for providing essential tools and components

## Contact

Project Link: [https://github.com/yourusername/TrailVenture](https://github.com/yourusername/TrailVenture)

For any inquiries, please reach out to: contact@trailventure.example.com

---

Made with ❤️ by [Your Name]
