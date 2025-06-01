import { File } from "@/components/file-explorer";

export const sampleSteps = [
  {
    id: "step-1",
    title: "Setup project",
    description:
      "Initialize a new Next.js project with the required dependencies",
    command: "npx create-next-app@latest my-website --typescript --tailwind",
    status: "completed",
    details: [
      "This creates a new Next.js project with TypeScript and Tailwind CSS",
      "The project structure includes app directory for the App Router",
      "All necessary dependencies are automatically installed",
    ],
  },
  {
    id: "step-2",
    title: "Create page components",
    description: "Implement the main pages of your website",
    status: "running",
    details: [
      "Create Home page with hero section and features",
      "Implement About page with team information",
      "Add Contact page with form and map",
      "Set up dynamic routing for blog posts",
    ],
  },
  {
    id: "step-3",
    title: "Add styling",
    description: "Style your components using Tailwind CSS",
    status: "pending",
    details: [
      "Customize the Tailwind configuration",
      "Create responsive designs for all screen sizes",
      "Implement dark mode toggle",
      "Add animations and transitions",
    ],
  },
  {
    id: "step-4",
    title: "Deploy your website",
    description: "Deploy your website to Vercel or Netlify",
    command: "npm run build && npm run export",
    status: "pending",
    details: [
      "Build your project for production",
      "Create a Vercel or Netlify account if you don't have one",
      "Connect your repository to the platform",
      "Configure build settings and deploy",
    ],
  },
];

export const sampleFiles: File[] = [
  {
    id: "file-1",
    name: "my-website",
    path: "my-website",
    type: "folder",
    children: [
      {
        id: "file-2",
        name: "app",
        path: "my-website/app",
        type: "folder",
        children: [
          {
            id: "file-3",
            name: "page.tsx",
            path: "my-website/app/page.tsx",
            type: "file",
            language: "tsx",
            content: `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome to my website
        </p>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <h1 className="text-4xl font-bold">My Awesome Website</h1>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
        <a
          href="#"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            About{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Learn more about our company and team.
          </p>
        </a>

        <a
          href="#"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Services{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Explore our range of professional services.
          </p>
        </a>

        <a
          href="#"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Contact{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Get in touch with our team.
          </p>
        </a>
      </div>
    </main>
  );
}`,
          },
          {
            id: "file-4",
            name: "about",
            path: "my-website/app/about",
            type: "folder",
            children: [
              {
                id: "file-5",
                name: "page.tsx",
                path: "my-website/app/about/page.tsx",
                type: "file",
                language: "tsx",
                content: `export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>
      <p className="text-lg mb-6">
        We are a passionate team of web developers and designers dedicated to creating
        beautiful, functional websites for our clients.
      </p>
      <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
      <p className="mb-6">
        Our mission is to help businesses succeed online with custom websites
        that engage visitors and drive conversions.
      </p>
      <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold text-xl mb-2">John Doe</h3>
          <p className="text-gray-600">CEO & Founder</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold text-xl mb-2">Jane Smith</h3>
          <p className="text-gray-600">Lead Designer</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold text-xl mb-2">Alex Johnson</h3>
          <p className="text-gray-600">Senior Developer</p>
        </div>
      </div>
    </div>
  );
}`,
              },
            ],
          },
          {
            id: "file-6",
            name: "contact",
            path: "my-website/app/contact",
            type: "folder",
            children: [
              {
                id: "file-7",
                name: "page.tsx",
                path: "my-website/app/contact/page.tsx",
                type: "file",
                language: "tsx",
                content: `export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="mb-4">
            Have a question or want to work with us? Fill out the form and we'll get back to you as soon as possible.
          </p>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Our Address</h2>
            <p>123 Main Street</p>
            <p>San Francisco, CA 94105</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Email</h2>
            <p>info@example.com</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Phone</h2>
            <p>(123) 456-7890</p>
          </div>
        </div>
        <div>
          <form>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block mb-2 font-medium">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}`,
              },
            ],
          },
        ],
      },
      {
        id: "file-8",
        name: "components",
        path: "my-website/components",
        type: "folder",
        children: [
          {
            id: "file-9",
            name: "header.tsx",
            path: "my-website/components/header.tsx",
            type: "file",
            language: "tsx",
            content: `import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-xl font-bold">MyWebsite</span>
              </Link>
            </div>
            <nav className="ml-6 flex space-x-8">
              <Link href="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Home
              </Link>
              <Link href="/about" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                About
              </Link>
              <Link href="/contact" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              Login
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}`,
          },
          {
            id: "file-10",
            name: "footer.tsx",
            path: "my-website/components/footer.tsx",
            type: "file",
            language: "tsx",
            content: `export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">MyWebsite</h2>
            <p className="text-gray-300">
              Creating beautiful websites since 2023
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white">About</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                Twitter
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                Facebook
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; 2023 MyWebsite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}`,
          },
        ],
      },
      {
        id: "file-11",
        name: "package.json",
        path: "my-website/package.json",
        type: "file",
        language: "json",
        content: `{
  "name": "my-website",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "13.5.1",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "typescript": "5.2.2",
    "tailwindcss": "3.3.3",
    "autoprefixer": "10.4.15",
    "postcss": "8.4.30"
  },
  "devDependencies": {
    "@types/node": "20.6.2",
    "@types/react": "18.2.22",
    "@types/react-dom": "18.2.7",
    "eslint": "8.49.0",
    "eslint-config-next": "13.5.1"
  }
}`,
      },
      {
        id: "file-12",
        name: "tailwind.config.js",
        path: "my-website/tailwind.config.js",
        type: "file",
        language: "js",
        content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}`,
      },
    ],
  },
];
