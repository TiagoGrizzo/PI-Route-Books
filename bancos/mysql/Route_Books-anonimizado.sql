
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `Route_Books` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `Route_Books`;
DROP TABLE IF EXISTS `__efmigrationshistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `__efmigrationshistory` WRITE;
/*!40000 ALTER TABLE `__efmigrationshistory` DISABLE KEYS */;
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260927145341_primeira_apos_mudanca','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20261027173647_InlinePostComposer','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20261027225505_SocialFeedAndSeasons','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20261028044711_DemoCommunities','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20261028145407_PostPhotoAlbums','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20261029104220_OfficialCompanyProfile','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20261029104848_VerifiedOrlandoCommunity','9.0.0');
/*!40000 ALTER TABLE `__efmigrationshistory` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Nome` varchar(100) NOT NULL,
  `OrdemExibicao` int(11) NOT NULL,
  `DataCriacao` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` (`Id`, `Nome`, `OrdemExibicao`, `DataCriacao`) VALUES (1,'Roteiros de Viagem',1,'2026-10-27 19:16:51.000000');
INSERT INTO `categorias` (`Id`, `Nome`, `OrdemExibicao`, `DataCriacao`) VALUES (2,'Gastronomia',2,'2026-10-27 19:16:51.000000');
INSERT INTO `categorias` (`Id`, `Nome`, `OrdemExibicao`, `DataCriacao`) VALUES (3,'Hospedagem',3,'2026-10-27 19:16:51.000000');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `comentarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comentarios` (
  `IdComentario` int(11) NOT NULL AUTO_INCREMENT,
  `PostId` int(11) NOT NULL,
  `UsuarioId` int(11) NOT NULL,
  `Conteudo` longtext DEFAULT NULL,
  `CriadoEm` datetime(6) NOT NULL,
  `Status` longtext DEFAULT NULL,
  `AlteradoEm` datetime(6) NOT NULL,
  `DeletadoEm` datetime(6) DEFAULT NULL,
  `RespostaId` int(11) DEFAULT NULL,
  PRIMARY KEY (`IdComentario`),
  KEY `IX_comentarios_PostId` (`PostId`),
  KEY `IX_comentarios_UsuarioId` (`UsuarioId`),
  KEY `IX_comentarios_RespostaId` (`RespostaId`),
  CONSTRAINT `FK_comentarios_comentarios_RespostaId` FOREIGN KEY (`RespostaId`) REFERENCES `comentarios` (`IdComentario`),
  CONSTRAINT `FK_comentarios_posts_PostId` FOREIGN KEY (`PostId`) REFERENCES `posts` (`IdPost`) ON DELETE CASCADE,
  CONSTRAINT `FK_comentarios_usuarios_UsuarioId` FOREIGN KEY (`UsuarioId`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `comentarios` WRITE;
/*!40000 ALTER TABLE `comentarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `comentarios` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `comunidade_membros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comunidade_membros` (
  `ComunidadeId` int(11) NOT NULL,
  `UsuarioId` int(11) NOT NULL,
  `CriadoEm` datetime(6) NOT NULL,
  PRIMARY KEY (`ComunidadeId`,`UsuarioId`),
  KEY `IX_comunidade_membros_UsuarioId` (`UsuarioId`),
  CONSTRAINT `FK_comunidade_membros_comunidades_ComunidadeId` FOREIGN KEY (`ComunidadeId`) REFERENCES `comunidades` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_comunidade_membros_usuarios_UsuarioId` FOREIGN KEY (`UsuarioId`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `comunidade_membros` WRITE;
/*!40000 ALTER TABLE `comunidade_membros` DISABLE KEYS */;
/*!40000 ALTER TABLE `comunidade_membros` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `comunidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comunidades` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Slug` varchar(100) NOT NULL,
  `Nome` varchar(100) NOT NULL,
  `Descricao` varchar(500) NOT NULL,
  `Icone` varchar(30) NOT NULL,
  `CriadoEm` datetime(6) NOT NULL,
  `Verificada` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_comunidades_Slug` (`Slug`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `comunidades` WRITE;
/*!40000 ALTER TABLE `comunidades` DISABLE KEYS */;
INSERT INTO `comunidades` (`Id`, `Slug`, `Nome`, `Descricao`, `Icone`, `CriadoEm`, `Verificada`) VALUES (1,'mochileiros-do-mundo','Mochileiros do Mundo','Troque relatos, ideias de roteiro e descobertas de cada viagem.','🌎','2026-10-28 04:48:07.826393',0);
INSERT INTO `comunidades` (`Id`, `Slug`, `Nome`, `Descricao`, `Icone`, `CriadoEm`, `Verificada`) VALUES (2,'amantes-da-natureza','Amantes da Natureza','Trilhas, montanhas e viagens para desacelerar ao ar livre.','🌲','2026-10-28 04:48:07.865949',0);
INSERT INTO `comunidades` (`Id`, `Slug`, `Nome`, `Descricao`, `Icone`, `CriadoEm`, `Verificada`) VALUES (3,'gastronomia-pelo-mundo','Gastronomia pelo Mundo','Sabores, mercados e histórias que começam à mesa.','🍴','2026-10-28 04:48:07.866874',0);
INSERT INTO `comunidades` (`Id`, `Slug`, `Nome`, `Descricao`, `Icone`, `CriadoEm`, `Verificada`) VALUES (4,'parques-e-magia','Parques e Magia','Dicas para aproveitar parques temáticos e viagens em família.','🏰','2026-10-28 04:48:07.867346',0);
INSERT INTO `comunidades` (`Id`, `Slug`, `Nome`, `Descricao`, `Icone`, `CriadoEm`, `Verificada`) VALUES (5,'viagens-de-aventura','Viagens de Aventura','Um encontro para quem gosta de caminhar e conhecer novos caminhos.','🧭','2026-10-28 04:48:07.867826',0);
INSERT INTO `comunidades` (`Id`, `Slug`, `Nome`, `Descricao`, `Icone`, `CriadoEm`, `Verificada`) VALUES (6,'dicas-e-economia','Dicas e Economia','Planejamento, bagagem e ideias para viajar com mais tranquilidade.','🎒','2026-10-28 04:48:07.868295',0);
INSERT INTO `comunidades` (`Id`, `Slug`, `Nome`, `Descricao`, `Icone`, `CriadoEm`, `Verificada`) VALUES (7,'orlando-com-a-fran','Orlando com a Fran','Dicas, roteiros e experiências para aproveitar Orlando: parques, atrações, hospedagem e planejamento da viagem com a Fran.','🏰','2026-10-29 10:49:25.000000',1);
/*!40000 ALTER TABLE `comunidades` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `curtidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curtidas` (
  `UsuarioId` int(11) NOT NULL,
  `PostId` int(11) NOT NULL,
  `CriadoEm` datetime(6) NOT NULL,
  `AlteradoEm` datetime(6) NOT NULL,
  `Valor` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`UsuarioId`,`PostId`),
  KEY `IX_curtidas_PostId` (`PostId`),
  CONSTRAINT `FK_curtidas_posts_PostId` FOREIGN KEY (`PostId`) REFERENCES `posts` (`IdPost`) ON DELETE CASCADE,
  CONSTRAINT `FK_curtidas_usuarios_UsuarioId` FOREIGN KEY (`UsuarioId`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `curtidas` WRITE;
/*!40000 ALTER TABLE `curtidas` DISABLE KEYS */;
/*!40000 ALTER TABLE `curtidas` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `IdPost` int(11) NOT NULL AUTO_INCREMENT,
  `Titulo` longtext DEFAULT NULL,
  `Resumo` longtext DEFAULT NULL,
  `Conteudo` longtext DEFAULT NULL,
  `TipoPostagem` longtext DEFAULT NULL,
  `Categoria` longtext DEFAULT NULL,
  `Status` longtext DEFAULT NULL,
  `CategoriaEspecifica` longtext DEFAULT NULL,
  `TipoEspecifico` longtext DEFAULT NULL,
  `DataCriacao` datetime(6) NOT NULL,
  `ImagemUrl` longtext DEFAULT NULL,
  `TiposIdTipo` int(11) DEFAULT NULL,
  `CategoriasIdCategoria` int(11) DEFAULT NULL,
  `UsuariosIdUsuario` int(11) DEFAULT NULL,
  `AvaliacaoLugar` decimal(3,2) DEFAULT NULL,
  `Localizacao` longtext DEFAULT NULL,
  `TipoMidia` longtext DEFAULT NULL,
  `ComunidadeId` int(11) DEFAULT NULL,
  `ImagemFonteUrl` varchar(500) DEFAULT NULL,
  `ImagensJson` longtext DEFAULT NULL,
  PRIMARY KEY (`IdPost`),
  KEY `IX_posts_CategoriasIdCategoria` (`CategoriasIdCategoria`),
  KEY `IX_posts_TiposIdTipo` (`TiposIdTipo`),
  KEY `IX_posts_UsuariosIdUsuario` (`UsuariosIdUsuario`),
  KEY `IX_posts_ComunidadeId` (`ComunidadeId`),
  CONSTRAINT `FK_posts_categorias_CategoriasIdCategoria` FOREIGN KEY (`CategoriasIdCategoria`) REFERENCES `categorias` (`Id`),
  CONSTRAINT `FK_posts_comunidades_ComunidadeId` FOREIGN KEY (`ComunidadeId`) REFERENCES `comunidades` (`Id`) ON DELETE SET NULL,
  CONSTRAINT `FK_posts_tipos_TiposIdTipo` FOREIGN KEY (`TiposIdTipo`) REFERENCES `tipos` (`id_tipo`),
  CONSTRAINT `FK_posts_usuarios_UsuariosIdUsuario` FOREIGN KEY (`UsuariosIdUsuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` (`IdPost`, `Titulo`, `Resumo`, `Conteudo`, `TipoPostagem`, `Categoria`, `Status`, `CategoriaEspecifica`, `TipoEspecifico`, `DataCriacao`, `ImagemUrl`, `TiposIdTipo`, `CategoriasIdCategoria`, `UsuariosIdUsuario`, `AvaliacaoLugar`, `Localizacao`, `TipoMidia`, `ComunidadeId`, `ImagemFonteUrl`, `ImagensJson`) VALUES (20,'Relato de viagem 20','Relato de viagem anonimizado para demonstração.','O conteúdo pessoal desta publicação foi substituído na cópia compartilhada do projeto.',NULL,NULL,'Ativo',NULL,NULL,'2026-10-29 10:23:42.282989',NULL,2,1,1,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO `posts` (`IdPost`, `Titulo`, `Resumo`, `Conteudo`, `TipoPostagem`, `Categoria`, `Status`, `CategoriaEspecifica`, `TipoEspecifico`, `DataCriacao`, `ImagemUrl`, `TiposIdTipo`, `CategoriasIdCategoria`, `UsuariosIdUsuario`, `AvaliacaoLugar`, `Localizacao`, `TipoMidia`, `ComunidadeId`, `ImagemFonteUrl`, `ImagensJson`) VALUES (21,'Lisboa no ritmo dos elétricos','[Demonstração] Uma inspiração de roteiro a pé, com pausas para observar os elétricos e as ruas de Lisboa.','Neste roteiro fictício, reservei uma manhã para explorar as ruas com calma e organizar os deslocamentos por bairro. A proposta é alternar caminhadas curtas, transporte público e pausas nos miradouros. Para planejar uma viagem real, confira os horários e as tarifas atualizados antes de sair. Qual bairro você colocaria no roteiro?\n\nRelato fictício de demonstração. Imagem ilustrativa encontrada no Pinterest; consulte o pin de origem para os créditos.',NULL,NULL,'Ativo',NULL,NULL,'2026-10-29 11:22:33.849312','/imgs/pinterest-demo/lisboa.jpg',1,1,4,NULL,'Lisboa, Portugal','image',6,'https://www.pinterest.com/pin/571675746464693620/',NULL);
INSERT INTO `posts` (`IdPost`, `Titulo`, `Resumo`, `Conteudo`, `TipoPostagem`, `Categoria`, `Status`, `CategoriaEspecifica`, `TipoEspecifico`, `DataCriacao`, `ImagemUrl`, `TiposIdTipo`, `CategoriasIdCategoria`, `UsuariosIdUsuario`, `AvaliacaoLugar`, `Localizacao`, `TipoMidia`, `ComunidadeId`, `ImagemFonteUrl`, `ImagensJson`) VALUES (22,'Kyoto: os detalhes do outono','[Demonstração] Folhas vermelhas, pedras e caminhos tranquilos para inspirar uma viagem ao Japão.','Esta imagem me inspirou a montar um roteiro fictício dedicado aos pequenos detalhes do outono. Em vez de acumular atrações, a ideia é escolher poucos jardins, caminhar devagar e reservar tempo para observar as cores. As datas da mudança das folhas variam, então um planejamento real precisa considerar a previsão local.\n\nRelato fictício de demonstração. Imagem ilustrativa encontrada no Pinterest; consulte o pin de origem para os créditos.',NULL,NULL,'Ativo',NULL,NULL,'2026-10-29 10:45:33.940415','/imgs/pinterest-demo/kyoto.jpg',1,1,5,NULL,'Kyoto, Japão','image',2,'https://www.pinterest.com/pin/41728734042314588/',NULL);
INSERT INTO `posts` (`IdPost`, `Titulo`, `Resumo`, `Conteudo`, `TipoPostagem`, `Categoria`, `Status`, `CategoriaEspecifica`, `TipoEspecifico`, `DataCriacao`, `ImagemUrl`, `TiposIdTipo`, `CategoriasIdCategoria`, `UsuariosIdUsuario`, `AvaliacaoLugar`, `Localizacao`, `TipoMidia`, `ComunidadeId`, `ImagemFonteUrl`, `ImagensJson`) VALUES (23,'Uma estrada pela Patagônia chilena','[Demonstração] Montanhas ao fundo e espírito de estrada: inspiração para explorar Torres del Paine.','O plano desta aventura fictícia é montar uma base na região e organizar passeios curtos conforme as condições locais. A imagem de estrada com as montanhas ao fundo resume o clima que eu buscaria: tempo para contemplar e liberdade para adaptar o roteiro. Para uma viagem real, consulte as regras do parque e as condições das vias.\n\nRelato fictício de demonstração. Imagem ilustrativa encontrada no Pinterest; consulte o pin de origem para os créditos.',NULL,NULL,'Ativo',NULL,NULL,'2026-10-29 10:08:33.948075','/imgs/pinterest-demo/torres-paine.jpg',1,1,6,NULL,'Torres del Paine, Chile','image',5,'https://www.pinterest.com/pin/205406432980568666/',NULL);
INSERT INTO `posts` (`IdPost`, `Titulo`, `Resumo`, `Conteudo`, `TipoPostagem`, `Categoria`, `Status`, `CategoriaEspecifica`, `TipoEspecifico`, `DataCriacao`, `ImagemUrl`, `TiposIdTipo`, `CategoriasIdCategoria`, `UsuariosIdUsuario`, `AvaliacaoLugar`, `Localizacao`, `TipoMidia`, `ComunidadeId`, `ImagemFonteUrl`, `ImagensJson`) VALUES (24,'Buenos Aires em tons de jacarandá','[Demonstração] Um passeio de inspiração entre árvores floridas e ruas da capital argentina.','Neste relato fictício, o passeio começa sem pressa e deixa espaço para uma pausa no café. A foto dos jacarandás inspirou um roteiro com caminhadas, praças e tempo livre para descobrir o bairro. Levaria uma garrafa de água, calçados confortáveis e um caderno para registrar os lugares que chamarem atenção.\n\nRelato fictício de demonstração. Imagem ilustrativa encontrada no Pinterest; consulte o pin de origem para os créditos.',NULL,NULL,'Ativo',NULL,NULL,'2026-10-29 09:31:33.955962','/imgs/pinterest-demo/buenos-aires.jpg',1,1,7,NULL,'Buenos Aires, Argentina','image',1,'https://www.pinterest.com/pin/81346336992922834/',NULL);
INSERT INTO `posts` (`IdPost`, `Titulo`, `Resumo`, `Conteudo`, `TipoPostagem`, `Categoria`, `Status`, `CategoriaEspecifica`, `TipoEspecifico`, `DataCriacao`, `ImagemUrl`, `TiposIdTipo`, `CategoriasIdCategoria`, `UsuariosIdUsuario`, `AvaliacaoLugar`, `Localizacao`, `TipoMidia`, `ComunidadeId`, `ImagemFonteUrl`, `ImagensJson`) VALUES (25,'Café e pastel de nata: uma pausa em Lisboa','[Demonstração] Uma mesa simples e um sabor português para entrar no roteiro gastronômico.','Esta é uma parada imaginada para um roteiro fictício de gastronomia em Lisboa: sentar, pedir um café e apreciar um pastel de nata. A proposta é deixar um intervalo entre os passeios para provar os sabores da cidade e conversar sobre as descobertas do dia. Qual doce você sempre procura quando viaja?\n\nRelato fictício de demonstração. Imagem ilustrativa encontrada no Pinterest; consulte o pin de origem para os créditos.',NULL,NULL,'Ativo',NULL,NULL,'2026-10-29 08:54:33.963465','/imgs/pinterest-demo/pastel-nata.jpg',1,1,8,NULL,'Lisboa, Portugal','image',3,'https://www.pinterest.com/pin/44543483799822872/',NULL);
INSERT INTO `posts` (`IdPost`, `Titulo`, `Resumo`, `Conteudo`, `TipoPostagem`, `Categoria`, `Status`, `CategoriaEspecifica`, `TipoEspecifico`, `DataCriacao`, `ImagemUrl`, `TiposIdTipo`, `CategoriasIdCategoria`, `UsuariosIdUsuario`, `AvaliacaoLugar`, `Localizacao`, `TipoMidia`, `ComunidadeId`, `ImagemFonteUrl`, `ImagensJson`) VALUES (26,'Orlando iluminada para o Halloween','[Demonstração] Abóboras e luzes noturnas inspiram um roteiro pelos parques de Orlando.','A decoração desta imagem foi o ponto de partida para um planejamento fictício de uma noite de Halloween em Orlando. A ideia é chegar com tempo, alternar atrações e pausas, e aproveitar os detalhes iluminados. Antes de uma viagem real, vale conferir o calendário oficial, os ingressos e as condições de cada evento.\n\nRelato fictício de demonstração. Imagem ilustrativa encontrada no Pinterest; consulte o pin de origem para os créditos.',NULL,NULL,'Ativo',NULL,NULL,'2026-10-29 08:17:33.968689','/imgs/pinterest-demo/orlando.jpg',1,1,9,NULL,'Orlando, Estados Unidos','image',7,'https://www.pinterest.com/pin/502925483363056390/',NULL);
INSERT INTO `posts` (`IdPost`, `Titulo`, `Resumo`, `Conteudo`, `TipoPostagem`, `Categoria`, `Status`, `CategoriaEspecifica`, `TipoEspecifico`, `DataCriacao`, `ImagemUrl`, `TiposIdTipo`, `CategoriasIdCategoria`, `UsuariosIdUsuario`, `AvaliacaoLugar`, `Localizacao`, `TipoMidia`, `ComunidadeId`, `ImagemFonteUrl`, `ImagensJson`) VALUES (27,'Relato de viagem 27','Relato de viagem anonimizado para demonstração.','O conteúdo pessoal desta publicação foi substituído na cópia compartilhada do projeto.',NULL,NULL,'Ativo',NULL,NULL,'2026-10-29 11:52:51.120305',NULL,1,2,13,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO `posts` (`IdPost`, `Titulo`, `Resumo`, `Conteudo`, `TipoPostagem`, `Categoria`, `Status`, `CategoriaEspecifica`, `TipoEspecifico`, `DataCriacao`, `ImagemUrl`, `TiposIdTipo`, `CategoriasIdCategoria`, `UsuariosIdUsuario`, `AvaliacaoLugar`, `Localizacao`, `TipoMidia`, `ComunidadeId`, `ImagemFonteUrl`, `ImagensJson`) VALUES (28,'Relato de viagem 28','Relato de viagem anonimizado para demonstração.','O conteúdo pessoal desta publicação foi substituído na cópia compartilhada do projeto.',NULL,NULL,'Ativo',NULL,NULL,'2026-10-29 12:31:21.416362',NULL,1,3,1,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `poststags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `poststags` (
  `post_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`post_id`,`tag_id`),
  KEY `IX_poststags_tag_id` (`tag_id`),
  CONSTRAINT `FK_poststags_posts_post_id` FOREIGN KEY (`post_id`) REFERENCES `posts` (`IdPost`) ON DELETE CASCADE,
  CONSTRAINT `FK_poststags_tags_tag_id` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id_tag`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `poststags` WRITE;
/*!40000 ALTER TABLE `poststags` DISABLE KEYS */;
/*!40000 ALTER TABLE `poststags` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `seguidores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seguidores` (
  `id_seguidor` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario_seguidor` int(11) NOT NULL,
  `id_usuario_seguido` int(11) NOT NULL,
  `data_seguimento` datetime(6) NOT NULL,
  PRIMARY KEY (`id_seguidor`),
  KEY `IX_seguidores_id_usuario_seguido` (`id_usuario_seguido`),
  KEY `IX_seguidores_id_usuario_seguidor` (`id_usuario_seguidor`),
  CONSTRAINT `FK_seguidores_usuarios_id_usuario_seguido` FOREIGN KEY (`id_usuario_seguido`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `FK_seguidores_usuarios_id_usuario_seguidor` FOREIGN KEY (`id_usuario_seguidor`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `seguidores` WRITE;
/*!40000 ALTER TABLE `seguidores` DISABLE KEYS */;
/*!40000 ALTER TABLE `seguidores` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id_tag` int(11) NOT NULL AUTO_INCREMENT,
  `nome` longtext DEFAULT NULL,
  PRIMARY KEY (`id_tag`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` (`id_tag`, `nome`) VALUES (1,'saopaulo');
INSERT INTO `tags` (`id_tag`, `nome`) VALUES (2,'portugal');
INSERT INTO `tags` (`id_tag`, `nome`) VALUES (3,'gastronomia');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `temporadas_destinos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `temporadas_destinos` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Mes` int(11) NOT NULL,
  `DiaInicio` int(11) NOT NULL,
  `DiaFim` int(11) NOT NULL,
  `Ordem` int(11) NOT NULL,
  `Pais` varchar(120) NOT NULL,
  `Descricao` varchar(150) NOT NULL,
  `Icone` varchar(30) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_temporadas_destinos_Mes_Ordem` (`Mes`,`Ordem`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `temporadas_destinos` WRITE;
/*!40000 ALTER TABLE `temporadas_destinos` DISABLE KEYS */;
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (1,1,1,31,1,'Estados Unidos (Flórida)','Disney e Férias / Temporada Ativa','fa-globe');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (2,1,1,31,2,'Argentina','Férias e Verão / Temporada Ativa','fa-sun-o');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (3,1,1,31,3,'Portugal','Inverno Ameno / Temporada Ativa','fa-snowflake-o');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (4,1,1,31,4,'México','Época Seca no Caribe / Temporada Ativa','fa-sun-o');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (5,2,1,29,1,'Estados Unidos','Outlets e Pós-Festas / Temporada Ativa','fa-globe');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (6,2,1,29,2,'Argentina','Férias de Verão / Temporada Ativa','fa-sun-o');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (7,2,1,29,3,'Portugal','Turismo Gastronômico / Temporada Ativa','fa-globe');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (8,2,1,29,4,'México','Sol e Praias do Caribe / Temporada Ativa','fa-sun-o');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (9,3,1,31,1,'Japão (Floração das Cerejeiras)','Sakura e Turismo / Temporada Ativa','fa-leaf');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (10,3,1,31,2,'Estados Unidos','Início da Primavera / Temporada Ativa','fa-leaf');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (11,3,1,31,3,'Portugal','Primavera Antecipada / Temporada Ativa','fa-leaf');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (12,3,1,31,4,'Argentina','Colheita de Vinhos / Temporada Ativa','fa-globe');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (13,4,1,30,1,'Portugal','Primavera no Algarve / Temporada Ativa','fa-leaf');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (14,4,1,30,2,'Itália','Clima Ameno / Temporada Ativa','fa-globe');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (15,4,1,30,3,'França','Paris e Dias Longos / Temporada Ativa','fa-globe');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (16,4,1,30,4,'Estados Unidos (Nova York)','Parques na Primavera / Temporada Ativa','fa-leaf');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (17,5,1,31,1,'Itália','Pré-Verão Ameno / Temporada Ativa','fa-sun-o');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (18,5,1,31,2,'Portugal','Temperaturas Ideais / Temporada Ativa','fa-globe');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (19,5,1,31,3,'Espanha','Sol Mediterrâneo / Temporada Ativa','fa-sun-o');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (20,5,1,31,4,'França','Festivais de Primavera / Temporada Ativa','fa-leaf');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (21,6,1,30,1,'Chile (Temporada de Neve)','Frio e Neve / Temporada Ativa','fa-snowflake-o');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (22,6,1,30,2,'Argentina (Esqui na Patagônia)','Inverno e Neve / Temporada Ativa','fa-snowflake-o');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (23,6,1,30,3,'Itália','Início do Verão / Temporada Ativa','fa-sun-o');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (24,6,1,30,4,'Portugal','Festas Populares / Temporada Ativa','fa-globe');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (25,7,1,31,1,'Chile (Auge da Neve)','Esqui e Férias / Temporada Ativa','fa-snowflake-o');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (26,7,1,31,2,'Argentina (Inverno Patagônico)','Neve e Montanha / Temporada Ativa','fa-snowflake-o');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (27,7,1,31,3,'Estados Unidos (Orlando)','Férias e Parques / Temporada Ativa','fa-globe');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (28,7,1,31,4,'Portugal','Verão e Praias / Temporada Ativa','fa-sun-o');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (29,8,1,31,1,'Chile','Esqui e Fim da Neve / Temporada Ativa','fa-snowflake-o');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (30,8,1,31,2,'Argentina','Últimas Neves / Temporada Ativa','fa-snowflake-o');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (31,8,1,31,3,'Portugal','Férias Locais / Temporada Ativa','fa-globe');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (32,8,1,31,4,'Estados Unidos','Outlets no Verão / Temporada Ativa','fa-sun-o');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (33,9,1,30,1,'Portugal','Outono Calmo / Temporada Ativa','fa-leaf');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (34,9,1,30,2,'Itália','Sem Multidões / Temporada Ativa','fa-globe');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (35,9,1,30,3,'França','Paris Romântica / Temporada Ativa','fa-globe');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (36,9,1,30,4,'Argentina','Buenos Aires Agradável / Temporada Ativa','fa-globe');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (37,10,1,31,1,'Estados Unidos','Halloween na Disney / Temporada Ativa','fa-globe');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (38,10,1,31,2,'Portugal','Clima Ameno / Temporada Ativa','fa-globe');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (39,10,1,31,3,'Japão','Folhas de Outono (Koyo) / Temporada Ativa','fa-leaf');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (40,10,1,31,4,'Argentina','Primavera Porteña / Temporada Ativa','fa-leaf');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (41,11,1,30,1,'Estados Unidos','Black Friday e Compras / Temporada Ativa','fa-globe');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (42,11,1,30,2,'Argentina','Feriados e Escapadas / Temporada Ativa','fa-globe');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (43,11,1,30,3,'Chile','Atacama e Lagos / Temporada Ativa','fa-globe');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (44,11,1,30,4,'Portugal','Baixa Temporada Acolhedora / Temporada Ativa','fa-globe');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (45,12,1,31,1,'Estados Unidos','Natal em Nova York / Temporada Ativa','fa-globe');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (46,12,1,31,2,'França (Paris)','Mercados de Natal / Temporada Ativa','fa-globe');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (47,12,1,31,3,'Portugal','Festividades de Fim de Ano / Temporada Ativa','fa-globe');
INSERT INTO `temporadas_destinos` (`Id`, `Mes`, `DiaInicio`, `DiaFim`, `Ordem`, `Pais`, `Descricao`, `Icone`) VALUES (48,12,1,31,4,'Argentina','Viagens de Férias / Temporada Ativa','fa-globe');
/*!40000 ALTER TABLE `temporadas_destinos` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `tipos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos` (
  `id_tipo` int(11) NOT NULL AUTO_INCREMENT,
  `nomeTipo` longtext DEFAULT NULL,
  `descricao` longtext DEFAULT NULL,
  PRIMARY KEY (`id_tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `tipos` WRITE;
/*!40000 ALTER TABLE `tipos` DISABLE KEYS */;
INSERT INTO `tipos` (`id_tipo`, `nomeTipo`, `descricao`) VALUES (1,'Postagem Padrão','Publicação comum de texto e imagens');
INSERT INTO `tipos` (`id_tipo`, `nomeTipo`, `descricao`) VALUES (2,'Guia de Viagem','Roteiro estruturado por etapas ou dias');
/*!40000 ALTER TABLE `tipos` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `nome_completo` varchar(100) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `uf` varchar(2) DEFAULT NULL,
  `biografia` longtext DEFAULT NULL,
  `cidade` longtext DEFAULT NULL,
  `pais` longtext DEFAULT NULL,
  `foto_perfil` longtext DEFAULT NULL,
  `criado_em` datetime(6) NOT NULL,
  `alterado_em` datetime(6) NOT NULL,
  `estado_conta` longtext DEFAULT NULL,
  `data_fim_suspensao` datetime(6) DEFAULT NULL,
  `deletado_em` datetime(6) DEFAULT NULL,
  `CapaUrl` varchar(300) DEFAULT NULL,
  `PerfilOficial` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` (`id_usuario`, `username`, `nome_completo`, `email`, `telefone`, `senha_hash`, `uf`, `biografia`, `cidade`, `pais`, `foto_perfil`, `criado_em`, `alterado_em`, `estado_conta`, `data_fim_suspensao`, `deletado_em`, `CapaUrl`, `PerfilOficial`) VALUES (1,'viajante_1','Viajante 1','viajante1@example.test',NULL,'$2a$11$jYwV33cjzeEjfKgM189x2uB8a.lNFYSxfapUfRg9Iu/yNapgfbpAC',NULL,'Perfil de demonstração para testar o Route Books.',NULL,NULL,NULL,'2026-01-01 00:00:00','2026-01-01 00:00:00','Ativo',NULL,NULL,NULL,0);
INSERT INTO `usuarios` (`id_usuario`, `username`, `nome_completo`, `email`, `telefone`, `senha_hash`, `uf`, `biografia`, `cidade`, `pais`, `foto_perfil`, `criado_em`, `alterado_em`, `estado_conta`, `data_fim_suspensao`, `deletado_em`, `CapaUrl`, `PerfilOficial`) VALUES (4,'demo_clara_monteiro','Clara Monteiro','viajante4@example.test',NULL,'$2a$11$jYwV33cjzeEjfKgM189x2uB8a.lNFYSxfapUfRg9Iu/yNapgfbpAC',NULL,'Perfil de demonstração para testar o Route Books.',NULL,NULL,NULL,'2026-01-01 00:00:00','2026-01-01 00:00:00','Ativo',NULL,NULL,NULL,0);
INSERT INTO `usuarios` (`id_usuario`, `username`, `nome_completo`, `email`, `telefone`, `senha_hash`, `uf`, `biografia`, `cidade`, `pais`, `foto_perfil`, `criado_em`, `alterado_em`, `estado_conta`, `data_fim_suspensao`, `deletado_em`, `CapaUrl`, `PerfilOficial`) VALUES (5,'demo_rafael_andrade','Rafael Andrade','viajante5@example.test',NULL,'$2a$11$jYwV33cjzeEjfKgM189x2uB8a.lNFYSxfapUfRg9Iu/yNapgfbpAC',NULL,'Perfil de demonstração para testar o Route Books.',NULL,NULL,NULL,'2026-01-01 00:00:00','2026-01-01 00:00:00','Ativo',NULL,NULL,NULL,0);
INSERT INTO `usuarios` (`id_usuario`, `username`, `nome_completo`, `email`, `telefone`, `senha_hash`, `uf`, `biografia`, `cidade`, `pais`, `foto_perfil`, `criado_em`, `alterado_em`, `estado_conta`, `data_fim_suspensao`, `deletado_em`, `CapaUrl`, `PerfilOficial`) VALUES (6,'demo_marina_costa','Marina Costa','viajante6@example.test',NULL,'$2a$11$jYwV33cjzeEjfKgM189x2uB8a.lNFYSxfapUfRg9Iu/yNapgfbpAC',NULL,'Perfil de demonstração para testar o Route Books.',NULL,NULL,NULL,'2026-01-01 00:00:00','2026-01-01 00:00:00','Ativo',NULL,NULL,NULL,0);
INSERT INTO `usuarios` (`id_usuario`, `username`, `nome_completo`, `email`, `telefone`, `senha_hash`, `uf`, `biografia`, `cidade`, `pais`, `foto_perfil`, `criado_em`, `alterado_em`, `estado_conta`, `data_fim_suspensao`, `deletado_em`, `CapaUrl`, `PerfilOficial`) VALUES (7,'demo_pedro_lima','Pedro Lima','viajante7@example.test',NULL,'$2a$11$jYwV33cjzeEjfKgM189x2uB8a.lNFYSxfapUfRg9Iu/yNapgfbpAC',NULL,'Perfil de demonstração para testar o Route Books.',NULL,NULL,NULL,'2026-01-01 00:00:00','2026-01-01 00:00:00','Ativo',NULL,NULL,NULL,0);
INSERT INTO `usuarios` (`id_usuario`, `username`, `nome_completo`, `email`, `telefone`, `senha_hash`, `uf`, `biografia`, `cidade`, `pais`, `foto_perfil`, `criado_em`, `alterado_em`, `estado_conta`, `data_fim_suspensao`, `deletado_em`, `CapaUrl`, `PerfilOficial`) VALUES (8,'demo_beatriz_rocha','Beatriz Rocha','viajante8@example.test',NULL,'$2a$11$jYwV33cjzeEjfKgM189x2uB8a.lNFYSxfapUfRg9Iu/yNapgfbpAC',NULL,'Perfil de demonstração para testar o Route Books.',NULL,NULL,NULL,'2026-01-01 00:00:00','2026-01-01 00:00:00','Ativo',NULL,NULL,NULL,0);
INSERT INTO `usuarios` (`id_usuario`, `username`, `nome_completo`, `email`, `telefone`, `senha_hash`, `uf`, `biografia`, `cidade`, `pais`, `foto_perfil`, `criado_em`, `alterado_em`, `estado_conta`, `data_fim_suspensao`, `deletado_em`, `CapaUrl`, `PerfilOficial`) VALUES (9,'demo_lucas_almeida','Lucas Almeida','viajante9@example.test',NULL,'$2a$11$jYwV33cjzeEjfKgM189x2uB8a.lNFYSxfapUfRg9Iu/yNapgfbpAC',NULL,'Perfil de demonstração para testar o Route Books.',NULL,NULL,NULL,'2026-01-01 00:00:00','2026-01-01 00:00:00','Ativo',NULL,NULL,NULL,0);
INSERT INTO `usuarios` (`id_usuario`, `username`, `nome_completo`, `email`, `telefone`, `senha_hash`, `uf`, `biografia`, `cidade`, `pais`, `foto_perfil`, `criado_em`, `alterado_em`, `estado_conta`, `data_fim_suspensao`, `deletado_em`, `CapaUrl`, `PerfilOficial`) VALUES (10,'routebooks','Route Books','routebooks@example.test',NULL,'$2a$11$jYwV33cjzeEjfKgM189x2uB8a.lNFYSxfapUfRg9Iu/yNapgfbpAC',NULL,'Perfil oficial do Route Books.',NULL,NULL,'/imgs/perfis/routebooks-oficial.png','2026-01-01 00:00:00','2026-01-01 00:00:00','Ativo',NULL,NULL,NULL,1);
INSERT INTO `usuarios` (`id_usuario`, `username`, `nome_completo`, `email`, `telefone`, `senha_hash`, `uf`, `biografia`, `cidade`, `pais`, `foto_perfil`, `criado_em`, `alterado_em`, `estado_conta`, `data_fim_suspensao`, `deletado_em`, `CapaUrl`, `PerfilOficial`) VALUES (11,'viajante_11','Viajante 11','viajante11@example.test',NULL,'$2a$11$jYwV33cjzeEjfKgM189x2uB8a.lNFYSxfapUfRg9Iu/yNapgfbpAC',NULL,'Perfil de demonstração para testar o Route Books.',NULL,NULL,NULL,'2026-01-01 00:00:00','2026-01-01 00:00:00','Ativo',NULL,NULL,NULL,0);
INSERT INTO `usuarios` (`id_usuario`, `username`, `nome_completo`, `email`, `telefone`, `senha_hash`, `uf`, `biografia`, `cidade`, `pais`, `foto_perfil`, `criado_em`, `alterado_em`, `estado_conta`, `data_fim_suspensao`, `deletado_em`, `CapaUrl`, `PerfilOficial`) VALUES (12,'viajante_12','Viajante 12','viajante12@example.test',NULL,'$2a$11$jYwV33cjzeEjfKgM189x2uB8a.lNFYSxfapUfRg9Iu/yNapgfbpAC',NULL,'Perfil de demonstração para testar o Route Books.',NULL,NULL,NULL,'2026-01-01 00:00:00','2026-01-01 00:00:00','Ativo',NULL,NULL,NULL,0);
INSERT INTO `usuarios` (`id_usuario`, `username`, `nome_completo`, `email`, `telefone`, `senha_hash`, `uf`, `biografia`, `cidade`, `pais`, `foto_perfil`, `criado_em`, `alterado_em`, `estado_conta`, `data_fim_suspensao`, `deletado_em`, `CapaUrl`, `PerfilOficial`) VALUES (13,'viajante_13','Viajante 13','viajante13@example.test',NULL,'$2a$11$jYwV33cjzeEjfKgM189x2uB8a.lNFYSxfapUfRg9Iu/yNapgfbpAC',NULL,'Perfil de demonstração para testar o Route Books.',NULL,NULL,NULL,'2026-01-01 00:00:00','2026-01-01 00:00:00','Ativo',NULL,NULL,NULL,0);
INSERT INTO `usuarios` (`id_usuario`, `username`, `nome_completo`, `email`, `telefone`, `senha_hash`, `uf`, `biografia`, `cidade`, `pais`, `foto_perfil`, `criado_em`, `alterado_em`, `estado_conta`, `data_fim_suspensao`, `deletado_em`, `CapaUrl`, `PerfilOficial`) VALUES (14,'viajante_14','Viajante 14','viajante14@example.test',NULL,'$2a$11$jYwV33cjzeEjfKgM189x2uB8a.lNFYSxfapUfRg9Iu/yNapgfbpAC',NULL,'Perfil de demonstração para testar o Route Books.',NULL,NULL,NULL,'2026-01-01 00:00:00','2026-01-01 00:00:00','Ativo',NULL,NULL,NULL,0);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

