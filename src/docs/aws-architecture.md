
# Arquitetura AWS para Escalonamento do Sistema de Inspeção de Salas

## Objetivo
Este documento descreve uma arquitetura baseada em AWS Free Tier que permite escalonar o sistema de inspeção de salas para uso empresarial.

## Componentes AWS Recomendados (Free Tier)

### Armazenamento e Banco de Dados
- **Amazon DynamoDB**: Banco de dados NoSQL para armazenar informações sobre salas, torres, equipamentos e relatórios de inspeção
  - Tabelas principais: Towers, Rooms, Inspections, Equipment, Reports, Users
  - Free Tier: 25GB de armazenamento, 25 unidades de capacidade de leitura/escrita
  
- **Amazon S3**: Para armazenamento de mídia (fotos de inspeções)
  - Bucket para fotos de inspeções
  - Free Tier: 5GB de armazenamento, 20.000 solicitações GET, 2.000 solicitações PUT

### Autenticação e Autorização
- **Amazon Cognito**: Gerenciamento de usuários e autenticação
  - Pools de usuários para diferentes perfis (admin, supervisor, inspetor)
  - Free Tier: 50.000 usuários ativos mensais

### Backend
- **AWS Lambda**: Funções serverless para processamento de dados
  - Funções para processamento de relatórios, notificações e análise de dados
  - Free Tier: 1 milhão de solicitações gratuitas por mês, 3,2 milhões de segundos de computação
  
- **Amazon API Gateway**: API RESTful para comunicação entre front-end e backend
  - Free Tier: 1 milhão de chamadas API por mês

### Hospedagem Frontend
- **Amazon S3 + CloudFront**: Para hospedagem do frontend React
  - S3 para armazenamento estático
  - CloudFront para CDN
  - Free Tier: Limitado, mas econômico para início

### Processamento de Imagens e IA
- **AWS Rekognition**: Para análise automática de imagens de inspeção
  - Detecção de problemas em equipamentos
  - Free Tier: 5.000 imagens processadas por mês

### Monitoramento e Logs
- **Amazon CloudWatch**: Monitoramento e logs
  - Free Tier: 10 métricas personalizadas, 5GB de logs

## Arquitetura Proposta

```
+------------------+    +----------------+    +---------------+
| Frontend React   |--->| API Gateway    |--->| Lambda        |
| (S3 + CloudFront)|    |                |    | Functions     |
+------------------+    +----------------+    +-------+-------+
                                                      |
                       +----------------+             |
                       | Cognito        |<------------+
                       | (Autenticação) |             |
                       +----------------+             v
                                               +------+------+
                                               | DynamoDB    |
                                               | (Dados)     |
                                               +------+------+
                                                      |
                                               +------+------+
                                               | S3 Bucket   |
                                               | (Imagens)   |
                                               +-------------+
```

## Implementação em Fases

### Fase 1: Migração Inicial
1. Configurar DynamoDB para armazenar dados estruturados
2. Implementar autenticação com Cognito
3. Criar bucket S3 para armazenamento de fotos
4. Desenvolver Lambda functions básicas para CRUD

### Fase 2: Escalonamento
1. Implementar processamento assíncrono para relatórios
2. Adicionar análise básica de imagens com Rekognition
3. Configurar CloudFront para entrega global

### Fase 3: Otimização e Monitoramento
1. Implementar análises avançadas de desempenho
2. Configurar alertas e monitoramento
3. Otimizar custos e desempenho

## Considerações para API

Para facilitar a integração com esta arquitetura AWS, recomendamos implementar os seguintes adaptadores no frontend:

1. Serviço de API centralizado que pode alternar entre modo de desenvolvimento (dados fictícios) e produção (AWS)
2. Adaptadores para autenticação com Cognito
3. Serviço de upload de imagens para S3
4. Estratégia de cache para reduzir chamadas à API

## Estimativa de Custo Mensal (Free Tier)

| Serviço      | Uso Estimado                    | Custo no Free Tier |
|--------------|----------------------------------|-------------------|
| DynamoDB     | < 25 GB, < 25 WCU/RCU           | $0                |
| S3           | < 5 GB, < 20k GET, < 2k PUT     | $0                |
| Lambda       | < 1M invocações                 | $0                |
| API Gateway  | < 1M chamadas                   | $0                |
| Cognito      | < 50k usuários ativos           | $0                |
| CloudWatch   | Básico                          | $0                |
| Rekognition  | < 5k imagens                    | $0                |
| **Total**    |                                 | **$0**            |

Após o período do Free Tier ou com uso acima dos limites, estima-se um custo entre $50-$200/mês dependendo do volume de uso.
