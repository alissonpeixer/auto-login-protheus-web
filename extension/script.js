(function () {
  const evento = new Event("input", { bubbles: true });

  function injetarLogin() {

    chrome.storage.local.get('credentials', (data) => {
      const credentials = data.credentials || [];
      const urlAtual = window.location.href;

      const credencialEncontrada = credentials.find(cred => urlAtual.startsWith(cred.url));

      if (credencialEncontrada) {
        const login = credencialEncontrada.login;
        const password = credencialEncontrada.password;

        const webview = document.getElementById("COMP3010");

        if (webview) {
          if (webview.shadowRoot) {
            const iframe = webview.shadowRoot.querySelector("iframe");

            if (iframe) {
              
              const webviewDocument = webview.shadowRoot.querySelector("iframe").contentDocument;
              
              if (webviewDocument) {
                let inputLogin = webviewDocument.getElementsByName("login")[1];
                let inputPassword = webviewDocument.getElementsByName("password")[1];
                
                if (inputLogin && inputPassword) {
                clearInterval(intervalStart);
                inputLogin.value = login;
                inputLogin.dispatchEvent(evento);
                
                inputPassword.value = password;
                inputPassword.dispatchEvent(evento);
                

                webviewDocument.querySelectorAll(".po-button")[0].click();
                
                let intervalClick = setInterval(() => {
                  const botaoEntrar = webviewDocument.querySelectorAll(".po-button")[2];
                  if (botaoEntrar) {
                    botaoEntrar.click();
                    clearInterval(intervalClick);
                  }
                }, 1000);
                
                let interval1 = setInterval(() => {
                  const botao1 = document.querySelector("wa-button#COMP4512");
                  if (botao1) {
                    botao1.click();
                    clearInterval(interval1);
                  }
                }, 1000);
                
                let intervalBtn2 = setInterval(() => {
                  const botao2 = document.querySelector("wa-button#COMP4522");
                  if (botao2) {
                    botao2.click();
                    clearInterval(intervalBtn2);
                  }
                }, 1000);
                
              } else {
                console.log("Campos de login/senha não localizados");
              }
          
            }
          }
          }
        }
      } else {
        clearInterval(intervalStart);
      }
    });
  }

  const intervalStart = setInterval(injetarLogin, 100);
})();