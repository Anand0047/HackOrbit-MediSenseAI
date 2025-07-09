import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import Find from "./find.jsx";
import Chat from "./chat.jsx";
import Blog from "./BlogPage.jsx";
import { Link } from "react-router-dom";
import { Pill, HeartPulse, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

const Landing = () => {
  const [activeComponent, setActiveComponent] = useState("chat");
  const chatRef = useRef(null);

  const scrollToChat = () => {
    chatRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  const features = [
    {
      title: "Symptom Analysis",
      description: "Get instant medical insights by describing your symptoms",
      icon: <HeartPulse className="h-6 w-6 text-blue-600" />,
      action: scrollToChat
    },
    {
      title: "Prescription Scanner",
      description: "Upload prescription images to find medicines instantly",
      icon: <Pill className="h-6 w-6 text-blue-600" />,
      link: "/find"
    },
    {
      title: "Health Resources",
      description: "Evidence-based medical information at your fingertips",
      icon: <BookOpen className="h-6 w-6 text-blue-600" />,
      link: "/blog"
    }
  ];

  return (
    
    
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
  className="min-h-screen relative z-10 relative z-10 bg-white bg-opacity-85 " // Added relative and z-10
  // style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }} // Semi-transparent white background
>
      {/* Hero Section */}
      <div className="relative bg-breathing overflow-hidden  relative z-10 bg-white bg-opacity-85">
        <div className="max-w-7xl bg-breathing mx-auto px-6 py-24 sm:py-32 lg:px-8 relative z-10 bg-white bg-opacity-85" >
          <div className="text-center relative z-10 bg-white bg-opacity-85">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
            >
              Welcome to <span className="text-blue-600">MediSense AI</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto"
            >
              Your intelligent health companion transforming symptoms into actionable insights with AI-powered analysis
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                onClick={scrollToChat}
                className="px-8 py-6 text-lg rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 shadow-lg"
              >
                Analyze Symptoms Now
              </Button>
              <Button
                variant="outline"
                asChild
                className="px-8 py-6 text-lg rounded-xl border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <Link to="/find">
                  Find Medicines
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Animated gradient background */}
        <motion.div 
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"
        />
      </div>

          
           {/* Chat component with fade-in */}
<div ref={chatRef} className="bg-breathing">
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className=""
  >
    <Chat />
  </motion.div>
</div>





      {/* Features Section */}
      <div className=" py-16 sm:py-24  bg-breathing">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl lg:text-center"
          >
            <h2 className="text-base font-semibold leading-7 text-blue-600">
              Your Health, Simplified
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Comprehensive healthcare solutions in one place
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              From symptom analysis to medicine discovery, we provide intelligent tools to help you make informed health decisions
            </p>
          </motion.div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none ">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, staggerChildren: 0.2 }}
              viewport={{ once: true }}
              className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col"
                >
                  <div className="relative flex flex-col items-start p-8  rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold leading-7 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-base leading-7 text-gray-600">
                      {feature.description}
                    </p>
                    {feature.link ? (
                      <Link
                        to={feature.link}
                        className="mt-6 inline-flex items-center gap-x-2 text-sm font-semibold leading-6 text-blue-600 group"
                      >
                        Learn more
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    ) : (
                      <button
                        onClick={feature.action}
                        className="mt-6 inline-flex items-center gap-x-2 text-sm font-semibold leading-6 text-blue-600 group"
                      >
                        Try it now
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

     
    </motion.div>
  );
};

export default Landing;