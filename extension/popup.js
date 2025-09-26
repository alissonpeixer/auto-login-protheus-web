document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.getElementById("title");
  const urlInput = document.getElementById("url");
  const loginInput = document.getElementById("login");
  const passwordInput = document.getElementById("password");
  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const loginListDiv = document.getElementById("login-list");

  let editIndex = null;


  function renderList() {
    chrome.storage.local.get("credentials", (data) => {
      const credentials = data.credentials || [];
      loginListDiv.innerHTML = "";

      credentials.forEach((cred, index) => {
        const item = document.createElement("div");
        item.className = `item ${cred.active ? "" : "inactive"}`;

        item.innerHTML = `
          <div class="info">
            <div class="title">${cred.title}</div>
            <div class="details">${cred.url}</div>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" data-action="toggle" data-index="${index}" ${cred.active ? "checked" : ""}>
            <span class="slider"></span>
          </label>
          <div class="actions">
            <button class="edit-btn" title="Editar" data-action="edit" data-index="${index}">
              <svg viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
            </button>
            <button class="delete-btn" title="Remover" data-action="delete" data-index="${index}">
              <svg viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
            </button>
          </div>
        `;

        loginListDiv.appendChild(item);
      });
    });
  }

  function resetForm() {
    titleInput.value = "";
    urlInput.value = "";
    loginInput.value = "";
    passwordInput.value = "";

    editIndex = null;

    saveBtn.textContent = "Adicionar";
    cancelBtn.style.display = "none";
    titleInput.focus();
  }


  saveBtn.addEventListener("click", () => {
    const cred = {
      title: titleInput.value.trim(),
      url: urlInput.value.trim(),
      login: loginInput.value.trim(),
      password: passwordInput.value,
      active: true,
    };

    if (cred.title && cred.url && cred.login) {
      chrome.storage.local.get("credentials", (data) => {
        const credentials = data.credentials || [];

        if (editIndex !== null) {
          const originalCred = credentials[editIndex];
          credentials[editIndex] = { ...originalCred, ...cred };
        } else {
          credentials.push(cred);
        }

        chrome.storage.local.set({ credentials }, () => {
          resetForm();
          renderList();
        });
      });
    } else {
      alert("Por favor, preencha Título, URL e Login.");
    }
  });

  cancelBtn.addEventListener("click", resetForm);

  loginListDiv.addEventListener("click", (e) => {
    const target = e.target;
    const actionElement = target.closest("[data-action]");

    if (!actionElement) return;

    const action = actionElement.dataset.action;
    const index = parseInt(actionElement.dataset.index, 10);

    chrome.storage.local.get("credentials", (data) => {
      let credentials = data.credentials || [];

      switch (action) {
        case "toggle":
          credentials[index].active = !credentials[index].active;
          chrome.storage.local.set({ credentials }, renderList);
          break;

        case "edit":
          const credToEdit = credentials[index];
          titleInput.value = credToEdit.title;
          urlInput.value = credToEdit.url;
          loginInput.value = credToEdit.login;
          passwordInput.value = credToEdit.password;

          editIndex = index;

          saveBtn.textContent = "Salvar Alteracoes";
          cancelBtn.style.display = "block";
          titleInput.focus();
          break;

        case "delete":
          if (
            confirm(
              `Tem certeza que deseja remover "${credentials[index].title}"?`
            )
          ) {
            credentials.splice(index, 1);
            chrome.storage.local.set({ credentials }, () => {
              if (editIndex === index) {
                resetForm();
              }
              renderList();
            });
          }
          break;
      }
    });
  });

  renderList();
});
