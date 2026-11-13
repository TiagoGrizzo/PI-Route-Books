import axios from "axios";

// Mantendo a sessão e os uploads na mesma origem do site.
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const api = axios.create({
    baseURL: `${API_URL}/api`,
    withCredentials: true, // Permite o envio de cookies e sessões (importante para o seu cookie do JWT)
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.response.use(response => response, error => {
    if (error.response?.status === 401 && !['/Usuarios/login', '/Usuarios/sessao'].includes(error.config?.url)) {
        localStorage.removeItem('UsuarioId');
        localStorage.removeItem('NomeUsuario');
        error.response.data = { mensagem: 'Sua sessão expirou. Entre novamente para continuar.' };
        window.dispatchEvent(new Event('routebooks-session-expired'));
    }
    return Promise.reject(error);
});

export const getComunidades = () => api.get('/comunidades');
export const getComunidade = slug => api.get('/comunidades/' + encodeURIComponent(slug));
export const participarComunidade = (slug, participar) => api.put('/comunidades/' + encodeURIComponent(slug) + '/membros', { participar });

// URL base da API (usada para montar imagens de posts enviadas: /imgs/posts-usuarios/...)
export const API_BASE_URL = API_URL;

//Rotas de Usuários 

// GET: api/Usuarios
export const getAventureiros = () => api.get('/perfis');
export const getUsuarios = () => api.get("/Usuarios");

// GET: api/Usuarios/{id}
export const getUsuarioById = (id) => api.get(`/Usuarios/${id}`);
export const getUsuariosSeguidos = () => api.get("/Usuarios/relacoes/seguindo");
export const seguirUsuario = (id) => api.post(`/Usuarios/${id}/seguir`);
export const deixarDeSeguirUsuario = (id) => api.delete(`/Usuarios/${id}/seguir`);

// POST: api/Usuarios (Cadastro)
export const createUser = (payload) => api.post("/Usuarios", payload);

// PUT: api/Usuarios/{id} (Atualizar dados)
export const updateUser = (id, payload) => api.put(`/Usuarios/${id}`, payload);

// DELETE: api/Usuarios/{id} (Excluir)
export const deleteUser = (id) => api.delete(`/Usuarios/${id}`);

// POST: api/Usuarios/login
export const login = (payload) => api.post("/Usuarios/login", payload);
export const getSessao = () => api.get('/Usuarios/sessao');
export const logout = () => api.post("/Usuarios/logout");

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

export const createPost = (formData) => api.post('/Posts', formData, { headers: { 'Content-Type': undefined } });
// GET: api/Posts/create (Busca categorias, tipos e rascunho para a tela de criação)
export const getCreatePostData = () => api.get("/Posts/create");

// GET: api/Posts/{id}
export const getPostById = (id) => api.get(`/Posts/${id}`);

//Rotas de Chat

// GET: api/Chat/historico?meuId=..&idDoAmigo=..
export const getConversas = () => api.get('/Chat/conversas');
export const getChatHistorico = (meuId, idDoAmigo) => api.get("/Chat/historico", { params: { meuId, idDoAmigo } });

// POST: api/Chat/enviar
export const enviarMensagem = (mensagem) => api.post("/Chat/enviar", mensagem);

// GET: api/Chat/nao-lidas/{usuarioId}
export const getNaoLidas = (usuarioId) => api.get(`/Chat/nao-lidas/${usuarioId}`);

// POST: api/Home/enviar-contato
export const enviarContato = (dados) => api.post("/Home/enviar-contato", dados);

export default api;

export const votarPost = (id, valor) => api.put('/Posts/' + id + '/voto', { valor });
export const getComentarios = id => api.get('/Posts/' + id + '/comentarios');
export const comentarPost = (id, payload) => api.post('/Posts/' + id + '/comentarios', payload);
export const getTemporadas = () => api.get('/temporadas');
export const getPerfilPublico = id => api.get('/perfis/' + id);
export const getPostsPerfil = (id, aba) => api.get('/perfis/' + id + '/posts', { params: { aba } });
export const editarPerfil = dados => api.patch('/perfis/me', dados, { headers: { 'Content-Type': undefined } });
