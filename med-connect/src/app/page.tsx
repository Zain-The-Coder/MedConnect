"use client";

import Link from "next/link";
import { Button } from "@/components";
import { Card } from "@/components";
import { Header } from "@/components";
import { Footer } from "@/components";

const teamMembers = [
  {
    name: "Hussain",
    role: "Lead Developer",
    image: "H",
  },
  {
    name: "Zain",
    role: "UI/UX Designer",
    image: "Z",
  },
  {
    name: "Asher",
    role: "Backend Engineer",
    image: "A",
  },
  {
    name: "Bilal",
    role: "Project Manager",
    image: "B",
  },
];

const features = [
  {
    title: "Easy Appointments",
    description:
      "Book appointments with doctors in just a few clicks. No more long waiting times.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Secure Health Records",
    description:
      "Your medical records are encrypted and securely stored. Access them anytime.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    title: "24/7 Support",
    description:
      "Get round-the-clock support from our dedicated team for any queries.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white overflow-x-hidden">
      <Header transparent />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float delay-500"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float delay-1000"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="animate-fade-in-down inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6 hover-lift">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                Healthcare Reimagined
              </div>

              {/* Main Heading */}
              <h1 className="animate-fade-in-up text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight delay-100">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent animate-gradient-shift">
                  MedConnect
                </span>
              </h1>

              {/* Tagline */}
              <p className="animate-fade-in-up text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed delay-200">
                Your trusted platform for seamless healthcare management.
                Connect with doctors, manage appointments, and access your
                medical records all in one place.
              </p>

              {/* CTA Buttons */}
              <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4 delay-300">
                <Link href="/login">
                  <Button size="lg" className="min-w-[160px] animate-pulse-glow">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" size="lg" className="min-w-[160px] hover-lift">
                    Sign Up
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="animate-fade-in-up mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 delay-400">
                {[
                  { value: "10K+", label: "Patients" },
                  { value: "500+", label: "Doctors" },
                  { value: "50+", label: "Specialties" },
                  { value: "99%", label: "Satisfaction" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="group text-center p-4 rounded-xl hover:bg-white/50 transition-all duration-300 hover-lift"
                  >
                    <div className="text-3xl md:text-4xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">
                      {stat.value}
                    </div>
                    <div className="text-gray-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Icons */}
          <div className="absolute top-20 left-10 text-blue-300 animate-float opacity-50">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div className="absolute top-40 right-20 text-purple-300 animate-float delay-300 opacity-50">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="absolute bottom-20 left-1/4 text-pink-300 animate-float delay-500 opacity-50">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="animate-fade-in-up text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                About MedConnect
              </h2>
              <p className="animate-fade-in-up text-gray-600 max-w-2xl mx-auto text-lg delay-100">
                We are revolutionizing healthcare by connecting patients with
                qualified medical professionals through an intuitive, secure
                platform.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  hover
                  className="text-center group animate-fade-in-up hover-lift"
                  style={{ animationDelay: `${index * 100 + 200}ms` }}
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="animate-fade-in-up text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="animate-fade-in-up text-gray-600 max-w-2xl mx-auto text-lg delay-100">
                Get started with MedConnect in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection Lines */}
              <div className="hidden md:block absolute top-1/4 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200"></div>

              {[
                {
                  step: "1",
                  title: "Sign Up",
                  desc: "Create your free account in just a few minutes",
                },
                {
                  step: "2",
                  title: "Choose a Doctor",
                  desc: "Browse through our network of qualified healthcare providers",
                },
                {
                  step: "3",
                  title: "Book Appointment",
                  desc: "Schedule your visit at a time that works for you",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="animate-fade-in-up text-center relative"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg hover:scale-110 transition-transform duration-300 animate-pulse-glow">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="animate-fade-in-up text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="animate-fade-in-up text-gray-600 max-w-2xl mx-auto text-lg delay-100">
                The dedicated professionals behind MedConnect working to
                transform healthcare.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card
                  key={index}
                  hover
                  className="text-center group animate-fade-in-up hover-lift"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative mb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      {member.image}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white animate-bounce-subtle"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-gray-500">{member.role}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
              <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full animate-float delay-300"></div>
              <div className="absolute bottom-10 left-1/3 w-16 h-16 bg-white/10 rounded-full animate-float delay-500"></div>
              <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-white/10 rounded-full animate-float delay-700"></div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="animate-fade-in-up text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="animate-fade-in-up text-blue-100 text-lg mb-8 max-w-2xl mx-auto delay-100">
              Join thousands of patients who trust MedConnect for their
              healthcare needs.
            </p>
            <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4 delay-200">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-blue-500 text-white hover:bg-white-600 hover:scale-105 transition-all duration-300 border-0"
                >
                  Create Account
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}