export default async function handler(req, res) {
  try {
    const q = req.query.q;

    if (!q) {
      return res.status(400).json({
        error: "Informe uma música."
      });
    }

    const url =
      "https://cifralize.com.br/search?q=" +
      encodeURIComponent(q) +
      "&format=json";

    const resposta = await fetch(url);

    if (!resposta.ok) {
      return res.status(resposta.status).json({
        error: "Erro ao consultar o Cifralize."
      });
    }

    const dados = await resposta.json();

    return res.status(200).json(dados);

  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      error: "Erro ao consultar o Cifralize.",
      detalhe: erro.message
    });
  }
}
