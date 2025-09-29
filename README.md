Um bookmarklet para o Khan Academy

## Como Usar (Instalação)

Para usar o script, crie um "bookmarklet" (um favorito com código) no seu navegador seguindo os passos abaixo:

1.  **Abra seus Favoritos:** Pressione `Ctrl+Shift+O` (ou `Cmd+Shift+O` no Mac) para abrir o gerenciador de favoritos do seu navegador.
2.  **Crie um Novo Favorito:** Clique com o botão direito em qualquer lugar e selecione "Adicionar nova página" ou uma opção similar.
3.  **Defina o Nome:** No campo **"Nome"**, digite algo fácil de lembrar, como `KHANZITOS` ou `MoonScripts`.
4.  **Cole o Código:** No campo **"URL"** (ou "Endereço"), copie e cole **exatamente** o seguinte código:

    ```javascript
    javascript:fetch("https://raw.githubusercontent.com/orickmaxx/rick/refs/heads/main/khan.js").then(t=>t.text()).then(eval);
    ```

5.  **Pronto!** Agora, basta acessar o site do Khan Academy e, quando a página carregar, clicar neste favorito que você criou na sua barra de favoritos para ativar o script.
