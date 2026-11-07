const chat = db.getSiblingDB("RouteBooksChat");
if (!chat.getCollectionNames().includes("Mensagens")) chat.createCollection("Mensagens");
print("RouteBooksChat.Mensagens pronta. Nenhuma mensagem privada foi incluída.");
