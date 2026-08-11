export default async function handler(req, res) {
  try {
    const q = req.query?.q;

    if (!q) {
      return res.status(400).json({
        error: "Digite o nome da música."
      });
    }

    const url =
      "https://cifralize.com.br/search?q=" +
      encodeURIComponent(q) +
      "&format=json";

    const resposta = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0"
      }
    });

    const texto = await resposta.text();

    if (!resposta.ok) {
      return res.status(resposta.status).json({
        error: "Cifralize retornou erro.",
        status: resposta.status,
        resposta: texto
      });
    }

    let dados;

    try {
      dados = JSON.parse(texto);
    } catch (erro) {
      return res.status(502).json({
        error: "O Cifralize não retornou JSON válido.",
        resposta: texto.substring(0, 1000)
      });
    }

    return res.status(200).json(dados);

  } catch (erro) {

    console.error("ERRO CIFRALIZE:", erro);

    return res.status(500).json({
      error: "Erro interno na função.",
      detalhe: erro.message
    });
  }
}
