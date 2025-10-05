import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Editor from "@monaco-editor/react";
import Select from "react-select";
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { PuffLoader } from "react-spinners";


const App = () => {
  const options = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "c", label: "C" },
    { value: "csharp", label: "C#" },
    { value: "cpp", label: "C++" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "dart", label: "Dart" },
    { value: "scala", label: "Scala" },
    { value: "elixir", label: "Elixir" },
    { value: "haskell", label: "Haskell" },
    { value: "r", label: "R" },
    { value: "perl", label: "Perl" },
    { value: "lua", label: "Lua" },
    { value: "clojure", label: "Clojure" },
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);

  const [code, setCode] = useState("")

  const ai = new GoogleGenAI({
    apiKey: "AIzaSyAq-ePtpFAekKVxJaH_Cz0Xt03sYEmAl1M",
  });

  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState("");

  async function reviewCode() {
    setResponse("")
    setLoading(true);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert-level software engineer, highly skilled in writing efficient, clean, and maintainable code.  
I will provide you with a piece of code written in {language}.  

Your task is to thoroughly review this code and deliver the following:  

【1】 Quality Rating — Better, Good, Normal, or Bad.  
【2】 Improvement Suggestions — Clear recommendations, best practices, and advanced alternatives to make the code more efficient, readable, and robust.  
【3】 Code Explanation — A step-by-step breakdown of what the code does.  
【4】 Bug & Logic Check — Any potential bugs, logical errors, or edge cases that might cause issues.  
【5】 Error Identification — Highlight any syntax or runtime errors (if present).  
【6】 Fixes & Recommendations — Practical solutions for each identified issue, with examples when possible.  
 

Approach this as if you are a senior engineer reviewing a pull request in a real-world project.

Code: ${code}
`,
    });
    
    setResponse(response.text);
    setLoading(false);
  }

  async function fixCode() {
    setResponse("")
  if (code === "") {
    alert("No code, no magic!! Paste something for me to work on 😅.");
    return;
  }

  setLoading(true);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
You are an expert software engineer. 
I will give you a piece of code written in ${selectedOption.label}. 

Your task: fix any errors, improve readability, and optimize performance — while keeping the code’s original logic intact. 
Return only the **fixed code** in Markdown code block format.

Code to fix:
${code}
    `,
  });

  setResponse(response.text);
  setLoading(false);
}


  function formatResponse(text) {
  // Make numbered sections bold
  return text.replace(/(【\d+】\s*[^【\n]+)/g, "**$1**");
}


  return (
    <>
      <Navbar />
      <div
        className="main flex justify-between"
        style={{ height: "calc(100vh - 90px)" }}
      >
        <div className="left h-[98%] w-[50%] flex flex-col">
          <div className="tabs w-full flex items-center gap-3 bg-zinc-900 rounded-t-md px-3 h-[50px]">
            <Select
              value={selectedOption}
              onChange={(e) => {
                setSelectedOption(e);
              }}
              options={options}
              className="w-[370px] text-black"
            />
            <button
  onClick={fixCode}
  className="btnNormal bg-zinc-800 text-white px-4 py-2 rounded transition-all hover:bg-zinc-700"
>
  Fix Code
</button>

            <button onClick={() => {
              if(code===""){
                alert("Drop your code, I’ll handle the rest 😌.")
              }
              else{
                reviewCode()
              }
            }}className="btnNormal bg-zinc-800 text-white px-4 py-2 rounded transition-all hover:bg-zinc-700">
              Review
            </button>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              theme="vs-dark"
              language="javascript"
              value={code} onChange={(e)=>{setCode(e)}}
            />
          </div>
        </div>
        <div className="right overflow-scroll !p-[10px] bg-zinc-900 w-[50%] h-[100%]">
          <div className="topTab border-b-[1px] border-t-[1px] border-[#27272a] flex items-center justify-between h-[60px]">
            <p className="font-[700] text-[17px]">Response</p>
          </div>
          {loading && <PuffLoader color='#8b5cf6'/>}
          <Markdown>{formatResponse(response)}</Markdown>

        </div>
      </div>
    </>
  );
};

export default App;
