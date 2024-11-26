# Parking Management System

## Descrição

Este projeto é uma aplicação baseada em microsserviços para gerenciar estadias de veículos em estacionamentos, com integração de pagamentos e notificações. Ele utiliza tecnologias como **RabbitMQ**, **MongoDB**, e é implementado com **GraphQL** e **TypeScript**. 

---

## Estrutura do Projeto

A aplicação é composta pelos seguintes microsserviços:

1. **User**: Gerenciamento de usuários.
2. **Vehicle**: Cadastro e gerenciamento de veículos.
3. **Parking-Stays**: Gerenciamento de estadias de veículos.
4. **Parking-Payment**: Processamento de pagamentos relacionados a estadias.
5. **Gateway**: Orquestrador e ponto único de entrada para os microsserviços.

---

## Fluxo do Projeto

1. **Recepção de Mensagens de Estadia**  
   O microsserviço **Parking-Stays** processa mensagens de estadias enviadas para a fila `parking.stay.queue` no RabbitMQ.  
   - Verifica se a placa do veículo (`licensePlate`) está cadastrada, enviando uma solicitação para a fila `vehicle.queue` do RabbitMQ, que é consumida pelo microsserviço **Vehicle** veja o ponto 2.
   - Caso o veículo não seja encontrado, uma entrada de estadia com a flag `notFound` é criada.
   - Se o veículo for encontrado, uma estadia é registrada, associando-a ao veículo e ao usuário.

2. **Consulta de Veículos**  
O microsserviço **Vehicle** consome mensagens da fila `vehicle.queue`.  
- Quando recebe uma mensagem com uma placa de veículo (`licensePlate`), busca o veículo correspondente no banco de dados.
- Retorna dados do veículo, como `vehicleId`, `userId` e `paymentMethod`, ou informa que o veículo não foi encontrado.

3. **Envio de Mensagens de Pagamento**  
   - Após registrar uma estadia válida, o microsserviço **Parking-Stays** publica uma mensagem na fila `parking.payment.queue`, incluindo dados como `userId`, `parkingStayId` e o método de pagamento (`paymentMethod`).

4. **Processamento de Pagamentos**  
   O microsserviço **Parking-Payment** consome mensagens da fila `parking.payment.queue`.  
   - Um status aleatório (`Paid` ou `Failed`) é atribuído ao pagamento e registrado no banco de dados.


---

## Tecnologias Utilizadas

- **NestJS**: Framework utilizado para a implementação dos microsserviços.
- **MongoDB**: Banco de dados NoSQL utilizado para armazenar informações de usuários, veículos, estadias e pagamentos.
- **RabbitMQ**: Sistema de mensageria responsável por orquestrar a comunicação entre os microsserviços.
- **GraphQL**: Interface para consulta e manipulação de dados entre os microsserviços e o gateway.

---

## Configuração e Execução

### Pré-requisitos

- Docker e Docker Compose instalados.
- Node.js versão 16 ou superior.

### Instruções

1. Clone o repositório e navegue até o diretório principal.
2. Execute o comando abaixo para iniciar todos os serviços:
   ```bash
   docker-compose up --build
