import '../assets/css/sobre.css';
import logoSobre from '../assets/imgs/rb-logo1.png';
import fotoLucas from '../assets/imgs/foto_perfil3.jpg';
import fotoTiago from '../assets/imgs/perfil-tiago.jfif';

export default function Sobre() {
  return (
    <section>
      <section className="container-xxl mt-4">
        <div className="sobre-geral">
          <h1 className="titulo-font">QUEM SOMOS?</h1>
          <div className="sobre-texto-geral">
            <div className="sobre-texto">
              <h3 className="titulo-font">Route Books - Conheça nossa equipe!</h3>
              <p>
                Conheça melhor a equipe desenvolvedora do site, composta por 2 integrantes da Fatec Jahu.
              </p>
              <div className="sobre-redes">
                <i className="fa fa-instagram" aria-hidden="true"></i>
                <i className="fa fa-facebook-official" aria-hidden="true"></i>
              </div>
            </div>
            <div className="logo-sobre">
              <img id="logoSobre" src={logoSobre} alt="Logo Route Books" />
            </div>
          </div>
        </div>

        <div className="sobre-geral-integrantes">
          <div className="sobre-integrantes">
            <h1 className="titulo-font">INTEGRANTES</h1>
          </div>

          <div className="sobre-integrantes">
            <div className="sobre-texto">
              <h3 className="titulo-font">Lucas Eduardo</h3>
              <p>
                Olá, pessoal! Me chamo Lucas Eduardo, tenho 20 anos, estudante na Fatec Jahu em Desenvolvimento de Software
                Multiplataforma, estou cursando o 4º semestre e participo ativamente no processo deste website, tanto na
                parte de documentação, protótipos e desenvolvimento web. Tenho o sonho de seguir na área de tecnologia e
                sou um grande admirador de histórias, culturas e paisagens, por isso tenho o prazer de trabalhar para este
                projeto.
              </p>
              <div className="sobre-redes">
                <a href="https://www.instagram.com/lukinhaepc/" target="_blank" rel="noreferrer"><i className="fa fa-instagram" aria-hidden="true"></i></a>
                <a href="https://www.linkedin.com/in/lucas-eduardo-pereira-da-cruz-a2b399351/" target="_blank" rel="noreferrer"><i className="fa fa-linkedin-square" aria-hidden="true"></i></a>
                <a href="https://github.com/LucasEduardoPereiraCruz" target="_blank" rel="noreferrer"><i className="fa fa-github" aria-hidden="true"></i></a>
              </div>
            </div>
            <div className="perfil-sobre-integrantes">
              <img src={fotoLucas} alt="Foto Lucas" />
            </div>
          </div>

          <div className="sobre-integrantes">
            <div className="sobre-texto">
              <h3 className="titulo-font">Tiago Grizzo</h3>
              <p>
                Sou o Tiago, tenho 20 anos e estudo na Fatec Jahu no curso de Desenvolvimento De Software Multiplataforma.
                Assim como o outros membros participei ativamente nas partes de documentação do projeto, produção do
                protótipo e na construção deste website.
              </p>
              <div className="sobre-redes">
                <a href="https://www.instagram.com/_taggrizzo/" target="_blank" rel="noreferrer"><i className="fa fa-instagram" aria-hidden="true"></i></a>
                <a href="https://www.linkedin.com/in/tiago-grizzo-781755351/" target="_blank" rel="noreferrer"><i className="fa fa-linkedin-square" aria-hidden="true"></i></a>
                <a href="https://github.com/TiagoGrizzo" target="_blank" rel="noreferrer"><i className="fa fa-github" aria-hidden="true"></i></a>
              </div>
            </div>
            <div className="perfil-sobre-integrantes">
              <img src={fotoTiago} alt="Foto Tiago" />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
