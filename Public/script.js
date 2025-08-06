
const API_ENDPOINT = "https://din-vercel-url.vercel.app/api/generate";

async function readFiles(fileList) {
  const contents = [];
  for (const file of fileList) {
    contents.push(await file.text());
  }
  return contents.join("\n");
}

async function generateText() {
  const rulesFiles = document.getElementById("rulesFiles").files;
  const linksFiles = document.getElementById("linksFiles").files;
  const extraNote = document.getElementById("extraNote").value;

  const rules = await readFiles(rulesFiles);
  const links = await readFiles(linksFiles);

  const res = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texts: { rules, links }, extraNote })
  });

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "Ingen respons";

  const container = document.createElement("div");
  container.className = "result";
  container.innerHTML = `
    <button class="copy-btn" onclick="copyToClipboard(this)">Kopiér</button>
    <pre>${content}</pre>
  `;
  document.getElementById("results").appendChild(container);
}

function copyToClipboard(btn) {
  const text = btn.nextElementSibling.innerText;
  navigator.clipboard.writeText(text);
  btn.innerText = "Kopieret!";
  setTimeout(() => (btn.innerText = "Kopiér"), 2000);
}
