import React, { useState } from 'react';
import { useRouter } from 'next/router';

function FileUpload() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to manage loading status

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (selectedFile && jobTitle && experienceLevel) {
      setIsLoading(true); // Show loading overlay
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("jobTitle", jobTitle);
      formData.append("experienceLevel", experienceLevel);
  
      try {
        const response = await fetch("http://127.0.0.1:8080/analyze", {
          method: "POST",
          body: formData,
        });
        const responseData = await response.json();
        console.log("Full server response:", responseData);
  
        if (responseData && responseData.data) {
          // Parse the analysis result
          const analysisResult = JSON.parse(responseData.data);
          
          // Encode the analysis result and file preview URL
          const encodedResult = btoa(JSON.stringify(analysisResult));
          const filePreview = URL.createObjectURL(selectedFile);
          const encodedFilePreview = btoa(filePreview);
  
          // Navigate to the result page with encoded data
          router.push({
            pathname: '/result_page',
            query: {
              result: encodedResult,
              filePreview: encodedFilePreview
            },
          });
        } else {
          console.error("Invalid response from server. Expected 'data' property not found.");
          console.error("Received data:", responseData);
        }
      } catch (error) {
        console.error("Error during file upload or analysis:", error);
      } finally {
        setIsLoading(false); // Hide loading overlay after processing
      }
    }
  };

  return (
    <div>
      <div className="max-w-2xl ml-0 bg-gradient-to-br from-[#070F2B] to-[#1A237E] p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">AI-Powered Resume Analysis</h2>
        <p className="mb-8 text-center text-gray-200">
          Upload your resume and let our AI provide personalized insights for your job search.
        </p>
        <div className="space-y-6">
          {/* File Upload */}
          <div className="bg-[#9290C3] bg-opacity-10 p-6 rounded-lg transition-all hover:bg-opacity-20">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#9290C3] rounded-lg cursor-pointer hover:border-[#3949AB] transition-all"
            >
              <div className="flex flex-col items-center justify-center">
                <svg
                  className="w-10 h-10 mb-3 text-[#9290C3]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-[#9290C3]">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-[#9290C3]">Supported formats: PDF, DOCX, JPG, PNG</p>
              </div>
              <input
                type="file"
                name="file"
                id="file-upload"
                className="hidden"
                accept="image/*, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
              />
            </label>
            {selectedFile && (
              <p className="mt-2 text-sm text-[#9290C3] text-center">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          {/* Job Title/Keywords Input */}
          <div className="bg-[#9290C3] bg-opacity-10 p-6 rounded-lg transition-all hover:bg-opacity-20">
            <label className="block mb-2 text-sm font-medium text-[#9290C3]" htmlFor="job-title">
              Job Title/Keywords
            </label>
            <input
              type="text"
              id="job-title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full p-3 bg-[#070F2B] border border-[#9290C3] rounded-lg text-white placeholder-[#9290C3] focus:ring-2 focus:ring-[#3949AB] focus:border-transparent transition-all"
              placeholder="e.g., Software Engineer, Data Scientist"
            />
          </div>

          {/* Experience Level Dropdown */}
          <div className="bg-[#9290C3] bg-opacity-10 p-6 rounded-lg transition-all hover:bg-opacity-20">
            <label className="block mb-2 text-sm font-medium text-[#9290C3]" htmlFor="experience-level">
              What best describes you?
            </label>
            <select
              id="experience-level"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full p-3 bg-[#070F2B] border border-[#9290C3] rounded-lg text-white focus:ring-2 focus:ring-[#3949AB] focus:border-transparent transition-all"
            >
              <option value="" className="bg-[#070F2B] text-[#9290C3]">
                Select your experience level
              </option>
              <option value="entry-level" className="bg-[#070F2B] text-white">Entry-level</option>
              <option value="mid-level" className="bg-[#070F2B] text-white">Mid-level</option>
              <option value="senior-level" className="bg-[#070F2B] text-white">Senior-level</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full px-6 py-3 bg-[#3949AB] text-white rounded-lg hover:bg-[#1A237E] transition-all focus:outline-none focus:ring-2 focus:ring-[#9290C3] focus:ring-opacity-50"
            disabled={!selectedFile || !jobTitle || !experienceLevel}
          >
            Analyze Resume
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <p className="text-xl font-semibold text-gray-800">Analyzing Resume...</p>
            <div className="mt-4 w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
