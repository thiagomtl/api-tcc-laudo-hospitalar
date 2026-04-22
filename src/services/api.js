export const API_URL = "http://localhost:3333";

export async function apiFetch(endpoint, options = {}) {
  const resposta = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const dados = await resposta.json();
  return { resposta, dados };
}