<div align="center" id="inicio">
  <picture>
  <img alt="Logo Route Books" src="imgs/rb-logo2.png" width="550">
  </picture>
  
  #  Dicas para mochileiros e viajantes
  ### Centro Paula Souza
  ### Faculdade de Tecnologia de Jahu - FATEC JAHU 
  ### Curso de Tecnologia em Desenvolvimento de Software Multiplataforma
  ### Feito por Lucas Eduardo e Tiago Augusto 
  ### Jaú-SP, Brasil. 
  ### Início: 1º Semestre / 2025
  # Documento da aplicação web
</div>

<details><summary><h1>Sumário</h1></summary>

  - [1. Resumo da aplicação web](#1-resumo-da-aplicação-web)
    - [1.1. Objetivos](#11-objetivos)
    - [1.2 Métodos da pesquisa](#12-métodos-da-pesquisa)
  - [2. Documento de requisitos](#2-documento-de-requisitos)
    - [2.1. Requisitos funcionais](#21-requisitos-funcionais)
    - [2.2. Requisitos não funcionais](#22-requisitos-não-funcionais)
  - [3. Regras de negócio](#3-modelo-de-negócios)
    - [3.1. O que será elaborado?](#31-o-que-será-elaborado)
    - [3.2. Como será elaborado?](#32-como-será-elaborado)
    - [3.3. Para quem será elaborado?](#33-para-quem-será-elaborado)
    - [3.4. Quanto custará?](#34-quanto-custará)
  - [4. Estudo de viabilidade](#4-estudo-de-viabilidade)
  - [5. Design](#5-design)
  - [6. Caso de uso](#6-caso-de-uso)
  - [7. Modelo lógico (BD)](#7-modelo-lógico)
  - [8. Protótipo](#8-protótipo)
  - [9. Aplicação](#9-aplicação)
  - [10. Considerações finais](#10-considerações-finais)
  - [11. Referências bibliográficas](#11-referências-bibliográficas)
</details>

# 1. Resumo da aplicação web
Este projeto tem por objetivo facilitar que pessoas apaixonadas por lugares históricos e bonitos, consigam achar grandes aventuras, com dicas sobre pontos turísticos, restaurantes tradicionais, entre outras variedades. Falaremos sobre pontos REGIONAIS, NACIONAIS E DO MUNDO. A ideia é que a plataforma seja de utilização simples, com informações claras e objetivas, que não deixe os clientes confusos ou perdidos (Pesquisar determinado local e achar ele com agilidade)
Utilizamos alguns sites que existem nesta área e juntamos com nosso interesse por lugares turísticos, que contam sua história e valorizam o que tem.

## 1.1. Objetivos
USUÁRIOS/CLIENTES: 
Facilitar que pessoas apaixonadas por lugares históricos e bonitos com belas histórias, consigam achar grandes aventuras, com dicas sobre pontos turísticos, restaurantes tradicionais, entre outras variedades.


EMPRESA/EQUIPE
Fortalecer a marca, se colocando no mercado.
A nossa felicidade é deixar os nossos clientes satisfeitos e encantados, críticas são bem-vindas para a melhoria da equipe e do nosso Website, para que problemas sejam resolvidos e nossa evolução seja contínua.
 

## 1.2. Métodos da pesquisa
A pesquisa e o desenvolvimento do projeto estão sendo realizados com o apoio da infraestrutura disponibilizada pela Fatec de Jahu. As atividades ocorrem tanto durante as aulas quanto nos períodos livres, utilizando os computadores dos laboratórios da instituição, bem como os computadores pessoais dos integrantes da equipe. 

As tecnologias utilizadas até o momento incluem HTML, CSS, JS, Bootstrap para a construção da interface e estrutura da aplicação. O protótipo visual está sendo desenvolvido por meio da ferramenta Figma, que permite a criação colaborativa de interfaces. Além disso, está sendo utilizada a biblioteca Font Awesome para a inserção de ícones que enriquecem a experiência do usuário. Para o desenvolvimento do back-end, será empregado PHP em conjunto com MySQL e XAMPP. O código é desenvolvido no VS Code e versionado com Git, garantindo organização e controle das alterações.

<h3 align="center">
  <a href="#"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" alt="HTML" align="center" width="35"></a> &nbsp;&nbsp;
  <a href="#"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" alt="CSS" align="center" width="35"></a> &nbsp;&nbsp;
  <a href="#"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" 
  alt="JS" align="center" width="35"></a> &nbsp;&nbsp;
  <a href="#"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg" alt="BOOTSTRAP" align="center" width="35"></a> &nbsp;&nbsp;
  <a href="#"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg" alt="PHP" align="center" width="35"></a> &nbsp;&nbsp;
  <a href="#"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" alt="Figma" align="center" width="35"></a> &nbsp;&nbsp;
  <a href="#"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" alt="MySQL" align="center" width="35"></a> &nbsp;&nbsp;
  <a href="#"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" alt="Visual Studio Code" align="center" width="35"></a> &nbsp;&nbsp;
  <a href="#"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" alt="Git" align="center" width="35"></a>
</h3>

Todo o trabalho está sendo conduzido nas dependências da Fatec de Jahu, local que oferece o suporte necessário para o desenvolvimento do projeto. As atividades estão sendo realizadas durante o primeiro semestre do curso, em alinhamento com os conteúdos estudados nas disciplinas, o que possibilita a aplicação prática dos conhecimentos adquiridos em sala de aula. 

[Voltar para o início](#inicio)

# 2. Documento de requisitos
Um documento de requisitos de sistema é um arquivo que descreve o que o sistema deve fazer e como ele deve funcionar. Ele serve para orientar a equipe de desenvolvimento e garantir que todos entendam as necessidades do projeto. Nele estão incluídas as funções principais do sistema, regras importantes e características como segurança e facilidade de uso.

## 2.1. Requisitos funcionais
<details><summary><h3>Requisitos que foram implementados</h3></summary>

### RF1 – Exibir informações da equipe: 
O sistema deve exibir importantes informações pessoais e curriculares equipe, como: Nome, e-mail, mini-currículo, github, Linkedin, celular

### RF2 - Exibir feedback, disponibilizar chat. 
O sistema deve permitir que os usuários enviem feedback com atributos: Id_pontoturistico, data_da_visita, Id_usuário, comentário. Tendo também nas postagens likes para melhor visibilidade (Para ajudar os clientes e a empresa à melhorar)

### RF3 - Cadastrar usuário 
O sistema deve permitir o cadastro de usuários com as informações: Id_usuario, Nome, celular, e-mail, senha, cpf.

### RF4 - Realizar Login do usuário
O sistema deve permitir o login do usuário utilizando informações pessoais cadastradas (E-mail/Nome de usuário e senha).

### RF5 – Disponibilizar uma página de contato 
O sistema deve exibir um formulário de contato com: id_usuario, e-mail, data, comentário e observação. (conter uma área dedicada a ajudar os usuários com dúvidas e problemas.)

### RF6 - Criar Post 
O sistema permite que o usuário faça uma publicação no nosso site, relacionado ao tema principal da aplicação (turismo), assim, podendo relatar experiências, dúvidas... entre outros

### RF7 - Logout
O sistema deve permitir que os usuários possam se desconectar da sua conta.
</details>

<details><summary><h3>Requisitos que serão trabalhados</h3></summary>

### RF8 - Exibir dicas de pontos turísticos e atividades. 
Exibir dicas de pontos turísticos cadastrados no site: nome, descrição, localização etc. (Explorar melhor o lugar que pretende visitar)

### RF9 - Disponibilizar sistema de busca 
O sistema deve permitir busca dos pontos turísticos, por meio de: Local, nome (parte do nome), categoria (restaurante, hotel, cidade, ponto turístico etc.) – Mais agilidade para o cliente

### RF10 - Exibir busca mais populares 
O sistema deve exibir as avaliações mais frequentes: id_pontoturistico, data, localização, comentário (conter um campo onde contenha as postagens mais populares)
</details>



## 2.2. Requisitos não funcionais
<details><summary><h3>Clique para exibir</h3></summary>
  
### RNF1- Usabilidade
A interface do usuário deve ser intuitiva e fácil de usar. 

### RNF2 - Manutenibilidade
O código do sistema deve ser bem documentado e fácil de entender. 

### RNF3 - Desempenho
O tempo de resposta para mudanças de telas tem que ser em até 5 segundos

### RNF4 - Segurança/Confiabilidade
O sistema deve proteger os dados dos usuários contra acesso não autorizado. 

### RNF5 - Disponibilidade
O sistema deve estar disponível 24x7x30 (100%) do tempo. 

### RNF6 - Acessibilidade 
O sistema possui um modo escuro para facilitar a visualização da aplicação.
</details>

[Voltar para o início](#inicio)

# 3. Modelo de negócios

Na Figura 1, podemos visualizar o modelo de negócios, utilizado para melhor identificação do que o projeto oferece, como estrutura, canais, parceiros...

<div align="center">

### Figura 1 - Canvas, modelo de negócios

</div>

<div align="center">
    <img src="./imgs/Modelo de Negócios - P.I.png" alt="Figura 1 - Canvas, modelo de negócios" width="550">
</div>

## 3.1. O que será elaborado?
### Proposta de valor:
  - Ferramentas de gestão
  - Tempo de desenvolvimento
  - Design personalizado
  - Integrações extras
  - Manutenção pós-lançamento
  - Responsividade
  - Filtros personalizados para encontrar a viagem ideal.
  - Informações detalhadas sobre destinos turísticos, atrações e atividades.

## 3.2. Como será elaborado?
### Parcerias principais:
  - Empresas locais
  - Eventos de turismo (ex: AVIRRP) 
  - Parcerias com empresas confiáveis 
### Atividades principais:
  - Dicas para o público
  - Divulgar locais (EX: PONTOS TURÍSTICOS, RESTAURANTES.)
  - Desenvolvimento da plataforma.
### Recursos principais:
  - Internet
  - Equipe de desenvolvimento
  - Notebooks/PC
  - Ferramentas de desenvolvimento web
  - Conteúdo e informações
  - PlaTaforma de hospedagem

## 3.3. Para quem será elaborado?
### Segmento de clientes
  - Residentes locais - Jaú
  - Patrocinadores
  - Empresas locais - Jaú
  - Turistas
  - Mochileiros
### Relacionamento com o cliente: 
  - Atendimento ao cliente (E-mail)
  - Comunicação proativa
  - Feedback do usuário
  - Avaliação de postagens.
### Canais: 
  - Website;
  - Redes sociais;
  - Recomendações pessoais;

## 3.4. Quanto custará?
### Estrutura de custos: 
  - Desenvolvimento e manutenção da plataforma 
  - Tempo
  - Infraestrutura
  - Hospedagem  
  - Domínio 
  - Registro e renovação do domínio
### Fontes de renda: 
  - Publicidade e Anúncios (Ads)
  - Programas de afiliados

[Voltar para o início](#inicio)


# 4. Estudo de viabilidade
### Viabilidade técnica: 
Sim, temos os equipamentos necessários fornecidos pela FATEC JAHU, computadores, internet, ferramentas web e um ambiente adequado para a realização do projeto.

### Viabilidade financeira: 
É viável pelo fato que vai ser mão de obra dos integrantes do grupo, não iremos contratar ninguém de fora no momento. Ele irá nos retornar um aprendizado muito grande nessa área e uma bela evolução.

### Viabilidade de mercado: 
Foi feita à análise, no começo erámos uma vitrine para viagens e percebemos que já existiam muitas nesse mesmo estilo, então nos renovamos, pegamos um nicho em específico e hoje somos um tipo de blog/guia turístico para relatos de mochileiros(as), empresas, entre outros, que gostam de viajar e divulgar o seu trabalho e conhecer o que aquele lugar os oferece.

### Viabilidade operacional: 
Até o momento sim, não foram exigidas tantas atividades agora de início, então a organização, suporte e armazenamento está tudo correto.
Agora iremos implementar mais atividades, como Banco de dados ao projeto, JavaScript, PHP e outras tecnologias ao decorrer dos semestres

[Voltar para o início](#inicio)

# 5. Design
### Paleta de cores:

| Nome          | Hexadecimais                      |
|---------------|-----------------------------------|
| TONS DE VERDE | #005940, #00DE90, #00FA85, #04B885, #68d6a3, #48b281 |
| TOM DE AZUL | #00EEFF |
| TOM DE MARROM | #998874 |
| PRETO | #000000 |
| BRANCO | #FFFFFF|


### Tipografia: 

| **Fonte** | **Utilidade** |
|------------|---------------|
| Rubik | Para títulos |
| Nunito | Para páginas envolvendo cadastro, login e esqueci senha |
| Roboto | Para textos gerais da aplicação |


- [Rubik - Google Fonts](https://fonts.google.com/specimen/Rubik)
- [Nunito - Google Fonts](https://fonts.google.com/specimen/Nunito)
- [Roboto - Google Fonts](https://fonts.google.com/specimen/Roboto)


### Logo:
 
As figuras 2 apresentadas, são as logos do nosso projeto, uma com a escrita em preto e outra com a escrita em branco, pensada para diferentes fundos.

<div align="center">

### Figura 2 - Logotipo

</div>
<div align="center">
    <img src="./imgs/logo.jpg" alt="logo" width="250">
    <img src="./imgs/logo1.jpg" alt="logo 1" width="250">
</div>


### Modelo de navegação:
Representação do nosso modelo de navegação, utilizada para observar como o sistema funciona, quais caminhos e processos existem dentro da aplicação.

```mermaid
    flowchart TD
    homePage["Home Page"] --> sobre(["Sobre"]) & contato(["Contato"]) & criarPost(["Criar Post"]) & perfil(["Perfil"])  & login(["Login"]) & verPosts(["Ver Posts"])
    login --> cadastro(["Cadastro"]) & esqueceuSenha(["Esqueceu Senha"])
    esqueceuSenha --> alterarSenha(["Alterar Senha"])
    perfil --> editarperfil(["Editar perfil"])
    verPosts(["Ver Posts"]) --> posts(["Posts"])  
    

    style sobre stroke-width:2px,stroke-dasharray: 0
```

[Voltar para o início](#inicio)



# 6. Caso de uso 

CASO DE USO EXPANDIDO

BAIXO NÍVEL

CADASTRO :

Caso de uso: Cadastrar usuário no sistema
Atores: Usuário
Finalidade: Registrar usuários ao sistema para que eles possam utilizar de forma mais ampla o sistema
Visão geral: O usuário após acessar nosso site, ele poderá fazer o login, mas caso ele não tenha um registro, ele tem a oportunidade, ao clicar no link "Cadastre-se já!", de se cadastrar e informar dados básicos no sistema (Nome, e-mail, senha, país, cidade...) e ter sua conta pronta para uso.
Tipo: Primário
Referências cruzadas: RF3 - Cadastrar usuário
Ação do ator:
1. Começa com o visitante acessando o sistema
3. Ele pode já fazer o login (caso já tenha um registro), mas no caso de uma primeira visita, ele clica no link que o leva para o cadastro
4. Registra seus dados (Nome, e-mail, senha, cidade...)
5. Finaliza o registro
7. Terá sua conta pronta para ser utilizada

Resposta do sistema:
- O sistema exibe o formulário
- O Sistema valida os dados
- O sistema salva os dados do usuário
- O sistema cria sua conta

============================================================================

CRIAR POST:

Caso de uso: Criar um post sobre a sua experiência
Atores: Usuário e Admin
Finalidade: Que o usuário possa relatar a sua experiência turística e publicar em nosso site
Visão geral: O usuário após se cadastrar e realizar o login (e-mail e senha), ele está permitido a fazer uma publicação sobre turismo, basta clicar no botão "Criar Post" no canto superior direito, e você vai poder especificar em tipo (Gastrônomico, esporte, cultural...) e a categoria da sua postagem (Relato, dúvida...) e escrever o seu relato.
Tipo: Primário
Referências cruzadas: RF3 - Cadastrar usuário, RF4 - Realizar Login do usuário e RF6 - Criar Post
Ação do ator:
1. O usuário realiza o login
3. Acessa a homepage e clica no botão no canto superior direito "Criar Post"
4. Adiociona o seu relato e específica o tipo e a categoria da sua publicação
5. Clica em publicar, botão está em verde
7. Sua publicação está finalizado

Resposta do sistema:
- O sistema exibe o formulário para a criação da publicação
- Valida os dados
- O sistema salva o relato
- O sistema exibe sua publicação

============================================================================

ALTO NÍVEL

Caso de uso: Realizar cadastro
Atores: Usuário
Tipo: Primário
Descrição: Permite que um novo usuário (Mochileiro, turista...) crie uma conta no sistema. O sistema solicita dados básicos (nome, email, senha, cidade, país...) e, após a validação, cria o registro no banco de dados.

Caso de uso: Fazer Login
Atores: Usuário
Tipo: Primário
Descrição: Um Usuário registrado fornece suas credenciais (email e senha) para acessar o sistema. O sistema valida as credenciais; se corretas, concede acesso e você já é levado a homepage do sistema.

Caso de uso: Visualizar homepage
Atores: Usuário e Admin
Tipo: Primário
Descrição: Após o login, o sistema apresenta ao Usuário a tela inicial do sistema, que exibe publicações relevantes, opções de lugares, informações sobre o que fazer e informações sobre quem somos.

Caso de uso: Criar Post
Atores: Usuário
Tipo: Primário
Descrição: O usuário após se cadastrar e realizar o login, ele está permitido a fazer uma publicação sobre turismo, você pode especificar em tipo (Gastrônomico, esporte, cultural...) e a categoria da sua postagem (Relato, dúvida...).

Caso de uso: Gerenciar Perfil
Atores: Admin e Usuário
Tipo: Primário
Descrição: O usuário e admin tem seus perfis, onde é possível atualizar suas informações e foto. (TERÁ MAIS FUNÇÕES, mas até o momento é isso).

Caso de uso: Excluir/Editar postagens próprias
Atores: Usuários
Tipo: Primário
Descrição: O usuário pode excluir ou editar postagens dentro do site, alguns do motivos pode ser por erros ortográficos, não achou atrativo a postagem, entre outros.

Caso de uso: Denunciar contéudo
Atores: Usuário e Admin
Tipo: Primário
Descrição: O usuário pode denunciar um conteúdo, por algum motivo coerente, e o admin irá avaliar se aquela postagem poderá continuar dentro do site.

Caso de uso: Buscar postagens/usuários
Atores: Usuário e admin
Tipo: Primário
Descrição: O admin e o usuário podem utilizar o sistema de busca que existe dentro do sistema para facilitar o encontro de usuários e postagens existentes.

Caso de uso: Seguir outro usuário
Atores: Usuário
Tipo: Primário
Descrição: O usuário pode se conectar com outras pessoas, assim, criando networking, amizades, aprendizados e experiências.

Caso de uso: Comentar em postagens
Atores: Usuário
Tipo: Primário
Descrição: O usuário pode dar a sua pequena visão sobre o assunto comentado em postagens de outros usuários.

Caso de uso: Curtir postagens
Atores: Usuário
Tipo: Primário
Descrição: O usuário pode avaliar a postagem de outro usuário.

Na figura 3, é visto o modelo de caso de uso geral da nossa aplicação, que demonstra como será feito todo o processo com um visitante, para que ele vire um usuário e as funçõoes do admin. O caso de uso de baixo e alto nível está especificado.

<div align="center">

### Figura 3 - Modelo de caso de uso 

</div>

  <div align="center">
    <img src="./imgs/Cópia do diagrama-caso-de-uso-atualizacao.drawio.png" alt="Figura 3 - Caso de uso" width="550">
  </div>

[Voltar para o início](#inicio)


# 7. Modelo Lógico 
Na figura 4, podemos ver o modelo lógico do nosso sistema, a modelagem do banco de dados, com todas as tabelas e relacionamentos necessários

<div align="center">

### Figura 4 - Modelo Lógico (Modelagem do banco de dados)

</div>

  <div align="center">
    <img src="./imgs/modelagem-PI-completa 1.png" alt="Figura 4 - Modelo Lógico" width="550">
  </div>

[Voltar para o início](#inicio) 



# 8. Protótipo
- ### Link dos protótipos com a ferramenta Figma: [Figma - Route Books](https://www.figma.com/design/8UFfrEyZOdytMzzJvd0jSB/Mockup-do-site-PI?node-id=0-1&p=f&t=6UuWB1YErd0NN2MF-0)


Na figura 5, é possível visualizar o protótipo da homepage, de como ela seria na aplicação final (Fizemos mais telas, mas coloquei apenas uma para visualização).

<div align="center">

### Figura 5 - Protótipo da home

</div>

  <div align="center">
    <img src="./imgs/prototipo_home.png" alt="Figura 5 - Prototipo" width="550">
  </div>


# 9. Aplicação
- ### Link para o nosso repositório do GitHub: [Repositório - PI-ROUTE-BOOKS](https://github.com/Guilherme-RR/PI-Route-Books)

A aplicação Route Books, visa facilitar o encontro de pontos turísticos regionais, nacionais e mundiais e atividades atrativas, com as experiências contatadas pelas pessoas que viveram essas aventuras. Assim, tendo uma aplicação mais interativa e com a oportunidade de criar uma boa networking e ser um site informativo para ajudar todos os públicos.  


# 10. Considerações finais
O processo de desenvolvimento foi tudo dentro dos conformes, todos os integrantes foram participativos em diferentes áreas do projeto, protótipos, html, css, documentação, entre outros. No início, tínhamos uma ideia de ser uma vitrine de viagens, com o objetivo de mostrar as agências mais confiáveis para viagens dentro ou fora do Brasil, mas após algumas reuniões decidimos mudar o escopo do nosso projeto, assim se transformando em um guia de viagens, um site para que as pessoas possam dar seus feedbacks e contar suas experiências para os demais, sobre determinados locais e com diferentes culturas, na qual as pessoas podem se interessar e querer viver essa experiência. Ocorreram algumas limitações, principalmente com a internet da instituição, em alguns momentos não conseguíamos progredir ou até concluir certas partes do projeto, as máquinas de alguns laboratórios também eram lentos, então ficava difícil trabalhar, mas conseguimos avançar, pelo fator que fazíamos em casa, isso ajudava. Tivemos algumas dificuldades, algo normal, porque muitos assuntos e tarefas foram novidades para alguns integrantes, fazendo com que ficássemos com um pouco de receio de errar, fazer errado. A aplicação terá um papel importante para o conhecimento de novos costumes, origens, histórias e importância para os integrantes do grupo, fazer um projeto desse envolve muita paciência e dedicação, isso faz com que criemos um certo tipo de maturidade e acostumados com esse tipo de vivência.  

[Voltar para o início](#inicio)



# 11. Referências bibliográficas
ATLASSIAN. Trello. 2025. Disponível em: [https://trello.com/](https://trello.com/) <br>
FIGMA, Inc. Figma: the collaborative interface design tool. 2025. Disponível em: [https://www.figma.com/](https://www.figma.com/) <br>
BOOTSTRAP. Disponível em: [https://getbootstrap.com/docs/5.3/getting-started/introduction/  ](https://getbootstrap.com/docs/5.3/getting-started/introduction/  )<br>
FONTAWESOME. Disponível em: [https://fontawesome.com/ ](https://fontawesome.com/ )<br>
EMOJIPEDIA. Diposnível em: [ https://emojipedia.org/ ]( https://emojipedia.org/ )<br>
MAIKON.BIZ. Criador de personas. Disponível em: [Maikon.biz: https://maikon.biz/gerador-de-personas/](https://maikon.biz/gerador-de-personas/)

# Inspirações e referências
MOCHILEIROS. Disponível em: [ https://www.mochileiros.com/    ]( https://www.mochileiros.com/    )<br>
TRIPADVISOR. Disponível em: [https://www.tripadvisor.com.br/ ](https://www.tripadvisor.com.br/ )<br>
HOME TOUR. Disponível em: [https://hometour.com.br/](https://hometour.com.br/)

[Voltar para o início](#inicio)

<hr>

## 🌍 Route Books

**Route Books** é um blog colaborativo feito com HTML e CSS, criado para mochileiros e aventureiros que amam explorar o mundo. A plataforma permite que os usuários compartilhem experiências de viagem, ofereçam dicas, tirem dúvidas e montem roteiros personalizados — tudo isso em uma comunidade apaixonada por descobrir novos destinos.


## ✨ Funcionalidades

- 📖 Compartilhamento de relatos de viagem
- 💬 Seção para dicas e perguntas entre mochileiros
- 🗺️ Criação e organização de roteiros personalizados
- 🎒 Interface amigável e responsiva para fácil navegação
- 🧭 Layout pensado para valorizar o espírito aventureiro


## 📸 Imagens do Projeto

![image](https://github.com/user-attachments/assets/d2f13507-4625-4493-af23-89d414f8ab60)

**Home Page**

![image](https://github.com/user-attachments/assets/ed06f436-e839-45db-9f96-277ce3b842b3)

**Tela de Perfil de Usuário**

![image](https://github.com/user-attachments/assets/74350e2e-3895-42d5-a186-55f4666f2e75)

**Tela de Login**

## 🚀 Como Usar
  
1. Abra seu o Prompt de comando ou o Windows PowerShell.

2. Em um dos programas citados acima, use o comando 'cd ..' até ir para a pasta 'C:', normalmente o comando 'cd ..' precisará ser usado 2 vezes.

3. Estando na pasta 'C:' cole esse comando 'git clone https://github.com/TiagoGrizzo/PI-Route-Books', lembrando que esse comando funcioná somente caso já tenha sido baixado o git no seu computador.

4. Depois de usar o comando citado no passo de cima, entra na pasta do projeto, use o comando 'cd PI-Route-Books'.

5. Agora você pode ir nos arquivos do seu computador usando o explorador de arquivos e por la voce pode até a pasta que você fazendo os passos acima, de dois cliques no arquivo chamado 'index.html' e abra ele com o navegador de sua preferência.

6. Pronto! Agora você pode conferir nosso projeto.