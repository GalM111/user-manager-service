const flash = (message, type = "success") => {
    const template = document.querySelector("#message-template");
    const toast = template.content.firstElementChild.cloneNode(true);
    toast.classList.toggle("error", type === "error");
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3100);
};

const toList = (value) => value.split(",").map((entry) => entry.trim()).filter(Boolean);

const createForm = document.querySelector("#create-form");
const lookupForm = document.querySelector("#lookup-form");
const refreshBtn = document.querySelector("#refresh");
const lookupResult = document.querySelector("#lookup-result");
const listResult = document.querySelector("#list-result");

const api = (path, options = {}) =>
    fetch(path, { headers: { "Content-Type": "application/json" }, ...options })
        .then(async (res) => {
            const payload = await res.json().catch(() => ({}));
            if (!res.ok) {
                const error = payload?.message || res.statusText || "Request failed";
                throw new Error(error);
            }
            return payload;
        });

const refreshList = () =>
    api("/api/userdata")
        .then((data) => {
            listResult.textContent = JSON.stringify(data, null, 2);
        })
        .catch((err) => {
            listResult.textContent = err.message;
            flash(err.message, "error");
        });

createForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const payload = {
        name: document.querySelector("#name").value,
        email: document.querySelector("#email").value,
        assets: toList(document.querySelector("#assets").value),
        investorType: document.querySelector("#investorType").value || null,
        contentType: toList(document.querySelector("#contentType").value),
    };

    api("/api/userdata", {
        method: "POST",
        body: JSON.stringify(payload),
    })
        .then((user) => {
            flash(`Created ${user.name}`);
            createForm.reset();
            refreshList();
        })
        .catch((err) => flash(err.message, "error"));
});

lookupForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.querySelector("#lookup-email").value;
    api(`/api/userdata/email?email=${encodeURIComponent(email)}`)
        .then((user) => {
            lookupResult.textContent = JSON.stringify(user, null, 2);
        })
        .catch((err) => {
            lookupResult.textContent = err.message;
            flash(err.message, "error");
        });
});

refreshBtn?.addEventListener("click", refreshList);

refreshList();
