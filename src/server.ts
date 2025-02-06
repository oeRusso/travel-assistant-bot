import express from 'express';
import dotenv from 'dotenv';
import { SessionManager, resetSession } from './session';
import { DestinationAgent, ClimateAgent, FlightAgent, ItineraryAgent } from './agents';

dotenv.config();

const app = express();
app.use(express.json());

// Inicialización de gestores y agentes
const sessionManager = new SessionManager();
const destinationAgent = new DestinationAgent();
const climateAgent = new ClimateAgent();
const flightAgent = new FlightAgent();
const itineraryAgent = new ItineraryAgent();

/**
 * Endpoint principal para interactuar con el asistente de viajes.
 * Se espera un objeto JSON con "message" y "sessionId".
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const session = sessionManager.getOrCreateSession(sessionId);

    // Permitir reiniciar el hilo de conversación
    if (message.toLowerCase().includes("cambiar de tema") || message.toLowerCase().includes("reset")) {
      resetSession(session);
      return res.json({ response: "Conversación reiniciada. ¿En qué puedo ayudarte?" });
    }

    // Si no se ha seleccionado destino, se asume que el usuario está buscando uno
    if (!session.currentDestination) {
      const result = await destinationAgent.execute(message);
      if (result.destination) {
        session.currentDestination = result.destination;
        session.currentTopic = "destino";
      }
      return res.json({ response: result.response });
    }

    // Determinar la intención según el contenido del mensaje

    // Si el mensaje menciona "vuelo" se invoca al FlightAgent
    if (message.toLowerCase().includes("vuelo") || message.toLowerCase().includes("vuelos")) {
      session.currentTopic = "vuelos";
      const flightResponse = await flightAgent.execute({
        destination: session.currentDestination,
        message,
        sessionId,
      });
      return res.json({ response: flightResponse });
    }

    // Si el mensaje menciona "itinerario" o "planificar", se invoca al ItineraryAgent
    if (message.toLowerCase().includes("itinerario") || message.toLowerCase().includes("planificar")) {
      session.currentTopic = "itinerario";
      const itineraryResponse = await itineraryAgent.execute({
        destination: session.currentDestination,
        message,
        sessionId,
      });
      return res.json({ response: itineraryResponse });
    }

    // Por defecto, se consulta el clima y se sugieren artículos para empacar
    session.currentTopic = "clima";
    const weatherResponse = await climateAgent.execute({
      destination: session.currentDestination,
      message,
      sessionId,
    });
    return res.json({ response: weatherResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error processing request' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
