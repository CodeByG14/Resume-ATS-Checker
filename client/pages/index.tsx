import React, { useState } from "react";
import Head from "next/head";
import FileUpload from "./_file-upload";
import Footer from "./_footer";


function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070F2B] text-white">
      <Head>
        <title>Resume Radar</title>
      </Head>
      <header className="p-4 bg-[#070F2B]">
        <div
          className="container mx-auto grid grid-cols-3 items-center"
          style={{ marginTop: "20px" }}
        >
          <a href="/" className="text-2xl font-semibold justify-self-start">
            Resume Radar
          </a>

          <nav className="hidden md:flex justify-center space-x-20 mt-4">
            <a
              rel="noopener noreferrer"
              href="/"
              className="flex items-center px-4 -mb-1 border-b-2 border-transparent hover:border-[#9290C3]"
              style={{ fontWeight: 600, fontSize: "25px" }}
            >
              Home
            </a>
            <a
              rel="noopener noreferrer"
              href="/about"
              className="flex items-center px-4 -mb-1 border-b-2 border-transparent hover:border-[#9290C3] text-lg"
              style={{ fontWeight: 600, fontSize: "25px" }}
            >
              About
            </a>
          </nav>

          <button
            className="md:hidden justify-self-end"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {menuOpen && (
          <nav className="md:hidden flex flex-col space-y-2 mt-4">
            <a
              rel="noopener noreferrer"
              href="http://localhost:3000"
              className="flex items-center px-4 -mb-1 border-b-2 border-transparent hover:border-[#9290C3] text-xl"
            >
              Home
            </a>
            <a
              rel="noopener noreferrer"
              href="#"
              className="flex items-center px-4 -mb-1 border-b-2 border-transparent hover:border-[#9290C3] text-xl"
            >
              About
            </a>
          </nav>
        )}
      </header>

      <main className="container mx-auto mt-10 p-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <FileUpload />
          </div>
          {/* Updated Image Section with Translucent Background */}
          <div
            className="w-full md:w-1/2 flex justify-center items-center"
            style={{ marginBottom: "150px" }}
          >
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-4">
              <img
                src="/homeimage.png"
                alt="Resume Checker"
                className="w-auto h-auto object-contain rounded-lg"
                style={{ width: "120%", height: "120%" }}
              />
            </div>
          </div>
        </div>
      </main>
      <footer className="mt-5">
          <Footer />
      </footer>
    </div>
  );
}

export default Home;
