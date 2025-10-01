# Diagramas

## 1️⃣ Casos de Uso
```mermaid
flowchart TB
    subgraph Actores
        A1[Usuario no autenticado]
        A2[Usuario autenticado]
    end

    subgraph Sistema
        UC1((Consultar lista de productos))
        UC2((Consultar producto por ID))
        UC3((Iniciar sesión))
        UC4((Actualizar inventario))
    end

    A1 --> UC1
    A1 --> UC2
    A2 --> UC3
    A2 --> UC4
    UC4 --> UC3
```

---

## 2️⃣ Componentes
```mermaid
flowchart TB
    subgraph Cliente
        C1[Cliente API: Postman / App Web]
    end

    subgraph Servidor
        S1[index.js - Servidor Express]
        S2[routes/index.mjs - Router]
        S3[Middleware de Autenticación]
        S4[Controladores de Ruta]
    end

    subgraph FuenteDeDatos
        DB[(data.mjs: Usuarios y Productos)]
    end

    C1 --> S1
    S1 --> S2
    S2 --> S3
    S2 --> S4
    S3 --> S4
    S4 --> DB

```

---

## 3️⃣ Secuencia
```mermaid
sequenceDiagram
    participant Cliente
    participant Servidor as Servidor Express
    participant Router
    participant Auth as Middleware Auth
    participant Controlador
    participant DB as Fuente de Datos

    Cliente->>Servidor: PATCH /productos/1/inventario
    Servidor->>Router: Pasa petición
    Router->>Auth: Validar token
    Auth->>Auth: verify(token)
    Auth-->>Router: next()
    Router->>Controlador: Lógica de actualización
    Controlador->>DB: find({id:1})
    DB-->>Controlador: Producto encontrado
    Controlador->>Controlador: Verifica stock y tipo
    Controlador->>DB: update({cantidad: nuevaCantidad})
    Controlador-->>Servidor: JSON con producto actualizado
    Servidor-->>Cliente: 200 OK
```


