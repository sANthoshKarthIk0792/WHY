---
toc: false
layout: toolkit
active_tab: teamteach
title: Sign Up Page
permalink: /student/TeamTeachToolkit/signup
description: Sign up for team teach topics
---


<title>Team Teach Toolkit Signup</title>

<!-- Tailwind CDN -->
<script src="https://cdn.tailwindcss.com"></script>


<div class="team-teach-section">
  <div class="max-w-5xl mx-auto text-white bg-gray-900 py-10 px-4">
    <p id="loggedInStudent" class="mb-4 text-center text-sm">Fetching student info...</p>
    <!-- Form and Table Section -->
    <div class="border border-white rounded p-6">
      <h2 class="text-2xl font-bold mb-4 text-center">TEAM TEACH SIGNUP</h2>
      <!-- Input Form -->
      <div class="mb-6">
        <input type="text" id="name" placeholder="Enter Team Teach Topic"
          class="w-full mb-3 px-3 py-2 bg-gray-700 text-white rounded outline-none placeholder-gray-300">
        <input type="date" id="dueDate"
          class="w-full mb-3 px-3 py-2 bg-gray-700 text-white rounded outline-none">
        <button id="addTopicBtn"
          class="border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition">Add Topic</button>
      </div>
      <!-- Topics Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full border border-white text-sm text-left">
          <thead class="bg-gray-800 text-white">
            <tr>
              <th class="px-4 py-2 border border-white">Topic</th>
              <th class="px-4 py-2 border border-white">Date</th>
              <th class="px-4 py-2 border border-white">Signed Up</th>
              <th class="px-4 py-2 border border-white">Actions</th>
            </tr>
          </thead>
          <tbody id="topicsList" class="text-white"></tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<script type="module">
  import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

  let loggedInStudent = null;
  let userId = -1;
  let StuName = "";

  async function getUserId() {
    const url_persons = `${javaURI}/api/person/get`;
    await fetch(url_persons, fetchOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Spring server response: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        userId = data.id;
        StuName = data.name;
        document.getElementById("loggedInStudent").innerText = `Logged in as: ${StuName}`;
        fetchTopics();
      })
      .catch(error => {
        console.error("Java Database Error:", error);
        document.getElementById("loggedInStudent").innerText = "Error fetching student info.";
      });
  }

  async function fetchTopics() {
    try {
      let response = await fetch(`${javaURI}/api/assignments/debug`, fetchOptions);
      let topics = await response.json();
      let filteredTopics = topics.filter(topic => topic.type === "teamteach");

      let topicsList = document.getElementById("topicsList");
      topicsList.innerHTML = "";

      filteredTopics.forEach(topic => {
            fetchAssignTopics(topic);
      });
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  }

  async function fetchAssignTopics(topic) {
  try {
    let response = await fetch(`${javaURI}/api/submissions/assignment/${topic.id}`, fetchOptions);
    let assignments = await response.json();

    let studentsSet = new Set();
    let studentsTextArray = [];

    assignments.forEach(assignment => {
      if (Array.isArray(assignment.students)) {
        assignment.students.forEach(s => {
          if (!studentsSet.has(s.id)) {
            studentsSet.add(s.id);
            studentsTextArray.push(`${s.name} (${s.id})`);
          }
        });
      } else if (assignment.students && typeof assignment.students === 'string') {
        let names = assignment.students.split(',');
        names.forEach(name => {
          if (!studentsSet.has(name.trim())) {
            studentsSet.add(name.trim());
            studentsTextArray.push(name.trim());
          }
        });
      }
    });

    const studentsText = studentsTextArray.length > 0 ? studentsTextArray.join(', ') : "None";
    const alreadySignedUp = studentsSet.has(userId);

    let row = document.createElement("tr");

    row.innerHTML = `
      <td class="border border-white px-4 py-2">${topic.name}</td>
      <td class="border border-white px-4 py-2">${topic.dueDate}</td>
      <td class="border border-white px-4 py-2">${studentsText}</td>
      <td class="border border-white px-4 py-2">
        <button class="border border-white px-3 py-1 rounded hover:bg-white hover:text-black transition text-sm" data-topic-id="${topic.id}" ${alreadySignedUp ? 'disabled class="opacity-50 cursor-not-allowed"' : ''}>
          ${alreadySignedUp ? 'Signed Up' : 'Sign Up'}
        </button>
      </td>
    `;

    if (!alreadySignedUp) {
      row.querySelector("button").addEventListener("click", function () {
        signUpForTopic(topic.id);
      });
    }

    topicsList.appendChild(row);
  } catch (error) {
    console.error("Error fetching topics:", error);
  }
}

  async function addTopic() {
    let name = document.getElementById("name").value;
    let dueDate = document.getElementById("dueDate").value;

    if (!name || !dueDate) {
      alert("Please fill in all fields.");
      return;
    }

    const url = `${javaURI}/api/assignments/create?name=${encodeURIComponent(name)}&type=teamteach&description=test&points=1.0&dueDate=${encodeURIComponent(dueDate)}`;

    try {
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        document.getElementById("name").value = "";
        document.getElementById("dueDate").value = "";
        fetchTopics();
      } else {
        console.error("Failed to add topic");
      }
    } catch (error) {
      console.error("Error adding topic:", error);
    }
  }

  async function signUpForTopic(id) {
    if (userId === -1) {
      alert("Please login first");
      return;
    }

    const content = "test";
    const comment = "";
    const isLate = false;

    const url = `${javaURI}/api/submissions/submit/${id}`;
  
    const data = {
            assignmentId: id,
            studentIds:[userId],
            content: content,
            comment:comment,
            isLate:isLate
        };
     const jsonData = JSON.stringify(data);

    try {
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: jsonData
      });

      if (response.ok) {
        fetchTopics();
      } else {
        console.error("Failed to sign up for topic");
        alert("Failed to sign up. Please try again.");
      }
    } catch (error) {
      console.error("Error signing up for topic:", error);
      alert("Error signing up. Please try again.");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    getUserId();
    document.getElementById("addTopicBtn").addEventListener("click", addTopic);
  });
</script>