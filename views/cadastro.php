<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Route Books - Cadastre-se E Aventure-se!</title>
    <link rel="stylesheet" href="/PI-Route-books/css/reset.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="/PI-Route-books/css/style.css">
    <link rel="stylesheet" href="/PI-Route-books/css/cadastro.css">
</head>
<body>
    <section class="form-cadastro-geral container-xxl">
        <form action="../controllers/UsuarioController.php?acao=cadastrar" method="POST" class="form-cad">
            <div class="logo">
                <img src="/PI-Route-books/imgs/rb-logo1.png" class="logo-cadastro">
            </div>
            <h2 class="titulo-cadastro">Cadastre-se e Aventure-se!</h2>
            <div class="div-inputs">
                <div class="dividir-inputs-1">
                    
                    <label for="username">Nome de usuário:</label>
                    <div class="input-cadastro">
                        <i class="fa fa-user-o" aria-hidden="true"></i>
                        <input class="input-username" name="username" type="text" placeholder="Insira seu nome de usuário..." required>
                    </div>
                    
                    <label for="nome_completo">Nome completo:</label>
                    <div class="input-cadastro">
                        <i class="fa fa-user-o" aria-hidden="true"></i>
                        <input class="input-username" name="nome_completo" type="text" placeholder="Insira seu nome completo..." required>
                    </div>
                    
                    <label for="email">E-mail:</label>
                    <div class="input-cadastro">
                        <i class="fa fa-envelope-o" aria-hidden="true"></i>
                        <input class="input-email" name="email" type="email" placeholder="Insira seu e-mail..." required>
                    </div>
                    
                    <label for="telefone">Telefone:</label>
                    <div class="input-cadastro">
                        <i class="fa fa-phone" aria-hidden="true"></i>
                        <input class="input-telefone" name="telefone" type="text" placeholder="Insira seu número de telefone...">
                    </div>

                    <label for="senha">Senha:</label>
                    <div class="input-cadastro">
                        <i class="fa fa-lock" aria-hidden="true"></i>
                        <input class="input-senha" name="senha" type="password" placeholder="Insira sua senha..." required>
                    </div>
                    
                </div>
                <div class="dividir-inputs-2">
                    <label for="cidade">Cidade:</label>
                    <div class="input-cadastro">
                        <i class="fa fa-building" aria-hidden="true"></i>
                        <input class="input-cidade" name="cidade" type="text" placeholder="Insira a sua cidade...">
                    </div>

                    <label for="uf">Estado (UF):</label>
                    <div class="input-cadastro">
                        <i class="fa fa-map-marker" aria-hidden="true"></i>
                        <input class="input-estado" name="uf" type="text" placeholder="Insira a sigla do seu estado (UF)...">
                    </div>

                    <label for="pais_id">País:</label>
                    <div class="input-cadastro">
                        <i class="fa fa-globe" aria-hidden="true"></i>
                        <select class="select-uf" name="pais_id" id="pais_id">
                            <option value="">Selecione</option>
                            <option value="BR">Brasil</option>
                            </select>
                    </div>

                    <label for="conf-senha">Confirme sua senha:</label>
                    <div class="input-cadastro">
                        <i class="fa fa-lock" aria-hidden="true"></i>
                        <input class="input-senha" name="conf-senha" type="password" placeholder="Insira novamente sua senha..." required>
                    </div>
                </div>
            </div>
            
            <div class="div-btn-cadastro">
                <button type="submit" class="btn-cadastrar">Cadastrar</button>    
            </div>
            <br>
            <div class="link-login">
                Já tem um conta? <a href="login.php">Entre já!</a>
            </div>
        </form>
    </section>
</body>
</html>