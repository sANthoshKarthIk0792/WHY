---
layout: toolkit
active_tab: teamteach
title: Hacks Grader
permalink: /student/SAGAI/grader
description: Grade hacks on a 0.55 scale while also providing feedback
---

<title>Hacks Grader</title>

<!-- Navigation buttons -->
<div class="flex justify-center mt-5 flex-wrap gap-4 text-center">
  <a href="{{site.baseurl}}/student/TeamTeachToolkit">
    <button class="bg-black text-white border border-white px-5 py-2 hover:bg-gray-500 text-lg">Home</button>
  </a>
  <a href="{{site.baseurl}}/student/TeamTeachToolkit/generator">
    <button class="bg-black text-white border border-white px-5 py-2 hover:bg-gray-500 text-lg">Generator</button>
  </a>
  <a href="{{site.baseurl}}/student/TeamTeachToolkit/review">
    <button class="bg-black text-white border border-white px-5 py-2 hover:bg-gray-500 text-lg">Review</button>
  </a>
  <a href="{{site.baseurl}}/student/TeamTeachToolkit/signup">
    <button class="bg-black text-white border border-white px-5 py-2 hover:bg-gray-500 text-lg">Sign Up</button>
  </a>
</div>

<!-- Main Grader -->
<div class="min-h-screen bg-black text-white flex flex-col items-center justify-start py-12 px-4 font-sans">
  <h1 class="text-4xl font-bold mb-2 text-center">Hacks Grader</h1>
  <p class="text-gray-400 text-center mb-10">Grade hacks on a 0.55 scale while also providing feedback</p>

  <div class="w-full max-w-2xl bg-[#111] rounded-xl p-8 shadow-lg">
    <form class="space-y-10 flex flex-col items-center text-center w-full">
      <!-- Requirements -->
      <div class="w-full flex flex-col items-center text-center">
        <label for="requirements" class="text-lg font-semibold mb-2 w-full text-left">Requirements:</label>
        <textarea id="requirements" placeholder="Write requirements here"
          class="w-full h-32 resize-none p-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-white"
          oninput="adjustTextareaHeight(this)"></textarea>
      </div>
      <!-- Code -->
      <div class="w-full flex flex-col items-center text-center">
        <label for="code" class="text-lg font-semibold mb-2 w-full text-left">Code:</label>
        <textarea id="code" placeholder="Insert your code here"
          class="w-full h-32 resize-none p-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-white"
          oninput="adjustTextareaHeight(this)"></textarea>
      </div>
      <!-- Submit Button -->
      <div>
        <button type="button" onclick="submitCode()"
          class="bg-black border border-white px-6 py-2 rounded-md hover:bg-gray-600 transition">Submit Requirement and Code</button>
      </div>
      <!-- Feedback -->
      <div class="w-full">
        <h2 class="text-lg font-semibold mb-1">Feedback:</h2>
        <p id="feedback" class="text-gray-300 mt-2"></p>
      </div>
    </form>
  </div>
</div>

<script>
  function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  function submitCode() {
    const prompt = document.getElementById("requirements").value;
    const codeBlock = document.getElementById("code").value;

    const requestData = {
      prompt: prompt,
      code_block: codeBlock
    };

    fetch('https://grading.stu.nighthawkcodingsociety.com/grader/input', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then(response => response.json())
      .then(data => {
        document.getElementById('feedback').innerText = data.response;
      })
      .catch(error => {
        alert("An error occurred: " + error.message);
      });
  }
</script>