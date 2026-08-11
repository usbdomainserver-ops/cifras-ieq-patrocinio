export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        error: "Método não permitido"
      });
    }

    const q = String(req.query?.q || "").trim();

    if (!q) {
      return res.status(400).json({
        error: "Informe uma música"
      });
    }

    const url =
      "https://cifralize.com.br/search?q=" +
      encodeURIComponent(q) +
      "&format=json";

    const resposta = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0"
      }
    });

    const texto = await resposta.text();

    if (!resposta.ok) {
      return res.status(resposta.status).json({
        error: "Erro no Cifralize",
        status: resposta.status,
        resposta: texto.substring(0, 1000)
      });
    }

    let dados;

    try {
      dados = JSON.parse(texto);
    } catch {
      return res.status(502).json({
        error: "Cifralize não retornou JSON",
        resposta: texto.substring(0, 1000)
      });
    }

    return res.status(200).json(dados);

  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      error: "Erro interno",
      detalhe: erro.message
    });
  }
}
