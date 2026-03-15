# 1️⃣ CREATE – Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js and resources.js)
    participant B as Backend (Express Route)
    participant V as express-validator
    participant S as Resource Service
    participant DB as PostgreSQL

    U->>F: Submit form
    F->>F: Client-side validation
    F->>B: POST /api/resources (JSON)

    B->>V: Validate request
    V-->>B: Validation result

    alt Validation fails
        B-->>F: 400 Bad Request + errors[]
        F-->>U: Show validation message
    else Validation OK
        B->>S: create Resource(data)
        S->>DB: INSERT INTO resources
        DB-->>S: Result / Duplicate error

        alt Duplicate
            S-->>B: Duplicate detected
            B-->>F: 409 Conflict
            F-->>U: Show duplicate message
        else Success
            S-->>B: Created resource
            B-->>F: 201 Created
            F-->>U: Show success message
        end
    end
```

# 2️⃣ READ — Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js and resources.js)
    participant B as Backend (Express route)
    participant DB as PostgreSQL

    U->>F: Load /resources page
    F->>B: GET /api/resources
    B->>DB: Fetch all resources from database
    DB-->>B: Resource list
    B-->>F: 200 OK
    F-->>U: Render resource list

    alt DB error
        DB-->>B: Error
        B-->>F: 500 Database error
        F-->>U: Show error
    end    
```

# 3️⃣ UPDATE — Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js and resources.js)
    participant B as Backend (Express Route)
    participant V as express-validator
    participant S as Resource Service
    participant DB as PostgreSQL

    U->>F: Submit “Update resource” form
    F->>B: PUT /api/resources/:id
    B->>V: Validate request
    V-->>B: Validation passes
    B->>DB: Update resources in database
    DB-->>B: Updated resource
    B->>S: Log update event
    B-->>F: 200 OK
    F-->>U: Show success message / refresh list

    alt Validation fails
        V-->>B: errors
        B-->>F: 400 Bad Request
        F-->>U: Show validation errors
    end

    alt Invalid ID
        B-->>F: 400 Invalid ID
        F-->>U: Show “invalid ID” error
    end

    alt Resource not found
        DB-->>B: 0 rows updated
        B-->>F: 404 Resource not found
        F-->>U: Show “Resource not found” error
    end

    alt Duplicate
        DB-->>B: error
        B-->>F: 409 Conflict
        F-->>U: Show “Duplicate name” error
    end

    alt DB error
        DB-->>B: error
        B-->>F: 500 Database error
        F-->>U: Show error
    end
```

# 4️⃣ DELETE — Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js and resources.js)
    participant B as Backend (Express Route)
    participant S as Resource Service
    participant DB as PostgreSQL

    U->>F: Click “Delete” button
    F->>B: DELETE /api/resources/:id
    B->>DB: Delete resource from database
    DB-->>B: Deletion result
    alt Success
        B->>S: Log deletion event
        B-->>F: 204 No Content
        F-->>U: Show success message / refresh list
    end

    alt Invalid ID
        B-->>F: 400 Invalid ID
        F-->>U: Show “Invalid ID” error
    end

    alt Resource not found
        B-->>F: 404 Resource not found
        F-->>U: Show “Resource not found” error
    end

    alt DB error
        DB-->>B: error
        B-->>F: 500 Database error
        F-->>U: Show DB error
    end
```