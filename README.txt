IRLR · Etapa 3.1 · Revision 8

Incluye:
- Experiencia participante y facilitador.
- Configuración de organización, grupo, sesión y versión lingüística.
- ID único de aplicación para separar sesiones y conservar histórico.
- Identificación del participante mediante nombre + correo electrónico.
- Bloqueo de segunda respuesta del mismo correo dentro de la misma aplicación/sesión.
- Motor determinístico IRLR, dominios, exposición normalizada, predominancia y clasificación D-07.
- Registro persistente de respuestas y resultados calculados.
- Exportación CSV de sesión y de base completa con respuestas, resultados por dominio, dominio(s) de mayor exposición, co-predominancia e indicadores principales.

Nota de prototipo:
La persistencia utiliza localStorage del navegador. Esto permite validar el flujo funcional, pero no constituye una arquitectura de producción multiusuario ni un control de seguridad real. Para producción, el repositorio, autenticación, roles y unicidad deberán trasladarse a un backend/base de datos.

Archivos:
- configuracion.html
- participante.html
- facilitador.html
- engine.js
- styles.css
- README.txt
