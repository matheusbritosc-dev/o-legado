const API_URL = "http://localhost:8000/api/v1";

export async function registrarInscricao(nome: string, emailSeguroCipher: string) {
  try {
    const response = await fetch(`${API_URL}/auth/registrar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: nome,
        email: emailSeguroCipher, // Enviaremos o cipher no lugar do email para fins de segurança/anonimato no mock
        senha: "senha_gerada_automaticamente", // Password mock for pre-registration
        perfil_json: {
          origem: "lancamento_comunitario",
          status: "pre_cadastro_seguro"
        }
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Erro na comunicação com a base segura');
    }

    return await response.json();
  } catch (error) {
    console.error("Erro no registro E2EE:", error);
    throw error;
  }
}
