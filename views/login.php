<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Route Books - Entre No Route Books</title>
    <link rel="stylesheet" href="css/reset.css">
    <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/login.css">
</head>
<body>
    <section class="form-login-geral container-xxl">
        <!--SECTION PRINCIPAL DA PAGINA-->
        <form action="" class="form-log">
            <!--FORM PARA INSERIR INFORMAÇÕES DE LOGIN-->
            <div class="logo">
                <img src="imgs/rb-logo1.png" class="logo-img">
                <!--LOGO-->
            </div>
            <h2 class="titulo-login">Entrar no Route Books</h2>
            <!--TITULO-->

            <!--INFOS PARA LOGAR-->
            <label for="email">E-mail</label>
            <div class="input-login">
                <i class="fa fa-envelope-o" aria-hidden="true"></i>
                <input class="input-email" name="email" type="email" placeholder="Insira seu e-mail...">
            </div>
            <label for="senha">Senha:</label>
            <div class="input-login">
                <i class="fa fa-lock" aria-hidden="true"></i>
                <input class="input-senha" name="senha" type="password" placeholder="Insira sua senha...">
            </div>
            <div class="link-login">
                <!--LINK PARA A PAGINA DE ESQUECI MINHA SENHA-->
                <a href="esqueceusenha.html">Esqueci minha senha</a>
            </div>
            <div class="div-btn-login">
                <a href="index.html">
                    <!--BOTAO PARA ENTRAR-->
                    <button type="button" class="btn-logar">Entrar</button>    
                </a>     
            </div>
            <br>
            <div class="link-login-cad">
                <!--LINK PARA A PAGINA DE CADASTRO-->
                Não tem uma conta? &nbsp;<a href="cadastro.html "> Cadastre-se já!</a>
            </div>
        </form>
    </section>
</body>
</html>