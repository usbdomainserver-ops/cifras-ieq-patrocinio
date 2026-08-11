<!DOCTYPE html>
<html lang="pt-BR">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Importar músicas — Cifras IEQ</title>

  <style>

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #f5f5f5;
      color: #222;
    }

    header {
      background: linear-gradient(
        135deg,
        #6d28d9,
        #4c1d95
      );

      color: white;
      padding: 28px 20px;
      text-align: center;
    }

    header h1 {
      margin: 0;
      font-size: 24px;
    }

    header p {
      margin: 8px 0 0;
      opacity: .85;
    }

    .container {
      max-width: 700px;
      margin: auto;
      padding: 20px;
    }

    .card {
      background: white;
      padding: 20px;
      border-radius: 16px;
      box-shadow: 0 4px 15px rgba(0,0,0,.07);
    }

    .busca {
      display: flex;
      gap: 10px;
    }

    #pesquisa {
      flex: 1;
      padding: 14px;
      border: 1px solid #ddd;
      border-radius: 10px;
      font-size: 16px;
    }

    .buscar {
      border: none;
      background: #6d28d9;
      color: white;
      padding: 0 20px;
      border-radius: 10px;
      font-weight: bold;
      cursor: pointer;
    }

    .resultado {
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px;
      margin-top: 15px;
    }

    .resultado h3 {
      margin: 0;
    }

    .artista {
      color: #666;
      margin-top: 6px;
    }

    .tom {
      color: #6d28d9;
      font-weight: bold;
      margin-top: 8px;
    }

    .importar {
      width: 100%;
      border: none;
      background: #16a34a;
      color: white;
      padding: 13px;
      border-radius: 10px;
      font-weight: bold;
      margin-top: 15px;
      cursor: pointer;
    }

    .mensagem {
      margin-top: 15px;
      padding: 13px;
      border-radius: 10px;
      display: none;
    }

    .sucesso {
      display: block;
      background: #dcfce7;
      color: #166534;
    }

    .erro {
      display: block;
      background: #fee2e2;
      color: #991b1b;
    }

    .carregando {
      text-align: center;
      padding: 20px;
      color: #666;
    }

    @media (max-width: 500px) {

      .busca {
        flex-direction: column;
      }

      .buscar {
        padding: 14px;
      }

    }

  </style>

</head>

<body>

<header>

  <h1>🤖 IMPORTAR MÚSICA</h1>

  <p>
    Pesquisar no Cifralize
  </p>

</header>


<div class="container">

  <div class="card">

    <h2>
      🔎 Pesquisar música
    </h2>

    <div class="busca">

      <input
        id="pesquisa"
        type="text"
        placeholder="Ex.: Invoca-me"
        onkeydown="
          if(event.key === 'Enter')
            pesquisar()
        "
      >

      <button
        class="buscar"
        onclick="pesquisar()"
      >
        BUSCAR
      </button>

    </div>


    <div id="resultados"></div>

    <div
      id="mensagem"
      class="mensagem"
    ></div>

  </div>

</div>


<script>

/*
==================================================
SUPABASE
==================================================
*/

const SUPABASE_URL =
  "https://jbkeshenygonmgogkodd.supabase.co";


const SUPABASE_KEY =
  "COLOQUE_AQUI_A_MESMA_PUBLISHABLE_KEY_DO_SEU_CADASTRAR";


/*
==================================================
PESQUISAR
==================================================
*/

async function pesquisar() {

  const texto =
    document
      .getElementById("pesquisa")
      .value
      .trim();


  const resultados =
    document.getElementById(
      "resultados"
    );


  if (!texto) {

    resultados.innerHTML =
      "<p>Digite o nome da música.</p>";

    return;

  }


  resultados.innerHTML =
    `
      <div class="carregando">
        🔎 Pesquisando...
      </div>
    `;


  try {

    /*
      AGORA NÃO CHAMAMOS O CIFRALIZE
      DIRETAMENTE.

      Chamamos nossa própria função
      da Vercel.
    */

    const resposta =
      await fetch(
        "/api/cifralize?q=" +
        encodeURIComponent(texto)
      );


    if (!resposta.ok) {

      const erro =
        await resposta.text();

      throw new Error(
        erro ||
        "Erro na pesquisa."
      );

    }


    const dados =
      await resposta.json();


    console.log(
      "Resposta:",
      dados
    );


    mostrarResultados(
      dados
    );


  } catch (erro) {

    console.error(erro);

    resultados.innerHTML =
      `
        <div class="erro">

          ❌ Não foi possível pesquisar.

          <br><br>

          ${escapar(
            erro.message
          )}

        </div>
      `;

  }

}


/*
==================================================
MOSTRAR RESULTADOS
==================================================
*/

function mostrarResultados(dados) {

  const resultados =
    document.getElementById(
      "resultados"
    );


  resultados.innerHTML = "";


  let lista = [];


  if (Array.isArray(dados)) {

    lista = dados;

  }

  else if (
    Array.isArray(
      dados.results
    )
  ) {

    lista =
      dados.results;

  }

  else if (
    Array.isArray(
      dados.musicas
    )
  ) {

    lista =
      dados.musicas;

  }

  else if (
    Array.isArray(
      dados.songs
    )
  ) {

    lista =
      dados.songs;

  }


  if (!lista.length) {

    resultados.innerHTML =
      "<p>Nenhuma música encontrada.</p>";

    return;

  }


  lista.forEach(
    function(item) {

      const musica =
        normalizar(item);


      if (!musica.titulo) {
        return;
      }


      const div =
        document.createElement(
          "div"
        );


      div.className =
        "resultado";


      div.innerHTML =
        `
          <h3>
            🎵
            ${escapar(
              musica.titulo
            )}
          </h3>

          <div class="artista">

            ${escapar(
              musica.artista ||
              "Artista não informado"
            )}

          </div>

          ${
            musica.tom
              ?
              `
                <div class="tom">
                  Tom:
                  ${escapar(
                    musica.tom
                  )}
                </div>
              `
              :
              ""
          }

          <button
            class="importar"
            onclick="importarMusica(
              ${JSON.stringify(musica)}
            )"
          >

            ➕ IMPORTAR PARA O MEU BANCO

          </button>
        `;


      resultados.appendChild(
        div
      );

    }
  );

}


/*
==================================================
NORMALIZAR
==================================================
*/

function normalizar(item) {

  return {

    titulo:
      item.titulo ||
      item.title ||
      item.name ||
      "",

    artista:
      item.artista ||
      item.artist ||
      item.author ||
      "",

    tom:
      item.tom ||
      item.key ||
      "",

    url:
      item.url ||
      item.href ||
      item.link ||
      ""

  };

}


/*
==================================================
IMPORTAR PARA SUPABASE
==================================================
*/

async function importarMusica(
  musica
) {

  try {

    mostrarMensagem(
      "⏳ Salvando música...",
      false
    );


    /*
      Primeiro verifica se
      já existe.
    */

    const verifica =
      await fetch(

        SUPABASE_URL +
        "/rest/v1/musicas" +
        "?select=id" +
        "&titulo=eq." +
        encodeURIComponent(
          musica.titulo
        ),

        {

          headers: {

            "apikey":
              SUPABASE_KEY,

            "Authorization":
              "Bearer " +
              SUPABASE_KEY

          }

        }

      );


    if (!verifica.ok) {

      throw new Error(
        await verifica.text()
      );

    }


    const existentes =
      await verifica.json();


    if (
      existentes.length > 0
    ) {

      mostrarMensagem(
        "⚠️ Essa música já está cadastrada.",
        true
      );

      return;

    }


    /*
      IMPORTANTE:

      Nesta primeira versão vamos
      salvar os dados que a busca
      retornar.

      Depois ligamos a busca da
      cifra completa.
    */

    const resposta =
      await fetch(

        SUPABASE_URL +
        "/rest/v1/musicas",

        {

          method: "POST",

          headers: {

            "apikey":
              SUPABASE_KEY,

            "Authorization":
              "Bearer " +
              SUPABASE_KEY,

            "Content-Type":
              "application/json",

            "Prefer":
              "return=representation"

          },

          body:
            JSON.stringify({

              titulo:
                musica.titulo,

              artista:
                musica.artista || "",

              tom:
                musica.tom || "C",

              capo:
                0,

              cifra:
                ""

            })

        }

      );


    if (!resposta.ok) {

      throw new Error(
        await resposta.text()
      );

    }


    mostrarMensagem(
      "✅ Música importada com sucesso!",
      false
    );


  } catch (erro) {

    console.error(erro);

    mostrarMensagem(
      "❌ Erro ao importar: " +
      erro.message,
      true
    );

  }

}


/*
==================================================
MENSAGEM
==================================================
*/

function mostrarMensagem(
  texto,
  erro
) {

  const elemento =
    document.getElementById(
      "mensagem"
    );


  elemento.textContent =
    texto;


  elemento.className =
    "mensagem " +
    (
      erro
        ? "erro"
        : "sucesso"
    );

}


/*
==================================================
ESCAPAR HTML
==================================================
*/

function escapar(
  texto
) {

  return String(texto)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}

</script>

</body>

</html>
