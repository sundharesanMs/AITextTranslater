"use client"

import { useState } from 'react';
import axios from 'axios';  
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 
export default function Home() {

  const [mode, setMode] = useState("summarize");
  const [tone, setTone] = useState("simple");
  const [target, setTarget] = useState("tamil");

  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false); 
const [dropdownOpen, setDropdownOpen] = useState(false);

  const LANGUAGES = [
  "Tamil", "English", "Hindi", "Spanish", 
  "French", "German", "Chinese", "Japanese", 
  "Russian", "Arabic"
]; 

  const MODES = [
    {
      key: "summarize",
      label: "Summarize"
    },
    {
      key: "rewrite",
      label: "Rewrite"
    },
    {
      key: "translate",
      label: "Translate"
    }
  ];

  function loadSample() {
    setText("I built a small feature to speed up the app. It loads faster now, and users should notice the difference. There were a few changes in the API and UI.");
  }

  function clear() {
    setText("");
    setOutput("");
  }

  async function onCopy() {
  if (!output) return;

  await navigator.clipboard.writeText(output);

  toast.success("Copied successfully!", {
    position: "top-right",
    autoClose: 2000,
  });
}

  // async function transform() {
  //   try {
  //     setLoading(true);
  //     setOutput("");
  //     await new Promise((resolve) => setTimeout(resolve, 2000));
  //     if (mode === "summarize") {
  //       setOutput("This is a summary of the input text.");
  //     } else if (mode === "rewrite") {
  //       setOutput(`This is a ${tone} rewrite of the input text.`);
  //     }
  //     else {
  //       setOutput(`Tamil pesalam to ${target}.`);
  //     } 
  //     setLoading(false);
  //   } catch (error) {
  //     console.log("err", error);
  //   }
  // } 



 async function transform() {
  setLoading(true);
  setOutput("");

  try {
    const response = await axios.post("/api/transform", {
      input: text,
      mode,
      tone: mode === "rewrite" ? tone : undefined,
      target: mode === "translate" ? target : undefined
    });

    const apiResponse = await response.data;
    console.log("apiResponse", apiResponse);
    //return;
    if(apiResponse.status){
      setOutput(apiResponse.Result);
    }else{
      throw new Error("Request failed");
    }

   // if (!response.ok) 
  }
  catch (error) {
    console.log("error", error );
  }
  finally {
    setLoading(false);
  }

}

return ( 
  
  <main className="min-h-screen bg-zinc-950 text-zinc-50">
    <ToastContainer />
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          AI Text Transformer
        </h1>
        <p className="mt-2 text-zinc-300">
          Summarize, rewrite, and translate
        </p>
      </header>

      {/* Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        {/* Mode buttons + actions */}
        <div className="flex flex-wrap items-center gap-2">

          {
            MODES.map((eachMode) => (
              <button
                key={eachMode.key}
                value={eachMode.key}
                onClick={(e) => setMode(eachMode.key)}
                className={
                  [
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    mode === eachMode.key
                      ? "bg-zinc-100 text-zinc-900"
                      : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                  ].join(" ")}
              >
                {eachMode.label}
              </button>
            ))
          }

          <div className="ml-auto flex items-center gap-2">
            <button onClick={loadSample} className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800">
              Load sample
            </button>
            <button onClick={clear} className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800">
              Clear
            </button>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {/* Left: Input */}
          <div className="space-y-3">
            <label className="text-sm text-zinc-300">Input</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text here…"
              className="h-64 w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-100 outline-none focus:border-zinc-500"
            />

            {/* Tone dropdown (for Rewrite mode) */}
            {mode === "rewrite" && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-300">Tone</span>
                <select
                  onChange={(e) => setTone(e.target.value)}
                  value={tone}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100">
                  <option>Simple</option>
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Funny</option>
                </select>
              </div>
            )}

            {/* Target language (for Translate mode) */}
            {/* {mode === "translate" && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-300">Target</span>
                <select
                  onChange={(e) => setTarget(e.target.value)}
                  value={target}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100">
                  <option>Tamil</option>
                  <option>English</option> 
                  <option>Hindi</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Chinese</option> 
                  <option>Japanese</option> 
                  <option>Russian</option>
                  <option>Arabic</option> 

                </select>
              </div>
            )} */} 
            {mode === "translate" && (
  <div className="flex items-center gap-3">
    <span className="text-sm text-zinc-300">Target</span>

    {/* Custom Dropdown */}
    <div className="relative">
      
      {/* Trigger Button */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-800 transition"
      >
        {target}
        <svg
          className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown List — bottom-left-ல் திறக்கும் */}
      {dropdownOpen && (
        <>
          {/* Backdrop - outside click பண்ணா close ஆகும் */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setDropdownOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute left-0 bottom-full mt-1 z-20 w-40 rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl overflow-hidden">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setTarget(lang);
                  setDropdownOpen(false);
                }}
                className={`w-full px-4 py-2 text-top text-sm transition hover:bg-zinc-700
                  ${target === lang 
                    ? "bg-zinc-700 text-emerald-400 font-medium" 
                    : "text-zinc-200"
                  }`}
              >
                {target === lang && <span className="mr-2">✓</span>}
                {lang}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  </div>
)}

            {/* Transform button */}
            <button onClick={transform} className="w-full rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300">
              {loading ? "Thinking..." : "Transform"}
            </button>
          </div>

          {/* Right: Output */}
          <div className="space-y-3">
            <label className="text-sm text-zinc-300">Output</label>
            <div className="h-64 overflow-auto whitespace-pre-wrap rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-100">
              {output ? output : (
                <span className="text-zinc-500">
                  Your transformed text will appear here.
                </span>
              )}
            </div>
            <button onClick={onCopy} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800">
              Copy
            </button>
            <p className="text-xs text-zinc-500">
              Tip: Use “Load sample” for quick demos.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-xs text-zinc-500">
        Boilerplate UI only — logic will be added in the video.
      </footer>
    </div>
  </main>
);
}
