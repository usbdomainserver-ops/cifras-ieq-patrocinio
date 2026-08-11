export default async function handler(req, res) {

  try {

    // Permitir somente GET
    if (req.method !== "GET") {
      return res.status(405).json({
        error: "Método não permitido."
      });
    }

    // Pegar o termo pesquisado
    const q =
      typeof req.query?.q === "string"
        ? req.query.q.trim()
        : "";

    if (!q) {
      return res.status(400).json({
        error: "Digite o nome da música."
      });
    }

    // URL do Cifralize
    const url =
      "https://cifralize.com.br/search?q=" +
      encodeURIComponent(q) +
      "&format=json";

    console.log("Consultando Cifralize:", url);

    // Fazer a consulta pelo servidor da Vercel
    const resposta = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0"
      }
    });

    const texto = await resposta.text();

    console.log(
      "Status Cifralize:",
      resposta.status
    );

    // Cifralize retornou erro
    if (!resposta.ok) {

      return res.status(resposta.status).json({
        error: "Cifralize retornou erro.",
        status: resposta.status,
        resposta: texto.substring(0, 2000)
      });

    }

    // Tentar transformar em JSON
    let dados;

    try {

      dados = JSON.parse(texto);

    } catch (erro) {

      return res.status(502).json({
        error:
          "O Cifralize não retornou JSON válido.",
        resposta:
          texto.substring(0, 2000)
      });

    }

    // Retornar o resultado para o importar.html
    return res.status(200).json(dados);

  } catch (erro) {

    console.error(
      "ERRO CIFRALIZE:",
      erro
    );

    return res.status(500).json({
      error:
        "Erro interno na função.",
      detalhe:
        erro.message
    });

  }

}
