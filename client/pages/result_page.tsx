import React from "react";
import { useRouter } from "next/router";
import GaugeChart from "react-gauge-chart";
import { IoCloudUploadOutline } from "react-icons/io5";
import Footer from "./_footer";

interface AnalysisResult {
  keyword_matching: { feedback: string };
  format_analysis: { feedback: string };
  content_evaluation: { feedback: string };
  length_check: { feedback: string };
  score: { feedback: number };
  overall_analysis: { feedback: string };
}

const capitalize = <T extends string>(s: T) =>
  (s[0].toUpperCase() + s.slice(1)) as Capitalize<typeof s>;

const ResultPage: React.FC = () => {
  const router = useRouter();
  const { result, filePreview } = router.query;

  let analysisResult: AnalysisResult | null = null;

  if (typeof result === "string") {
    try {
      // Decode the Base64-encoded result and parse it
      const decodedResult = JSON.parse(atob(result));
      analysisResult = decodedResult as AnalysisResult;
    } catch (error) {
      console.error("Error parsing result:", error);
    }
  }

  let decodedFilePreview: string | null = null;

  if (typeof filePreview === "string") {
    try {
      // Decode the Base64-encoded file preview URL
      decodedFilePreview = atob(filePreview);
    } catch (error) {
      console.error("Error decoding file preview:", error);
    }
  }

  if (!analysisResult) {
    return <div>No analysis result available.</div>;
  }

  return (
    <div className="min-h-screen bg-[#070F2B] text-white p-8">
      <header className="p-4 bg-[#070F2B] border-b border-[white]">
        <div className="container mx-auto flex justify-between items-center" style={{ marginTop: "20px" }}>
          <a
            href="#"
            className="text-2xl font-semibold"
            style={{
              fontFamily: '"Cerebri Sans", sans-serif',
              fontStyle: "normal",
              fontWeight: 600,
              fontSize: "37.3333px",
              lineHeight: "56px",
              color: "#343434",
            }}
          >
            Resume Radar
          </a>

          <button
            onClick={() => router.push("/")}
            className="flex items-center px-10 py-3 mr-20 bg-[#3949AB] text-white rounded-lg hover:bg-[#1A237E] transition-all focus:outline-none focus:ring-2 focus:ring-[#9290C3] focus:ring-opacity-50"
          >
            New Upload <span className="ml-2"><IoCloudUploadOutline /></span>
          </button>
        </div>
      </header>
      <h1 className="text-3xl font-bold mb-9 mt-10">Resume Analysis Result</h1>

      <div className="flex">
        {/* Left column: Score and Gauge Chart */}
        <div className="w-1/4 pr-4" style={{ marginTop: "100px" }}>
          <div className="bg-[#3949AB] bg-opacity-20 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Overall Score</h2>
            <GaugeChart
              id="gauge-chart3"
              nrOfLevels={30}
              colors={["#FF5F6D", "#FFC371"]}
              arcWidth={0.3}
              percent={analysisResult.score.feedback / 100}
              textColor="#ffffff"
              needleColor="#ffffff"
              needleBaseColor="#ffffff"
              animate={false}
              cornerRadius={0}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>

        {/* Center column: Analysis Table */}
        <div className="w-1/2 px-4">
          <table className="w-full bg-[#9290C3] bg-opacity-10 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#3949AB] bg-opacity-30">
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(analysisResult).map(
                ([key, value]) =>
                  key !== "score" && (
                    <tr key={key} className="border-t border-[#9290C3] border-opacity-20">
                      <td className="p-2 font-semibold">
                        {capitalize(key.replace("_", " "))}
                      </td>
                      <td className="p-2">{value.feedback}</td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>

        {/* Right column: Resume Preview */}
        <div className="w-1/4 pl-4">
          <div className="bg-[#9290C3] bg-opacity-10 p-4 rounded-lg h-full">
            {decodedFilePreview && (
              <object
                data={decodedFilePreview}
                type="application/pdf"
                className="w-full h-full rounded-lg"
              >
                <p>Unable to display PDF file. <a href={decodedFilePreview} target="_blank" rel="noopener noreferrer">Download</a> instead.</p>
              </object>
            )}
            {!decodedFilePreview && <p>No preview available.</p>}
          </div>
        </div>
      </div>
      <footer className="mt-10">
        <Footer />
      </footer>
    </div>
  );
};

export default ResultPage;
