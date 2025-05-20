---
layout: toolkit
active_tab: teamteach
title: Hacks Generator
permalink: /student/SAGAI/generator
description: Generate MC or FRQ hacks based on specific units
---

<div class="container-fluid bg-dark text-white py-3">
  <!-- Navigation buttons -->
  <div class="text-center mb-3">
    <a href="{{site.baseurl}}/student/TeamTeachToolkit" class="btn btn-outline-light mx-2">Home</a>
    <a href="{{site.baseurl}}/student/TeamTeachToolkit/grader" class="btn btn-outline-light mx-2">Grader</a>
    <a href="{{site.baseurl}}/student/TeamTeachToolkit/review" class="btn btn-outline-light mx-2">Review</a>
    <a href="{{site.baseurl}}/student/TeamTeachToolkit/signup" class="btn btn-outline-light mx-2">Sign Up</a>
  </div>

  <!-- Generator Form -->
  <div class="container text-center">
    <div class="mb-4">
      <h2 class="mb-3">Generate a Hack</h2>
      <div class="mb-3">
        <input type="text" class="form-control" id="topicInput" placeholder="Insert topic here">

      </div>
      <div class="mb-3">
        <input type="text" class="form-control" id="requirementsInput" placeholder="MC, FRQ, or other instructions">
      </div>
      <button class="btn btn-light w-100" id="submitButton">Generate</button>
    </div>
    <!-- Output Section -->
    <div>
      <h2 class="mb-3">Output Question:</h2>
      <div id="output" class="bg-secondary text-white p-3 rounded" style="min-height: 100px;">
        Hack will display here
      </div>
    </div>
    <!-- Tags Input -->
    <div class="mt-4">
      <label for="tagInput" class="form-label">Enter tags (comma-separated):</label>
      <input type="text" class="form-control w-50 mx-auto" id="tagInput" placeholder="Enter tags">
    </div>
    <!-- Bottom Buttons -->
    <div class="d-flex justify-content-center gap-3 my-4">
      <button class="btn btn-light" onclick="saveQuestion()">Save Hack</button>
      <button class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#savedModal">See Saved Hacks</button>
    </div>
  </div>
</div>

<!-- Modal for Saved Questions -->
<div class="modal fade" id="savedModal" tabindex="-1" aria-labelledby="savedModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg text-white">
    <div class="modal-content bg-dark">
      <div class="modal-header">
        <h5 class="modal-title" id="savedModalLabel">Saved Questions</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <label for="tagFilter" class="form-label">Filter by Tag:</label>
        <select id="tagFilter" class="form-select mb-3" onchange="loadSavedQuestions()">
          <option value="">All Tags</option>
        </select>
        <ul id="saved-questions" class="list-group"></ul>
      </div>
    </div>
  </div>
</div>

<script type="module">
  import { javaURI } from '{{site.baseurl}}/assets/js/api/config.js';

  async function submitRequirements() {
    const topic = document.getElementById('topicInput').value;
    const requirements = document.getElementById('requirementsInput').value;
    const userRequest = { topic, requirements };

    try {
      const response = await fetch(`${javaURI}/generate/question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userRequest)
      });

      if (!response.ok) throw new Error('Network error: ' + response.statusText);

      const question = await response.text();
      displayQuestion(question);
    } catch (error) {
      alert('Error generating question: ' + error.message);
    }
  }

  function displayQuestion(question) {
    const outputElement = document.getElementById('output');
    const formatted = question
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/(?:\r\n|\r|\n)/g, '<br>')
      .replace(/(A\.\s|B\.\s|C\.\s|D\.\s)/g, '<br><strong>$1</strong>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    outputElement.innerHTML = formatted;
  }

  async function saveQuestion() {
    const question = document.getElementById('output').innerHTML;
    const tags = document.getElementById('tagInput').value.split(',').map(t => t.trim());

    if (!question) return alert('No question to save!');

    const data = { question, tags };
    try {
      const res = await fetch(`${javaURI}/save-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        alert('Question saved!');
        loadTags();
      } else {
        alert('Save failed.');
      }
    } catch (err) {
      alert('Save error: ' + err.message);
    }
  }

  async function loadSavedQuestions() {
    const tagFilter = document.getElementById('tagFilter').value;
    const list = document.getElementById('saved-questions');
    list.innerHTML = '';

    try {
      const res = await fetch(`${javaURI}/saved-questions`);
      const data = await res.json();

      data.forEach(({ question, tags }) => {
        if (!tagFilter || tags.includes(tagFilter)) {
          const item = document.createElement('li');
          item.className = 'list-group-item bg-secondary text-white mb-2';

          const tagDiv = tags.map(tag => `<span class="badge bg-primary me-1">${tag}</span>`).join('');
          item.innerHTML = `${tagDiv}<div class="mt-2">${question}</div>`;
          list.appendChild(item);
        }
      });
    } catch (err) {
      alert('Error loading questions: ' + err.message);
    }
  }

  async function loadTags() {
    const dropdown = document.getElementById('tagFilter');
    dropdown.innerHTML = '<option value="">All Tags</option>';

    try {
      const res = await fetch(`${javaURI}/saved-questions`);
      const questions = await res.json();
      const uniqueTags = new Set();

      questions.forEach(({ tags }) => tags.forEach(tag => uniqueTags.add(tag)));
      uniqueTags.forEach(tag => {
        const opt = document.createElement('option');
        opt.value = tag;
        opt.textContent = tag;
        dropdown.appendChild(opt);
      });
    } catch (err) {
      console.error('Tag load error:', err);
    }
  }

  document.getElementById('submitButton').addEventListener('click', submitRequirements);
  window.saveQuestion = saveQuestion;
  window.loadSavedQuestions = loadSavedQuestions;
</script>
