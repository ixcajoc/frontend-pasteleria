# Sistema de Gestión de Pasteles e Ingredientes
Proyecto del Prueba Tecnica desarrollado con:

- **Backend:** PHP puro para API REST
- **Frontend:** Vue.js 3 + Vite
- **Base de datos:** MySQL / MariaDB
- **Developer:** Denis Ixcajoc
- **Portafolio:** https://ixcajoc.github.io/portafolio/
- **Linkedin:** https://www.linkedin.com/in/denis-ixcajoc/


La aplicación permite administrar ingredientes, pasteles y la relación
entre ambos, además de generar un reporte detodos los pasteles con sus ingredientes.

Se complementa la experiencia con una pagina de inicio o Home Publico y un login para
simular inicio de sesion.


## Instalación paso a paso
Tener instalado Xamp o Wamp

### 1. Configuración de la base de datos

1. Inicie **XAMPP** y arranque los módulos **Apache** y **MySQL**.
2. Abra **phpMyAdmin** en el navegador: `http://localhost/phpmyadmin`
3. Vaya a la pestaña **Importar**.
4. Seleccione el archivo **`database/schema.sql`** de este proyecto en la carpeta de Backend.
5. Haga clic en **Continuar**.

Esto crea automáticamente:
- La base de datos **`pasteleria`**
- Las tablas `ingrediente`, `pastel` y `pastel_ingredientes`
- Algunos **datos de ejemplo** para probar la aplicación.

Si se tiene problema:
- Abra un docuemento sql del motor de base de datos, copie y pegue el contenido del script, ejecute por partes.
---



### 2. Backend (PHP)

1. Copie la carpeta **`backend`** dentro del directorio `htdocs` de XAMPP
    La ruta deberia quedar
   
   C:\xampp\htdocs\backend\
   
   *(En WAMP sería `C:\wamp64\www\backend\`.)*

2. Si el MySQL usa una **contraseña** para el usuario `root`, edite el archivo
   **`backend/config/database.php`** y cambie la línea:
   
   define('DB_PASS', 'Aqui_Colocar_Clave');   


   *(En XAMPP, por defecto el usuario es `root` sin contraseña, así que
   normalmente no hay que cambiar nada.)*

3. Verificar que el backend responde abriendo en el navegador:
   ```
   http://localhost/backend/index.php
   http://localhost/backend/api/ingredientes.php
   ```
   Se Debería ver una respuesta en formato **JSON**.

   Tambien puede usar Postman o Insomnia para confirmar las rutas:
   GET http://localhost/backend/api/reporte.php

---

### 3. Frontend (Vue.js)

1. Abra una terminal dentro de la carpeta **`frontend`**:

2. Instale las dependencias:
   npm install
   

3. Verifique la URL del backend en el archivo **`frontend/.env`**.
   Debe coincidir con la ruta donde se colocó el backend en `htdocs`:
   
   VITE_API_URL=http://localhost/backend/api

   Si se tiene problema, intente con el archivo **`frontend/.env.local`**.
   VITE_API_URL=http://localhost/backend/api

4. Ejecute el servidor de desarrollo: 
   npm run dev

5. Abra la aplicación en el navegador (Vite mostrará la URL, normalmente):
   ```
   http://localhost:5173
   ```

> Para generar una versión de producción: `npm run build` para generar la carpeta `dist/`.

---