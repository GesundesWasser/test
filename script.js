const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get("t");
console.log("Lade test:" + myParam);
async function getData() {
  const url = "data/" + myParam + ".json";
  console.log(url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error.message);
    window.location.href = "/";
  }
}
let fragen = [];
async function init() {
  fragen = await getData();
  if (!fragen) return; // ABANDON SHIP!

  const test = document.getElementById("test");
  fragen.forEach(({ text, punkte }, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}) ${text}</td>
      ${punkte
        .map((v) => `<td><input type="radio" name="q${i}" value="${v}"></td>`)
        .join("")}
    `;
    test.appendChild(row);
  });
}

// Fragen in HTML rendern
const test = document.getElementById("test");
fragen.forEach((text, i) => {
  const row = document.createElement("tr");

  row.innerHTML = `
        <td>${i + 1}) ${text}</td>
        ${[2, 1, -1, -2]
          .map((v) => `<td><input type="radio" name="q${i}" value="${v}"></td>`)
          .join("")}
      `;

  test.appendChild(row);
});

// Punkte berechnen
function punkteBerechnen() {
  const unbeantwortet = fragen.filter(
    (_, i) => !document.querySelector(`input[name="q${i}"]:checked`),
  );

  if (unbeantwortet.length > 0) {
    document.getElementById("result").textContent =
      "Alles muss beantwortet werden!";
    return;
  }

  let total = 0;
  fragen.forEach((_, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected) total += +selected.value;
  });

  if (total < 0) {
    total = 0;
  }

  document.getElementById("result").textContent =
    "Das gibt " + total + " Punkte!";
}

init();
