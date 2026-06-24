# Introdução

Informações básicas do projeto.

* **Projeto:** Solidariza
* **Repositório GitHub:** https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-1-ti1-0438100-deference/
* **Membros da equipe:**

  * [Frederico Marcos de Paula Marques](https://github.com/fredmarques916)
  * [Lucas Dutra Figueiredo](https://github.com/LucasDutraFig)
  * [Pedro Henrique Rocha de Souza](https://github.com/pedro976)
  * [Luiz Felipe Gibim Borges](https://github.com/LuizGibim7)

A documentação do projeto é estruturada da seguinte forma:

1. Introdução
2. Contexto
3. Product Discovery
4. Product Design
5. Metodologia
6. Solução
7. Referências Bibliográficas

✅ [Documentação de Design Thinking (MIRO)](files/Processo%20Design%20Thinking.pdf)

# Contexto

Detalhes sobre o espaço de problema, os objetivos do projeto, sua justificativa e público-alvo.

## Problema

A distribuição de auxílio em áreas de extrema pobreza é prejudicada pela falta de transparência, organização e conexão entre doadores, promotores e beneficiários. Muitas doações não chegam de forma eficiente a quem precisa, enquanto iniciativas sociais enfrentam dificuldades para captar e gerenciar recursos. Isso evidencia a necessidade de uma solução que integre esses atores de forma confiável e eficiente.

## Objetivos

Desenvolver um software capaz de otimizar a distribuição de auxílios em áreas de extrema pobreza, promovendo maior transparência, organização e eficiência na conexão entre doadores, promotores sociais e beneficiários, garantindo que os recursos sejam destinados de forma adequada e cheguem às pessoas que realmente necessitam.

- Desenvolver uma plataforma digital que centralize o cadastro de doadores, beneficiários e instituições responsáveis pela distribuição dos auxílios.
- Desenvolver uma interface simples e acessível, possibilitando o uso da plataforma por pessoas com diferentes níveis de familiaridade tecnológica.
- Investigar formas de reduzir fraudes e inconsistências no processo de distribuição, utilizando validação de dados e monitoramento contínuo das solicitações.

## Justificativa

A escolha desta aplicação se justifica pela necessidade de tornar a distribuição de auxílios mais organizada, transparente e eficiente, reduzindo falhas e garantindo que os recursos cheguem às pessoas que realmente necessitam. Atualmente, a falta de organização e controle pode comprometer a eficácia desse processo, dificultando a conexão entre doadores, promotores sociais e beneficiários.

O desenvolvimento deste software busca oferecer uma solução tecnológica capaz de melhorar esse sistema, proporcionando mais confiabilidade e praticidade. Além disso, o projeto permite aplicar conhecimentos técnicos na criação de uma ferramenta com impacto social positivo, baseada nas necessidades reais dos usuários e voltada para a melhoria da gestão e distribuição dos auxílios.

## Público-Alvo

O público-alvo da solução é formado por doadores, promotores sociais e beneficiários de auxílios. Os administradores e promotores utilizarão o sistema para organizar e acompanhar a distribuição dos recursos, possuindo conhecimento básico ou intermediário em tecnologia.

Os doadores utilizarão a plataforma para realizar e acompanhar suas contribuições, enquanto os beneficiários terão acesso às informações sobre os auxílios recebidos. Como parte do público pode ter pouca familiaridade com tecnologia, o sistema será simples, acessível e intuitivo.

# Product Discovery

## Etapa de Entendimento

![Matriz CSD e Mapa de Stakeholders](images/Matriz%20CSD%20e%20Mapa%20de%20Stakeholders.jpg)

## Etapa de Definição

### Personas

![Persona 1](images/Persona%201.jpg)
![Persona 2](images/Persona%202.jpg)
![Persona 3](images/Persona%203.jpg)
![Persona 4](images/Persona%204.jpg)
![Persona 5](images/Persona%205.jpg)

# Product Design

Nesse momento, vamos transformar os insights e validações obtidos em soluções tangíveis e utilizáveis. Essa fase envolve a definição de uma proposta de valor, detalhando a prioridade de cada ideia e a consequente criação de wireframes, mockups e protótipos de alta fidelidade, que detalham a interface e a experiência do usuário.

## Histórias de Usuários

Com base na análise das personas foram identificadas as seguintes histórias de usuários:

![Histórias de Usuário](images/Histórias%20de%20Usuário.jpg)

## Proposta de Valor

![Proposta 1](images/Proposta%201.jpg)
![Proposta 2](images/Proposta%202.jpg)
![Proposta 3](images/Proposta%203.jpg)
![Proposta 4](images/Proposta%204.jpg)
![Proposta 5](images/Proposta%205.jpg)

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto.

### Requisitos Funcionais

| ID     | Descrição do Requisito                                                                              | Prioridade |
| ------ | --------------------------------------------------------------------------------------------------- | ---------- |
| RF-001 | Permitir o cadastro de usuários nos perfis de Doador, Beneficiário e Organizador.                   | ALTA       |
| RF-002 | Permitir a autenticação (login) dos usuários cadastrados.                                           | ALTA       |
| RF-003 | Permitir a recuperação de senha.                                                                    | MÉDIA      |
| RF-004 | Permitir que organizadores criem campanhas de auxílio.                                              | ALTA       |
| RF-005 | Permitir que organizadores editem e gerenciem campanhas existentes.                                 | ALTA       |
| RF-006 | Exibir uma lista de campanhas ativas.                                                               | ALTA       |
| RF-007 | Permitir pesquisar campanhas por nome.                                                              | MÉDIA      |
| RF-008 | Permitir filtrar campanhas por categoria.                                                           | MÉDIA      |
| RF-009 | Exibir informações detalhadas de cada campanha.                                                     | ALTA       |
| RF-010 | Exibir o progresso de arrecadação de cada campanha.                                                 | ALTA       |
| RF-011 | Permitir que doadores realizem doações para campanhas.                                              | ALTA       |
| RF-012 | Registrar o histórico de doações realizadas pelos usuários.                                         | ALTA       |
| RF-013 | Apresentar indicadores de impacto, como número de beneficiários atendidos e quantidade de doadores. | ALTA       |
| RF-014 | Permitir compartilhar campanhas.                                                                    | MÉDIA      |
| RF-015 | Disponibilizar uma área de perfil para consulta dos dados do usuário.                               | ALTA       |
| RF-016 | Permitir a edição das informações do perfil.                                                        | MÉDIA      |
| RF-017 | Permitir a alteração de senha do usuário.                                                           | MÉDIA      |
| RF-018 | Exibir atividades recentes relacionadas às doações realizadas.                                      | MÉDIA      |
| RF-019 | Permitir configurar preferências de notificação.                                                    | BAIXA      |
| RF-020 | Permitir configurar opções de privacidade da conta.                                                 | BAIXA      |

### Requisitos não Funcionais

| ID      | Descrição do Requisito                                                                                                            | Prioridade |
| ------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| RNF-001 | O sistema deve possuir interface intuitiva e de fácil utilização para usuários com diferentes níveis de conhecimento tecnológico. | ALTA       |
| RNF-002 | O sistema deve ser acessível em navegadores web modernos.                                                                         | ALTA       |
| RNF-003 | O sistema deve garantir a segurança das informações pessoais dos usuários.                                                        | ALTA       |
| RNF-004 | O sistema deve armazenar senhas utilizando mecanismos seguros de criptografia ou hash.                                            | ALTA       |
| RNF-005 | O sistema deve garantir a integridade dos registros de doações e campanhas.                                                       | ALTA       |
| RNF-006 | O sistema deve disponibilizar informações de arrecadação de forma transparente e atualizada.                                      | ALTA       |
| RNF-007 | O sistema deve apresentar tempo de resposta adequado para consultas e navegação entre páginas.                                    | MÉDIA      |
| RNF-008 | O sistema deve permitir escalabilidade para suportar crescimento do número de usuários e campanhas.                               | MÉDIA      |
| RNF-009 | O sistema deve manter disponibilidade contínua para acesso às campanhas e doações.                                                | MÉDIA      |
| RNF-010 | O sistema deve possuir design responsivo para utilização em computadores, tablets e smartphones.                                  | MÉDIA      |
| RNF-011 | O sistema deve seguir a legislação vigente relacionada à proteção de dados pessoais (LGPD).                                       | ALTA       |
| RNF-012 | O sistema deve registrar logs das operações relevantes para auditoria e rastreabilidade.                                          | MÉDIA      |
| RNF-013 | O sistema deve permitir manutenção e evolução do código de forma modular.                                                         | BAIXA      |
| RNF-014 | O sistema deve garantir confiabilidade na comunicação entre doadores, organizadores e beneficiários.                              | ALTA       |
| RNF-015 | O sistema deve oferecer mecanismos que favoreçam a transparência e a confiança no processo de distribuição de auxílios.           | ALTA       |

## Projeto de Interface

Artefatos relacionados com a interface e a interacão do usuário na proposta de solução.

### Wireframes

Estes são os protótipos de telas do sistema.

![Wireframe 1](/images/wireframe1.jpg)
![Wireframe 2](/images/wireframe2.jpg)
![Wireframe 3](/images/wireframe3.jpg)
![Wireframe 4](/images/wireframe4.jpg)
![Wireframe 5](/images/wireframe5.jpg)
![Wireframe 6](/images/wireframe6.jpg)
![Wireframe 7](/images/wireframe7.jpg)

### User Flow

![Fluxo de Telas](images/User%20Flow.jpg)

### Protótipo Interativo

✅ [Protótipo Interativo (Figma)](https://near-resist-21634368.figma.site/)

# Metodologia

Detalhes sobre a organização do grupo e o ferramental empregado.

## Ferramentas

Relação de ferramentas empregadas pelo grupo durante o projeto.

| Ambiente                    | Plataforma | Link de acesso                                     |
| --------------------------- | ---------- | -------------------------------------------------- |
| Processo de Design Thinking | Miro       | https://miro.com/app/board/uXjVGttHmME=/?share_link_id=617207108658/        |
| Repositório de código     | GitHub     | https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-1-ti1-0438100-deference/      |
| Protótipo Interativo       | Figma  | https://near-resist-21634368.figma.site/   |

## Gerenciamento do Projeto

Divisão de papéis no grupo e apresentação da estrutura da ferramenta de controle de tarefas (Kanban).

![Exemplo de Kanban](images/exemplo-kanban.png)

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Nesta parte do documento, você deve apresentar  o processo de trabalho baseado nas metodologias ágeis, a divisão de papéis e tarefas, as ferramentas empregadas e como foi realizada a gestão de configuração do projeto via GitHub.
>
> Coloque detalhes sobre o processo de Design Thinking e a implementação do Framework Scrum seguido pelo grupo. O grupo poderá fazer uso de ferramentas on-line para acompanhar o andamento do projeto, a execução das tarefas e o status de desenvolvimento da solução.
>
> **Orientações**:
>
> - [Sobre Projects - GitHub Docs](https://docs.github.com/pt/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects)
> - [Gestão de projetos com GitHub | balta.io](https://balta.io/blog/gestao-de-projetos-com-github)
> - [(460) GitHub Projects - YouTube](https://www.youtube.com/playlist?list=PLiO7XHcmTsldZR93nkTFmmWbCEVF_8F5H)
> - [11 Passos Essenciais para Implantar Scrum no seu Projeto](https://mindmaster.com.br/scrum-11-passos/)
> - [Scrum em 9 minutos](https://www.youtube.com/watch?v=XfvQWnRgxG0)

# Solução Implementada

Esta seção apresenta todos os detalhes da solução criada no projeto.

## Vídeo do Projeto

O vídeo a seguir traz uma apresentação do problema que a equipe está tratando e a proposta de solução. ⚠️ EXEMPLO ⚠️

[![Vídeo do projeto](images/video.png)](https://www.youtube.com/embed/70gGoFyGeqQ)

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> O video de apresentação é voltado para que o público externo possa conhecer a solução. O formato é livre, sendo importante que seja apresentado o problema e a solução numa linguagem descomplicada e direta.
>
> Inclua um link para o vídeo do projeto.

## Funcionalidades

Esta seção apresenta as funcionalidades da solução.Info

##### Funcionalidade 1 - Cadastro de Contatos ⚠️ EXEMPLO ⚠️

Permite a inclusão, leitura, alteração e exclusão de contatos para o sistema

* **Estrutura de dados:** [Contatos](#ti_ed_contatos)
* **Instruções de acesso:**
  * Abra o site e efetue o login
  * Acesse o menu principal e escolha a opção Cadastros
  * Em seguida, escolha a opção Contatos
* **Tela da funcionalidade**:

![Tela de Funcionalidade](images/exemplo-funcionalidade.png)

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Apresente cada uma das funcionalidades que a aplicação fornece tanto para os usuários quanto aos administradores da solução.
>
> Inclua, para cada funcionalidade, itens como: (1) titulos e descrição da funcionalidade; (2) Estrutura de dados associada; (3) o detalhe sobre as instruções de acesso e uso.

## Estruturas de Dados

Descrição das estruturas de dados utilizadas na solução com exemplos no formato JSON.Info

##### Estrutura de Dados - Contatos   ⚠️ EXEMPLO ⚠️

Contatos da aplicação

```json
  {
    "id": 1,
    "nome": "Leanne Graham",
    "cidade": "Belo Horizonte",
    "categoria": "amigos",
    "email": "Sincere@april.biz",
    "telefone": "1-770-736-8031",
    "website": "hildegard.org"
  }
  
```

##### Estrutura de Dados - Usuários  ⚠️ EXEMPLO ⚠️

Registro dos usuários do sistema utilizados para login e para o perfil do sistema

```json
  {
    id: "eed55b91-45be-4f2c-81bc-7686135503f9",
    email: "admin@abc.com",
    id: "eed55b91-45be-4f2c-81bc-7686135503f9",
    login: "admin",
    nome: "Administrador do Sistema",
    senha: "123"
  }
```

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Apresente as estruturas de dados utilizadas na solução tanto para dados utilizados na essência da aplicação quanto outras estruturas que foram criadas para algum tipo de configuração
>
> Nomeie a estrutura, coloque uma descrição sucinta e apresente um exemplo em formato JSON.
>
> **Orientações:**
>
> * [JSON Introduction](https://www.w3schools.com/js/js_json_intro.asp)
> * [Trabalhando com JSON - Aprendendo desenvolvimento web | MDN](https://developer.mozilla.org/pt-BR/docs/Learn/JavaScript/Objects/JSON)

## Módulos e APIs

Esta seção apresenta os módulos e APIs utilizados na solução

**Images**:

* Unsplash - [https://unsplash.com/](https://unsplash.com/) ⚠️ EXEMPLO ⚠️

**Fonts:**

* Icons Font Face - [https://fontawesome.com/](https://fontawesome.com/) ⚠️ EXEMPLO ⚠️

**Scripts:**

* jQuery - [http://www.jquery.com/](http://www.jquery.com/) ⚠️ EXEMPLO ⚠️
* Bootstrap 4 - [http://getbootstrap.com/](http://getbootstrap.com/) ⚠️ EXEMPLO ⚠️

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Apresente os módulos e APIs utilizados no desenvolvimento da solução. Inclua itens como: (1) Frameworks, bibliotecas, módulos, etc. utilizados no desenvolvimento da solução; (2) APIs utilizadas para acesso a dados, serviços, etc.

# Referências

As referências utilizadas no trabalho foram:

* SOBRENOME, Nome do autor. Título da obra. 8. ed. Cidade: Editora, 2000. 287 p ⚠️ EXEMPLO ⚠️

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho.
>
> **Orientações**:
>
> - [Formato ABNT](https://www.normastecnicas.com/abnt/trabalhos-academicos/referencias/)
> - [Referências Bibliográficas da ABNT](https://comunidade.rockcontent.com/referencia-bibliografica-abnt/)
