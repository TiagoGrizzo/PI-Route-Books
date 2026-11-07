import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUser } from '../api/Route-book.jsx';
import '../assets/css/reset.css';
import '../assets/css/style.css';
import '../assets/css/cadastro.css';
import logoCadastro from '../assets/imgs/rb-logo1.png';

export default function Cadastro() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [pais, setPais] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');

  const [regras, setRegras] = useState({
    tamanho: false,
    maiuscula: false,
    minuscula: false,
    numero: false,
    especial: false
  });

  const validarSenha = (valor) => {
    setRegras({
      tamanho: valor.length >= 8 && valor.length <= 30,
      maiuscula: /[A-Z]/.test(valor),
      minuscula: /[a-z]/.test(valor),
      numero: /[0-9]/.test(valor),
      especial: /[^A-Za-z0-9]/.test(valor)
    });
  };

  const senhaValida =
    regras.tamanho &&
    regras.maiuscula &&
    regras.minuscula &&
    regras.numero &&
    regras.especial &&
    confirmarSenha === senha;

  const handleCadastrar = async (e) => {
    e.preventDefault();
    setErro('');

    if (!senhaValida) {
      setErro('A senha não atende aos requisitos de segurança informados.');
      return;
    }

    const payload = {
      Username: username,
      NomeCompleto: nomeCompleto,
      Email: email,
      Telefone: telefone,
      SenhaHash: senha,
      Cidade: cidade,
      Uf: uf,
      Pais: pais
    };

    try {
      const res = await createUser(payload);
      alert(res.data?.mensagem || 'Usuário cadastrado com sucesso!');

      navigate('/login');
    } catch (err) {
      console.error('Erro ao cadastrar usuário:', err);
      setErro(err.response?.data?.mensagem || 'Não foi possível cadastrar o usuário. Tente novamente.');
    }
  };

  const renderizarRegra = (chave, texto) => (
    <div key={chave} className={`regra ${regras[chave] ? 'valido' : 'invalido'}`}>
      <i className="fa fa-times"></i>
      {texto}
    </div>
  );

  return (
    <section className="form-cadastro-geral auth-page auth-cadastro">
      <form onSubmit={handleCadastrar} className="form-cad">
        <div className="logo">
          <img src={logoCadastro} className="logo-cadastro" alt="Logo Route Books" />
        </div>

        <h2 className="titulo-cadastro">Cadastre-se e Aventure-se!</h2>

        {erro && <div className="text-danger" style={{ marginBottom: '15px', fontFamily: 'sans-serif', fontSize: '14px' }}>{erro}</div>}

        <div className="div-inputs">
          <div className="dividir-inputs-1">
            <label htmlFor="Username">Nome de usuário:</label>
            <div className="input-cadastro">
              <i className="fa fa-user-o" aria-hidden="true"></i>
              <input id="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Insira seu nome de usuário..." maxLength="50" required />
            </div>

            <label htmlFor="NomeCompleto">Nome completo:</label>
            <div className="input-cadastro">
              <i className="fa fa-user-o" aria-hidden="true"></i>
              <input id="NomeCompleto" type="text" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} placeholder="Insira seu nome completo..." maxLength="100" required />
            </div>

            <label htmlFor="Email">E-mail:</label>
            <div className="input-cadastro">
              <i className="fa fa-envelope-o" aria-hidden="true"></i>
              <input id="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Insira seu e-mail..." maxLength="150" required />
            </div>

            <label htmlFor="Telefone">Telefone:</label>
            <div className="input-cadastro">
              <i className="fa fa-phone" aria-hidden="true"></i>
              <input id="Telefone" type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="Insira seu número de telefone..." maxLength="20" />
            </div>

            <label htmlFor="SenhaHash">Senha:</label>
            <div className="input-cadastro senha-container">
              <i className="fa fa-lock" aria-hidden="true"></i>
              <input id="SenhaHash" type={mostrarSenha ? 'text' : 'password'} value={senha} onChange={(e) => { setSenha(e.target.value); validarSenha(e.target.value); }} placeholder="Insira sua senha..." maxLength="30" required />
              <button type="button" className="btn-olho" id="btnOlhoSenha" aria-label="Mostrar senha" onClick={() => setMostrarSenha(!mostrarSenha)}>
                <i className={`fa ${mostrarSenha ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>

            <div className="regras-senha">
              <strong>A senha deve conter:</strong>
              {renderizarRegra('tamanho', 'Entre 8 e 30 caracteres')}
              {renderizarRegra('maiuscula', 'Uma letra maiúscula')}
              {renderizarRegra('minuscula', 'Uma letra minúscula')}
              {renderizarRegra('numero', 'Um número')}
              {renderizarRegra('especial', 'Um caractere especial')}
            </div>
          </div>

          <div className="dividir-inputs-2">
            <label htmlFor="Cidade">Cidade:</label>
            <div className="input-cadastro">
              <i className="fa fa-building" aria-hidden="true"></i>
              <input id="Cidade" type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Insira a sua cidade..." maxLength="100" />
            </div>

            <label htmlFor="Uf">Estado (UF):</label>
            <div className="input-cadastro">
              <i className="fa fa-map-marker" aria-hidden="true"></i>
              <input id="Uf" type="text" value={uf} onChange={(e) => setUf(e.target.value)} placeholder="Ex: SP" maxLength="2" />
            </div>

            <label htmlFor="Pais">País:</label>
            <div className="input-cadastro">
              <i className="fa fa-globe" aria-hidden="true"></i>
              <select className="select-uf" value={pais} onChange={(e) => setPais(e.target.value)}>
                <option value="">Selecione</option>
                <option value="Brasil">Brasil</option>
                <option value="Portugal">Portugal</option>
              </select>
            </div>

            <label htmlFor="confirmarSenha">Confirme sua senha:</label>
            <div className="input-cadastro senha-container">
              <i className="fa fa-lock" aria-hidden="true"></i>
              <input id="confirmarSenha" type={mostrarSenha ? 'text' : 'password'} value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} placeholder="Insira novamente sua senha..." maxLength="30" required />
              <button type="button" className="btn-olho" id="btnOlhoConfirmar" aria-label="Mostrar confirmação da senha" onClick={() => setMostrarSenha(!mostrarSenha)}>
                <i className={`fa ${mostrarSenha ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>

            <div id="mensagemConfirmacao" className="mensagem-confirmacao"></div>
          </div>
        </div>

        <div className="div-btn-cadastro">
          <button type="submit" className="btn-cadastrar" id="btnCadastrar">Cadastrar</button>
        </div>

        <br />

        <div className="link-login">
          Já tem uma conta?
          <Link to="/login">Entre já!</Link>
        </div>
      </form>
    </section>
  );
}
