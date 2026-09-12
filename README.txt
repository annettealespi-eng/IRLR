IRLR · Etapa 3.2 · Capa de datos multidispositivo · Revision 11

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
La persistencia de respuestas utiliza Supabase como base central multidispositivo. La clave incluida en el navegador es únicamente la Publishable key. El prototipo de campo aún no constituye una arquitectura de producción con autenticación y control de acceso individual del facilitador; esa capa se implementará después de validar la experiencia de campo.

Archivos:
- configuracion.html
- participante.html
- facilitador.html
- engine.js
- styles.css
- README.txt
