<?php 
session_start();

require_once __DIR__ . '/../models/Conexao.php';
require_once __DIR__ . '/../models/Post.class.php';

$database = new Conexao();
$db = $database->getConexao();
$postObj = new Post($db);

$posts = $postObj->lerTodos();

$temPosts = is_array($posts) && count($posts) > 0;
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Route Books - Seu melhor amigo quando a questão é se aventurar!</title>
    <link rel="stylesheet" href="../css/reset.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" xintegrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDN" crossorigin="anonymous">
    <link rel="stylesheet" href="../css/color.css">
    <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/index.css">
</head>
<body>
<!--INICIO DA NAVBAR DO INDEX-->
<header class="header-navbar">
    <nav class="navbar navbar-expand-lg bg-body-tertiary bg-navbar container-xxl">
        <div class="container-fluid">
            <a class="navbar-brand-text-color-navbar" href="index.php"><img src="../imgs/rb-logo2.png" class="logo-tamanho" alt="Logo Route Books"></a>
            <button class="navbar-toggler bg-color-menu-btn" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active text-color-navbar titulo-font " aria-current="page" href="index.php">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-color-navbar titulo-font" href="sobre.php">Quem Somos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-color-navbar titulo-font" href="contato.php">Contato</a>
                    </li>
                </ul>
                <form class="d-flex barra-pesquisa" role="search">
                    <input class="form-control me-2 search-bar" type="search" placeholder="Pesquisar" aria-label="Search"/>
                    <button class="btn btn-outline-success" type="submit"><i class="fa fa-search" aria-hidden="true"></i></button>
                </form>
            </div>
            
            <div class="dropdown perfil-geral">
                <button class="btn btn-secondary dropdown-toggle btn-perfil" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa fa-user-o" aria-hidden="true"></i>
                    <?php if(isset($_SESSION['username'])) echo " " . htmlspecialchars($_SESSION['username']); ?>
                </button>
                <ul class="dropdown-menu menu-perfil">
                    <li><a class="dropdown-item perfil-item" href="perfil.php">Perfil</a></li>
                    <?php if(isset($_SESSION['usuario_id'])): ?>
                        <li><a class="dropdown-item perfil-item" href="criarpost.php">Criar Postagem</a></li>
                    <?php endif; ?>
                    <li><a class="dropdown-item perfil-item" href="../controllers/UsuarioController.php?acao=logout">Sair da Conta</a></li>
                </ul>
            </div>
            <div class="dark-mode-toggle">
            <button class="btn-dark-mode" onclick="toggleDarkMode()">
                <i class="fa fa-moon-o dark-icon" aria-hidden="true"></i>
                <i class="fa fa-sun-o light-icon" aria-hidden="true"></i>
            </button>
            </div>
        </div>
    </nav>
</header>

<!--FIM DA NAVBAR DO INDEX-->

<!-- MOSTRANDO QUE O POST FOI CRIADO COM SUCESSO -->
<?php if(isset($_GET['msg']) && $_GET['msg'] == 'post_criado_sucesso'): ?>
    <div class="alert alert-success text-center container-xxl mt-3">Postagem criada com sucesso!</div>
<?php endif; ?>

<div class="bg-criar-post">
    <!--INICIO DO CRIAR POST-->
    <div class="div-criar-post-geral container-xxl">
        <div class="div-criar-post titulo-font">
            Criar post
            <a href="criarpost.php">
                <button class="btn-criar-post"><i class="fa fa-plus" aria-hidden="true"></i></button>
            </a>
        </div>
    </div>
    <!--FIM DO CRIAR POST-->
</div>
<div class="inicio-index container-xxl">
    <!--INICIO DA INTRODUCAO DO SITE-->
    <img src="../imgs/mundo.png" alt="Mochilão aventura">
    <h2 class="titulo-font cor-titulo">Explore o mundo com liberdade e emoção!</h2>
    <p>
        Descubra destinos incríveis, dicas essenciais e histórias inspiradoras para quem ama viajar de mochila nas costas. Aventuras, trilhas, paisagens de tirar o fôlego e experiências inesquecíveis esperam por você. Pronto para embarcar nessa jornada?
    </p>
    <a href="verposts.php" class="btn-inicio">Comece sua aventura</a>
    <!--FIM DA INTRODUCAO DO SITE-->

    <div class="bg-conteudo">
    <!--INICIO DO CONTEUDO DO INDEX-->
    <div class="title-conteudo">
        <h3 class="h3-conteudo titulo-font cor-titulo">Últimos posts feito por aventureiros</h3>
    </div>
    
    <div class="div-fundo-relatos">
        <div class="fundo-relatos">
        
        <?php 
        if($temPosts):
            foreach ($posts as $p):
                $data_formatada = date('d \d\e F, Y', strtotime($p['criado_em']));
                $resumo_conteudo = (strlen($p['conteudo']) > 150) ? substr($p['conteudo'], 0, 150) . '...' : $p['conteudo'];
        ?>
        
        <div class="relatos">
            <!--CARD DE POST DINÂMICO-->
            <div class="conteudo-card-index">
                <h3 class="titulo-font cor-titulo"><?php echo htmlspecialchars($p['titulo']); ?></h3>
                
                <p><?php echo htmlspecialchars($resumo_conteudo); ?></p>
                
                <div class="post-info-index">
                    <!-- Exibe Autor e Data vindos do banco -->
                    <span>Por <?php echo htmlspecialchars($p['nome_do_autor']); ?> • <?php echo $data_formatada; ?></span>
                </div>
            </div>
            <div class="div-btn-relatos">
                <!-- Link para ver o post completo -->
                <a href="verpostcompleto.php?id=<?php echo $p['id_post']; ?>">
                    <button class="btn-relatos">
                        Ver Post
                    </button> 
                </a>
            </div>
            <!--FIM DO CARD DE POST-->
        </div>

        <?php 
            endforeach; // Fim do foreach
        else:
            // Caso não tenha posts
            echo '<p style="text-align:center; color: #fff;">Ainda não há postagens. Seja o primeiro a compartilhar sua aventura!</p>';
        endif;
        ?>

        </div>
    </div>
</div>

</div>
    
<h2 class="container-xxl conheca-index titulo-font cor-titulo">Alguns lugares que você deve visitar!</h2>

<div id="carouselExampleAutoplaying" class="carousel slide container-xxl tamanho-car" data-bs-ride="carousel">
    <!--INICIO DO CARROSSEL DO INDEX-->
    <div class="carousel-inner">
        <div class="carousel-item active">
            <img src="../imgs/nascente_areia_que_canta-brotas.jpg" class="d-block w-100 img-car" alt="Nascente Areia que Canta - Brotas - São Paulo">
            <div class="carousel-caption d-none d-md-block legenda-car">
                <h5>Nascente Areia que Canta - Brotas - São Paulo</h5>
            </div>
        </div>
        <div class="carousel-item">
            <img src="../imgs/lencois_maranhenses-MA.jpg" class="d-block w-100 img-car" alt="Lençois Maranhenses - Maranhão">
            <div class="carousel-caption d-none d-md-block legenda-car">
                <h5>Lençois Maranhenses - Barreirinhas, Santo Amaro do Maranhão e Primeira Cruz - Maranhão </h5>
            </div>
        </div>
        <div class="carousel-item">
            <img src="../imgs/algarve.jpg" class="d-block w-100 img-car" alt="Algarve - Faro - Portugal">
            <div class="carousel-caption d-none d-md-block legenda-car">
                <h5>Algarve - Faro - Portugal</h5>
            </div>
        </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
    </button>
    <!--FIM DO CARROSSEL DO INDEX-->
</div>
    <h2 class="titulo-font cor-titulo tit-dicas container-xxl">Dicas Rápidas para Mochileiros</h2>
    <div class="dicas-lista container-xxl">
        <!--INICIO DAS DICAS-->
        <div class="dica-item"><span>🎒</span> Leve apenas o essencial para facilitar seus deslocamentos.</div>
        <div class="dica-item"><span>💧</span> Tenha sempre uma garrafa de água reutilizável.</div>
        <div class="dica-item"><span>🗺️</span> Baixe mapas offline dos destinos que vai visitar.</div>
        <div class="dica-item"><span>🛏️</span> Pesquise hotéis e acomodações compartilhadas para economizar.</div>
        <div class="dica-item"><span>🌎</span> Respeite a cultura local e preserve o meio ambiente.</div>
        <!--FIM DAS DICAS-->
    </div>
<h2 class="container-xxl conheca-index titulo-font cor-titulo">Conheça um pouco sobre a gente!</h2>
<div class="geral-sobre container-xl">
    <!--INICIO DO SOBRE DO INDEX-->
    <div class="text-titulo-sobre">
        <div class="titulo-sobre">
            <h2 class="titulo-font cor-titulo">Sobre Nós</h2>
        </div>
        <div class="div-texto-sobre container-sm">
            <p class="p-sobre">A Route Books é um guia turístico com a finalidade de ajudar viajantes a encontrar grandes experiências, 
                como pontos turísticos, atividades atrativas, culturas, entre outras variedades. Com diversidade de lugares, você pode encontrar um novo destino aqui, sempre com roteiros diferentes, para nos relacionarmos da melhor forma possível 
                com os nossos clientes. Aqui as pessoas podem deixar os relatos de suas aventuras para ajudar outros viajantes </p>
        </div>
    </div>
    
    <div class="div-btn-sobre">
        <a href="sobre.php">
            <button class="btn-relatos btn-ver-sobre">
                Ver Mais >
            </button> 
        </a>
    </div>
    <!--FIM DO SOBRE DO INDEX-->
</div>
    <!--INICIO DO FOOTER DO INDEX-->
    <footer class="footer-index">
        <div class="itens-footer-geral">
            <div class="item-footer item-footer-direitos">
                <h4 class="titulo-font">
                    Route Books © Todos os direitos reservados
                </h4>
            </div>
            <div class="item-footer">
                <h4 class="titulo-font">
                    Desenvolvido por: <br>      
                    <a href="https://github.com/LucasEduardoPereiraCruz">Lucas Cruz</a> <br>
                    <a href="https://github.com/TiagoGrizzo">Tiago Grizzo</a><br>
                </h4>
            </div>
            <div class="logo-footer">
                <img src="../imgs/rb-logo2.png" alt="Logo Route Books" class="logo-footer">
            </div>
        </div>
    </footer>
    <!--FIM DO FOOTER DO INDEX-->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" xintegrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
    <script src="../js/script.js"></script>
</body>
</html>