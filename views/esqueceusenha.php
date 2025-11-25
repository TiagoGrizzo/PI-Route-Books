<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Route Books - Esqueci Minha Senha</title>
    <link rel="stylesheet" href="../css/reset.css">
    <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/esqsenha.css">
</head>
<body>
    <section class="form-esqueceu-geral container-xxl">
        <!--SECTION PRINCIPAL DA PAGINA-->
        <form action="" class="form-esq">
            <!--FORM DE ESQUECI SENHA-->
            <div class="logo-esq">
                <img src="../imgs/rb-logo1.png" class="logo-img">
                <!--LOGO-->
            </div>
            <!--CAMPO PARA INSERIR O EMAIL CADASTRADO NA CONTA-->
            <h4 class="titulo-esqueceu">Informe o e-mail que foi cadastrado previamente na sua conta</h4>
            <label for="email">E-mail:</label>
            <div class="input-esqueceu">
                <i class="fa fa-envelope-o" aria-hidden="true"></i>
                <input class="input-email" name="email" type="email" placeholder="Insira seu e-mail...">
            </div>
            <div class="div-btn-enviar">
                <a href="novasenha.php">
                    <!--BOTAO PARA IR PARA A PAGINA DE TROCAR A SENHA-->
                    <button type="button" class="btn-enviar">Enviar</button>    
                </a>     
            </div>
        </form>
    </section>
</body>
</html>