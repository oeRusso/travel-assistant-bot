import axios from "axios";

/**
 * Agente encargado de identificar el destino solicitado por el usuario.
 */
export class DestinationAgent {
  private destinations = [
    { name: "Buenos Aires", description: "Ciudad cosmopolita con rica historia y cultura." },
    { name: "Cancún", description: "Playas paradisíacas, ideal para descansar y divertirse." },
    { name: "París", description: "Ciudad de la luz, famosa por su arte, moda y gastronomía." },
    { name: "Tokio", description: "Mezcla de tradición y modernidad, vibrante y única." },
  ];

  async execute(input: string): Promise<{ response: string; destination?: string }> {
    // Normalización del input para facilitar la comparación
    const normalizedInput = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const destination = this.destinations.find(d =>
      normalizedInput.includes(
        d.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      )
    );

    return {
      response: destination
        ? `Destino identificado: ${destination.name}\nDescripción: ${destination.description}\n¿Deseas consultar el clima, vuelos o planificar un itinerario?`
        : 'No se encontró un destino válido. Por favor, indica un destino conocido (ej. Cancún, París, Tokio, Buenos Aires).',
      destination: destination?.name,
    };
  }
}

/**
 * Agente encargado de consultar el clima y sugerir artículos para empacar.
 */
export class ClimateAgent {
  private API_KEY = process.env.OPENWEATHER_API_KEY;

  async execute(input: { destination: string; message: string; sessionId: string }): Promise<string> {
    try {
      const { destination } = input;
      const weather = await this.getWeather(destination);
      const packingList = this.generatePackingList(weather);

      return `Clima en ${destination}: ${weather.description}\nTemperatura: ${weather.temp}°C\nSugerencias de equipaje: ${packingList.join(", ")}`;
    } catch (error) {
      console.error("Error en ClimateAgent:", error);
      return "No se pudo obtener información del clima en este momento.";
    }
  }

  private async getWeather(destination: string) {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${destination}&units=metric&appid=${this.API_KEY}`
    );
    return {
      temp: response.data.main.temp,
      description: response.data.weather[0].description,
    };
  }

  private generatePackingList(weather: { temp: number; description: string }) {
    const items = ["Documentos", "Ropa interior", "Artículos de higiene"];
    if (weather.temp < 15) items.push("Abrigo", "Bufanda");
    if (weather.temp > 25) items.push("Protector solar", "Gorra");
    if (weather.description.toLowerCase().includes("rain")) items.push("Paraguas");
    return items;
  }
}

/**
 * Agente simulado para la búsqueda de vuelos.
 */
export class FlightAgent {
  async execute(input: { destination: string; message: string; sessionId: string }): Promise<string> {
    const { destination } = input;
    // Datos simulados de vuelos
    const flights = [
      { airline: "Airways A", price: "$300", departure: "08:00", arrival: "12:00" },
      { airline: "Airways B", price: "$350", departure: "14:00", arrival: "18:00" },
    ];

    const flightInfo = flights
      .map(f => `Aerolínea: ${f.airline}, Precio: ${f.price}, Salida: ${f.departure}, Llegada: ${f.arrival}`)
      .join("\n");

    return `Opciones de vuelo para ${destination}:\n${flightInfo}`;
  }
}

/**
 * Agente simulado para la planificación de itinerarios.
 */
export class ItineraryAgent {
  async execute(input: { destination: string; message: string; sessionId: string }): Promise<string> {
    const { destination } = input;
    const itinerary = [
      "Día 1: Llegada y registro en el hotel.",
      "Día 2: Tour por la ciudad y visita a lugares emblemáticos.",
      "Día 3: Excursión local y degustación de la gastronomía.",
      "Día 4: Día libre para compras o actividades personales.",
      "Día 5: Regreso a casa.",
    ];

    return `Itinerario sugerido para ${destination}:\n${itinerary.join("\n")}`;
  }
}
