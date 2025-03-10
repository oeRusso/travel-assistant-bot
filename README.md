# Travel Assistant

Travel Assistant es una aplicación basada en Node.js y TypeScript que actúa como un asistente digital para planificar viajes. La aplicación integra múltiples agentes para brindar sugerencias sobre destinos, consultar el clima, buscar vuelos y planificar itinerarios. Está diseñada para gestionar conversaciones de forma básica, permitiendo a los usuarios cambiar de tema y retomar conversaciones previas sin perder el contexto.

## Características

- **Flujo Multi-Agente**:
  - **DestinationAgent**: Identifica el destino solicitado y muestra una descripción.
  - **ClimateAgent**: Consulta el clima del destino mediante la API de [OpenWeatherMap](https://openweathermap.org/api) y sugiere artículos para empacar.
  - **FlightAgent**: (Simulado) Proporciona opciones de vuelo para el destino seleccionado.
  - **ItineraryAgent**: (Simulado) Genera un itinerario básico de viaje.

- **Manejo de Conversaciones**:
  - Gestión de sesiones para mantener el contexto (destino, tema actual).
  - Comandos para reiniciar o cambiar el tema (por ejemplo, "cambiar de tema" o "reset").

- **Tecnologías Utilizadas**:
  - [Node.js](https://nodejs.org/)
  - [Express.js](https://expressjs.com/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Axios](https://axios-http.com/)

## Uso

## Uso

La aplicación expone un endpoint HTTP para interactuar con el asistente de viajes.

-Instalar las dependencias npm install
-npm run dev    
- **Endpoint:** `POST /api/chat`
- **Formato del cuerpo de la solicitud (JSON):**

  ```json
  {
    "message": "quiero ir a cancun",
    "sessionId": "nueva-session-890"
  },
  {"message": "Me gustaría viajar a París", "sessionId": "session1"},
  {"message": "¿Cómo está el clima?", "sessionId": "session1"},
  {"message": "Muéstrame opciones de vuelos", "sessionId": "session1"},
  {"message": "Quiero planificar mi itinerario", "sessionId": "session1"}







#   t r a v e l - a s s i s t a n t - b o t  
 