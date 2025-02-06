/**
 * Interfaz que define el contexto de conversación de un usuario.
 */
export interface ConversationSession {
  currentDestination: string | null;
  currentTopic: string | null;
  lastInteraction: Date;
  
}

/**
 * Clase para gestionar las sesiones de conversación.
 */
export class SessionManager {
  private sessions: Map<string, ConversationSession> = new Map();

  getOrCreateSession(sessionId: string): ConversationSession {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        currentDestination: null,
        currentTopic: null,
        lastInteraction: new Date(),
      });
    } else {
      const session = this.sessions.get(sessionId)!;
      session.lastInteraction = new Date();
    }
    return this.sessions.get(sessionId)!;
  }
}

/**
 * Función auxiliar para reiniciar el estado de una sesión.
 */
export function resetSession(session: ConversationSession): void {
  session.currentDestination = null;
  session.currentTopic = null;
  session.lastInteraction = new Date();
}
