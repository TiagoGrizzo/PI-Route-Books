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
  - [6. Protótipo](#6-protótipo)
  - [7. Aplicação](#7-aplicação)
  - [8. Considerações finais](#8-considerações-finais)
  - [Referências bibliográficas](#referências-bibliográficas)
</details>

# 1. Resumo da aplicação web
Este projeto tem por objetivo facilitar que pessoas apaixonadas por lugares históricos e bonitos, que consigam achar grandes aventuras, com dicas sobre pontos turísticos, restaurantes tradicionais, entre outras variedades. A ideia é que a plataforma seja de utilização simples, com informações claras e objetivas, que não deixe os clientes confusos ou perdidos (Pesquisar determinado local e achar ele com agilidade)
Utilizamos alguns sites que existem nesta área e juntamos com nosso interesse por lugares turísticos, que contam sua história e valorizam o que tem.

## 1.1. Objetivos
USUÁRIOS/CLIENTES: 
Facilitar que pessoas apaixonadas por lugares históricos e bonitos com belas histórias, consigam achar grandes aventuras, com dicas sobre pontos turísticos, restaurantes tradicionais, entre outras variedades.


EMPRESA/EQUIPE
Fortalecer a marca, se colocando no mercado.
A nossa felicidade é deixar os nossos clientes satisfeitos e encantados, críticas são bem-vindas para a melhoria da equipe e do nosso Website, para que problemas sejam resolvidos e nossa evolução seja contínua.
 

## 1.2. Métodos da pesquisa
A pesquisa e o desenvolvimento do projeto estão sendo realizados com o apoio da infraestrutura disponibilizada pela Fatec de Jahu. As atividades ocorrem tanto durante as aulas quanto nos períodos livres, utilizando os computadores dos laboratórios da instituição, bem como os computadores pessoais dos integrantes da equipe. 

As tecnologias utilizadas até o momento incluem HTML, CSS, Bootstrap para a construção da interface e estrutura da aplicação. O protótipo visual está sendo desenvolvido por meio da ferramenta Figma, que permite a criação colaborativa de interfaces. Além disso, está sendo utilizada a biblioteca Font Awesome para a inserção de ícones que enriquecem a experiência do usuário. Para o desenvolvimento do back-end, será empregado PHP em conjunto com MySQL e XAMPP. O código é desenvolvido no VS Code e versionado com Git, garantindo organização e controle das alterações.

<h3 align="center">
  <a href="#"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" alt="HTML" align="center" width="35"></a> &nbsp;&nbsp;
  <a href="#"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" alt="CSS" align="center" width="35"></a> &nbsp;&nbsp;
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
O sistema deve permitir que os usuários enviem feedback com atributos: Id_pontoturistico, data_da_visita, Id_usuário, comentário. (Para ajudar os clientes e a empresa à melhorar)

### RF3 - Cadastrar usuário 
O sistema deve permitir o cadastro de usuários com as informações: Id_usuario, Nome, celular, e-mail, senha, cpf.

### RF4 - Realizar Login do usuário
O sistema deve permitir o login do usuário utilizando informações pessoais cadastradas (E-mail/Nome de usuário e senha).

### RF5 - – Disponibilizar uma página de contato 
O sistema deve exibir um formulário de contato com: id_usuario, e-mail, data, comentário e observação. (conter uma área dedicada a ajudar os usuários com dúvidas e problemas.)
</details>

<details><summary><h3>Requisitos que serão trabalhados</h3></summary>

### RF6 - Exibir dicas de pontos turísticos e atividades. 
Exibir dicas de pontos turísticos cadastrados no site: nome, descrição, localização etc. (Explorar melhor o lugar que pretende visitar)

### RF7 - Disponibilizar sistema de busca 
O sistema deve permitir busca dos pontos turísticos, por meio de: Local, nome (parte do nome), categoria (restaurante, hotel, cidade, ponto turístico etc.) – Mais agilidade para o cliente

### RF8 – Verificar Avaliação de postagem por outros usuários
O sistema deve exibir avaliações realizadas com: id_pontoturistico, data, localização, nota_avaliação (algo mais?) – (Para ajudar a pessoa a entender o lugar e o local que ela irá, o que tem, pontos turísticos, entre outros)

### RF9 - Exibir busca mais populares 
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
</details>

[Voltar para o início](#inicio)

# 3. Modelo de negócios
### Figura 1 - Canvas, modelo de negócios:

<div align="center">
    <img src="./imgs/modelo_canva.png" alt="Figura 1 - Canvas, modelo de negócios" width="550">
</div>

## 3.1. O que será elaborado?
### Proposta de valor:
  - Ferramentas de gestão
  - Tempo de desenvolvimento
  - Design personalizado
  - Integrações extras
  - Manutenção pós-lançamento
  - Responsividade avançada
  - Filtros personalizados para encontrar a viagem ideal.
  - Informações detalhadas sobre destinos turísticos, atrações e atividades.

## 3.2. Como será elaborado?
### Parcerias principais:
  - Empresas locais
  - Eventos de turismo (ex: AVIRRP) 
  - Parcerias com fornecedores confiáveis 
### Atividades principais:
  - Suporte ao cliente 
  - Divulgar locais (EX: PONTOS TURÍSTICOS, RESTAURANTES.)
  - Desenvolvimento da plataforma.
### Recursos principais:
  - Internet
  - Equipe de desenvolvimento
  - Notebooks/pc
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
  - Vendas de produtos próprios
  - Programas de fidelidade 

[Voltar para o início](#inicio)


# 4. Estudo de viabilidade
### Viabilidade técnica: 
Sim, temos os equipamentos necessários fornecidos pela FATEC JAHU, computadores, internet, ferramentas web e um ambiente adequado para a realização do projeto.

### Viabilidade financeira: 
É viável pelo fato que vai ser mão de obra nossa, não iremos contratar ninguém. Ele irá nos retornar um aprendizado muito grande nessa área e uma bela evolução.

### Viabilidade de mercado: 
Foi feita à análise, no começo erámos uma vitrine para viagens e percebemos que já existiam muitas nesse mesmo estilo, então nos renovamos, pegamos um nicho em específico e hoje somos um tipo de blog/guia turístico para mochileiros(as) que gostam de viajar e conhecer o que aquele lugar os oferece.

### Viabilidade operacional: 
Até o momento sim, não foram exigidas tantas atividades agora de início, então a organização, suporte e armazenamento está tudo correto.
Agora iremos implementar mais atividades, como Banco de dados ao projeto e talvez JavaScript, PHP...

[Voltar para o início](#inicio)

# 5. Design
### Paleta de cores:

| Nome          | Hexadecimais                      |
|---------------|-----------------------------------|
| TONS DE VERDE | #005940, #00DE90, #00FA85, #04B885 |
| TONS DE AZUL | #00EEFF |
| TONS DE VERMELHO | #FFA6A6 |
| PRETO | #000000 |
| BRANCO | #FFFFFF|


### Tipografia: 
- [Rubik - Google Fonts](https://fonts.google.com/specimen/Rubik)
- [Nunito - Google Fonts](https://fonts.google.com/specimen/Nunito)
- [Roboto - Google Fonts](https://fonts.google.com/specimen/Roboto)

  Rubik para títulos. <br>
  Nunito para páginas envolvendo cadastro, login, esqueci senha. <br>
  Roboto para textos gerais da aplicação. 

### Modelo de navegação:
Ainda será feito!!!


[Voltar para o início](#inicio)


# 6. Protótipo
- ### Link dos protótipos com a ferramenta Figma: [Figma - Route Books](https://www.figma.com/design/8UFfrEyZOdytMzzJvd0jSB/Mockup-do-site-PI?node-id=0-1&p=f&t=6UuWB1YErd0NN2MF-0)





## 🌍 Route Books

**Route Books** é um blog colaborativo feito com HTML e CSS, criado para mochileiros e aventureiros que amam explorar o mundo. A plataforma permite que os usuários compartilhem experiências de viagem, ofereçam dicas, tirem dúvidas e montem roteiros personalizados — tudo isso em uma comunidade apaixonada por descobrir novos destinos.


## ✨ Funcionalidades

- 📖 Compartilhamento de relatos de viagem
- 💬 Seção para dicas e perguntas entre mochileiros
- 🗺️ Criação e organização de roteiros personalizados
- 🎒 Interface amigável e responsiva para fácil navegação
- 🧭 Layout pensado para valorizar o espírito aventureiro


## 🛠️ Tecnologias Utilizadas

- **HTML**
- **CSS**
- **BOOTSTRAP**


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

3. Estando na pasta 'C:' cole esse comando 'git clone https://github.com/Guilherme-RR/PI-Route-Books', lembrando que esse comando funcioná somente caso já tenha sido baixado o git no seu computador.

4. Depois de usar o comando citado no passo de cima, entra na pasta do projeto, use o comando 'cd PI-Route-Books'.

5. Agora você pode ir nos arquivos do seu computador usando o explorador de arquivos e por la voce pode até a pasta que você fazendo os passos acima, de dois cliques no arquivo chamado 'index.html' e abra ele com o navegador de sua preferência.

6. Pronto! Agora você pode conferir nosso projeto.
