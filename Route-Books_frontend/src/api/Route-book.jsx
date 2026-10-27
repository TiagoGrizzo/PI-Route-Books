import axios from "axios";

const API_URL = "http://localhost:5123";

const api = axios.create({
    baseURL: `${API_URL}/api`,
    withCredentials: true, // Permite o envio de cookies e sessões (importante para o seu cookie do JWT)
    headers: {
        "Content-Type": "application/json"
    }
});

// URL base da API (usada para montar imagens de posts enviadas: /imgs/posts-usuarios/...)
export const API_BASE_URL = API_URL;

//Rotas de Usuários 

// GET: api/Usuarios
export const getUsuarios = () => api.get("/Usuarios");

// GET: api/Usuarios/{id}
export const getUsuarioById = (id) => api.get(`/Usuarios/${id}`);

// POST: api/Usuarios (Cadastro)
export const createUser = (payload) => api.post("/Usuarios", payload);

// PUT: api/Usuarios/{id} (Atualizar dados)
export const updateUser = (id, payload) => api.put(`/Usuarios/${id}`, payload);

// DELETE: api/Usuarios/{id} (Excluir)
export const deleteUser = (id) => api.delete(`/Usuarios/${id}`);

// POST: api/Usuarios/login
export const login = (payload) => api.post("/Usuarios/login", payload);

// POST: api/Usuarios/esqueceu-senha
export const esqueceuSenha = (payload) => api.post("/Usuarios/esqueceu-senha", payload);

// POST: api/Usuarios/nova-senha
export const novaSenha = (payload) => api.post("/Usuarios/nova-senha", payload);

// GET: api/Usuarios/{id}/dashboard-info
export const getDashboardInfo = (id) => api.get(`/Usuarios/${id}/dashboard-info`);

//Rotas de Posts

// GET: api/Posts (lista de posts, com busca opcional via ?busca=)
export const getPosts = (busca) => api.get("/Posts", { params: busca ? { busca } : {} });

// GET: api/Posts (retorna os últimos posts)
export const getUltimosPosts = (busca) => api.get("/Posts", { params: busca ? { busca } : {} });

export const createPost = (formData) => api.post('/Posts', formData, { 
    headers: { 'Content-Type': 'multipart/form-data' } 
});
// GET: api/Posts/create (Busca categorias, tipos e rascunho para a tela de criação)
export const getCreatePostData = () => api.get("/Posts/create");

// GET: api/Posts/{id}
export const getPostById = (id) => api.get(`/Posts/${id}`);

//Rotas de Chat

// GET: api/Chat/historico?meuId=..&idDoAmigo=..
export const getChatHistorico = (meuId, idDoAmigo) => api.get("/Chat/historico", { params: { meuId, idDoAmigo } });

// POST: api/Chat/enviar
export const enviarMensagem = (mensagem) => api.post("/Chat/enviar", mensagem);

// GET: api/Chat/nao-lidas/{usuarioId}
export const getNaoLidas = (usuarioId) => api.get(`/Chat/nao-lidas/${usuarioId}`);

// POST: api/Home/enviar-contato
export const enviarContato = (dados) => api.post("/Home/enviar-contato", dados);

export default api;
