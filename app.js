// word format: [word, meaning, situation, plain way to say it, natural way using the word]
const P = {
  casual: {
    "Travel": [
      ["Wanderlust", "a strong desire to travel and explore the world", "a friend asks why you are always planning trips", "I really love travelling a lot", "I've got serious wanderlust, I can't sit still for long."],
      ["Off the beaten path", "away from the usual tourist spots", "someone asks about your favourite hidden place", "It was a quiet place that few tourists visit", "We went off the beaten path and found a tiny village."],
      ["Spontaneous", "done on impulse, without any planning", "someone asks how you ended up in Goa", "I decided to go without planning anything", "It was a totally spontaneous trip, we booked it that morning."],
      ["Scenic", "having beautiful natural views", "a friend asks how the drive to Lonavala was", "The view on the way was very nice", "The scenic route through the hills was stunning."],
      ["Hit the road", "to start a journey", "someone asks when you are leaving", "We will start our journey early", "We're going to hit the road at five tomorrow."]
    ],
    "Food & Dining": [
      ["Mouth-watering", "looking or smelling so delicious that you feel hungry", "a friend asks about the biryani you had", "The biryani was very tasty", "It was mouth-watering, I could smell it from the street."],
      ["Piping hot", "extremely hot, usually said about food or drinks", "a waiter places your soup on the table", "The soup is very hot, be careful", "Be careful, the soup is piping hot."],
      ["Foodie", "a person who loves and enjoys trying different foods", "someone asks about your hobbies", "I like trying all kinds of food", "I'm a total foodie, I research restaurants before every trip."],
      ["A piece of cake", "something very easy to do", "a friend asks if the recipe was difficult", "It was very easy to make", "Honestly, the recipe was a piece of cake."],
      ["Hit the spot", "to satisfy exactly what you needed", "you finish a cold coffee on a hot afternoon", "That drink was exactly what I wanted", "That cold coffee really hit the spot."]
    ],
    "Everyday Chat": [
      ["Raining cats and dogs", "raining very heavily", "someone asks how the weather was", "It was raining heavily", "It was raining cats and dogs all evening."],
      ["Under the weather", "feeling slightly unwell", "a friend asks why you skipped the party", "I wasn't feeling well", "I was feeling a bit under the weather, so I stayed in."],
      ["Break the ice", "to make people comfortable at an awkward first meeting", "you ask how to talk to new people", "Start talking to them so it feels comfortable", "A small joke is a great way to break the ice."],
      ["Once in a blue moon", "very rarely", "someone asks how often you eat out", "I almost never go out to eat", "I eat out once in a blue moon."],
      ["Call it a day", "to stop working for the day", "your teammate asks if you are done", "Let's stop working now", "It's getting late, let's call it a day."]
    ]
  },
  formal: {
    "Career": [
      ["Articulate", "able to express ideas clearly and effectively", "an interviewer asks about your strengths", "I can speak well", "I'm articulate, I can explain complex ideas clearly."],
      ["Proficient", "skilled and competent at something", "a recruiter asks about your Excel skills", "I am good at Excel", "I am proficient in Excel and data analysis."],
      ["Initiative", "the ability to act without being told", "a manager asks for an example of leadership", "I did it without anyone asking me", "I took the initiative to redesign our onboarding process."],
      ["Collaborate", "to work together with others toward a goal", "an interviewer asks about teamwork", "I work with other teams", "I collaborate closely with design and engineering teams."],
      ["Accountable", "taking responsibility for your actions and results", "a manager asks how you handle mistakes", "I take the blame when something goes wrong", "I hold myself accountable for every deliverable."]
    ],
    "Meetings": [
      ["Agenda", "a list of topics to be discussed in a meeting", "you want to prepare before a meeting", "Send me the list of things we will talk about", "Could you please share the agenda before the meeting?"],
      ["Prioritize", "to treat the most important things first", "your manager asks how you plan the week", "I do the most important work first", "We need to prioritize the client deliverables."],
      ["Consensus", "a general agreement among everyone", "someone asks if the team decided on a date", "Everyone agreed on the date", "The team reached a consensus on the timeline."],
      ["Follow up", "to contact someone again about a previous discussion", "a client asks what happens next", "I will contact you again later", "I'll follow up with you by Friday."],
      ["Action items", "specific tasks assigned to people after a meeting", "you are about to close a meeting", "Here is what each person has to do", "Let me quickly recap the action items before we close."]
    ],
    "Professional Writing": [
      ["Concise", "short and clear, without unnecessary words", "your manager wants a quick status email", "Keep your update short", "Please keep your update concise."],
      ["Clarification", "an explanation that removes confusion", "you are unsure about a number in a report", "I don't understand this, please explain", "Could you provide clarification on the budget figures?"],
      ["Acknowledge", "to confirm that you have received or noticed something", "you receive an important email from a client", "I got your email", "I acknowledge receipt of your email and will reply shortly."],
      ["Deadline", "the latest time or date by which something must be done", "a colleague asks when the report is due", "We must finish it by that date", "We must submit the report before the deadline."],
      ["Appreciate", "to be thankful for something", "a colleague helps you finish a project", "Thanks a lot for your help", "I truly appreciate your prompt support."]
    ]
  }
};

let tone, subject, score, answered, quizData;
const $ = s => document.querySelector(s);
const shuffle = a => a.map(x => [Math.random(), x]).sort((a, b) => a[0] - b[0]).map(x => x[1]);

function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $("#" + id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if ("speechSynthesis" in window) speechSynthesis.cancel();
}

function speak(text) {
  if (!("speechSynthesis" in window)) { alert("Speech is not supported in this browser."); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.95;
  speechSynthesis.speak(u);
}

function renderSubjects() {
  const grid = $("#subjectGrid");
  grid.innerHTML = "";
  Object.keys(P[tone]).forEach(name => {
    const b = document.createElement("button");
    b.className = "card choice";
    b.innerHTML = `<h3>${name}</h3><p>${P[tone][name].length} words and phrases</p>`;
    b.onclick = () => { subject = name; renderFlashcards(); };
    grid.appendChild(b);
  });
  show("subject");
}

function renderFlashcards() {
  $("#fcTitle").textContent = subject;
  const grid = $("#cardGrid");
  grid.innerHTML = "";
  P[tone][subject].forEach(([w, m, ctx, plain, say]) => {
    const el = document.createElement("div");
    el.className = "card flash";
    el.innerHTML = `<h3>${w}</h3><p>${m.charAt(0).toUpperCase() + m.slice(1)}.</p>
      <p class="ctx">When ${ctx}:</p>
      <p class="plain">Instead of: “${plain}”</p>
      <p class="say">Say: “${say}”</p>
      <button class="btn speak">🔊 Explain Meaning</button>
      <button class="btn speak">🔊 Usage Example</button>`;
    const [b1, b2] = el.querySelectorAll("button");
    b1.onclick = () => speak(`${w}. In simple words, it means ${m}.`);
    b2.onclick = () => speak(`Imagine ${ctx}. Instead of saying, ${plain}, you can say, ${say}`);
    grid.appendChild(el);
  });
  show("flashcards");
}

function buildQuiz() {
  const words = P[tone][subject];
  const pick = shuffle(words).slice(0, 4);
  const others = w => shuffle(words.filter(x => x !== w)).slice(0, 2);
  return pick.map((w, i) => {
    const opts = shuffle([w, ...others(w)]);
    if (i % 2 === 0) {
      return { q: `Which word or phrase means: “${w[1]}”?`, opts: opts.map(o => o[0]), a: opts.indexOf(w) };
    }
    const esc = w[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const blank = w[4].replace(new RegExp(esc, "i"), "______");
    return { q: `Fill in the blank: “${blank}”`, opts: opts.map(o => o[0]), a: opts.indexOf(w) };
  });
}

function renderQuiz() {
  score = 0; answered = {};
  quizData = buildQuiz();
  $("#bar").style.width = "0%";
  const box = $("#questions");
  box.innerHTML = "";
  quizData.forEach((item, i) => {
    const el = document.createElement("div");
    el.className = "card q";
    el.innerHTML = `<h3>${i + 1}. ${item.q}</h3>`;
    item.opts.forEach((o, j) => {
      const b = document.createElement("button");
      b.className = "opt";
      b.textContent = o;
      b.onclick = () => {
        if (answered[i] !== undefined) return;
        answered[i] = j;
        const right = j === item.a;
        if (right) score++;
        b.classList.add(right ? "correct" : "wrong");
        if (!right) el.querySelectorAll(".opt")[item.a].classList.add("correct");
        el.querySelectorAll(".opt").forEach(x => x.disabled = true);
        $("#bar").style.width = (Object.keys(answered).length / quizData.length * 100) + "%";
      };
      el.appendChild(b);
    });
    box.appendChild(el);
  });
  show("quiz");
}

function showResults() {
  $("#score").textContent = `You scored ${score}/${quizData.length}`;
  $("#feedback").textContent = score === quizData.length
    ? "Excellent! You mastered all words."
    : "Keep practicing to improve your vocabulary usage.";
  show("results");
}

document.querySelectorAll("[data-go]").forEach(b => b.onclick = () => show(b.dataset.go));
document.querySelectorAll("[data-tone]").forEach(b => b.onclick = () => { tone = b.dataset.tone; renderSubjects(); });
$("#startQuiz").onclick = renderQuiz;
$("#finishQuiz").onclick = showResults;
