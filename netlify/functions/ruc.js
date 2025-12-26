export async function handler(event) {
  try {
    const numero = (event.queryStringParameters?.numero || "").trim();

    if (!/^\d{11}$/.test(numero)) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, error: "RUC inválido" }) };
    }

    const token = process.env.DECOLECTA_TOKEN;
    if (!token) {
      return { statusCode: 500, body: JSON.stringify({ ok: false, error: "Falta DECOLECTA_TOKEN" }) };
    }

    const url = `https://api.decolecta.com/v1/sunat/ruc/full?numero=${encodeURIComponent(numero)}`;

    const resp = await fetch(url, {
      headers: { "Accept": "application/json", "Authorization": `Bearer ${token}` }
    });

    const data = await resp.json();

    if (!resp.ok) {
      return { statusCode: resp.status, body: JSON.stringify({ ok: false, error: data }) };
    }

    const razonSocial =
      data?.nombre_o_razon_social ||
      data?.razon_social ||
      data?.nombre ||
      "";

    return { statusCode: 200, body: JSON.stringify({ ok: true, razonSocial }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(e) }) };
  }
}
