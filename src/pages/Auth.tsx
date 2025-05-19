
import React, { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import { useSearchParams } from "react-router-dom";
import Logo from "@/components/branding/Logo";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialForm = searchParams.get("signup") === "true" ? "signup" : "login";
  const [activeForm, setActiveForm] = useState<"login" | "signup" | "admin">(
    (initialForm as "login" | "signup") || "login"
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Logo and branding section */}
      <div className="md:flex-1 bg-gradient-to-br from-gold to-brown p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <Logo variant="full" size="lg" className="mb-8" />
          <h1 className="text-3xl md:text-4xl font-serif text-white font-bold mb-4">
            Welcome to Saem's Tunes
          </h1>
          <p className="text-white/80 text-lg md:text-xl mb-6 whitespace-nowrap">Making music, representing Christ</p>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-2">Why Join Us?</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="bg-white/20 rounded-full p-1 mr-3 mt-1">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </span>
                <span className="text-white/90">Expert music tutors and premium resources</span>
              </li>
              <li className="flex items-start">
                <span className="bg-white/20 rounded-full p-1 mr-3 mt-1">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </span>
                <span className="text-white/90">Personalized learning paths for your growth</span>
              </li>
              <li className="flex items-start">
                <span className="bg-white/20 rounded-full p-1 mr-3 mt-1">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </span>
                <span className="text-white/90">Supportive community of musicians and learners</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Auth forms section */}
      <div className="md:flex-1 p-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <div className="flex border-b space-x-4">
              <button
                onClick={() => setActiveForm("login")}
                className={`pb-2 px-2 ${
                  activeForm === "login"
                    ? "text-gold border-b-2 border-gold font-medium"
                    : "text-muted-foreground"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveForm("signup")}
                className={`pb-2 px-2 ${
                  activeForm === "signup"
                    ? "text-gold border-b-2 border-gold font-medium"
                    : "text-muted-foreground"
                }`}
              >
                Sign Up
              </button>
              <button
                onClick={() => setActiveForm("admin")}
                className={`pb-2 px-2 ml-auto text-sm ${
                  activeForm === "admin"
                    ? "text-gold border-b-2 border-gold font-medium"
                    : "text-muted-foreground"
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {activeForm === "login" && <LoginForm />}
          {activeForm === "signup" && <SignupForm onSignupComplete={() => setActiveForm("login")} />}
          {activeForm === "admin" && <AdminLoginForm />}
        </div>
      </div>
    </div>
  );
};

export default Auth;
