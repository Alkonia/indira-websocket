import mongoose from 'mongoose';
import { config } from '../config/env';

import * as fs from 'fs';
import * as path from 'path';

const modelsPath = path.join(__dirname, '../models');
fs.readdirSync(modelsPath).forEach((file) => {
  if (file.endsWith('.ts') || file.endsWith('.js')) {
    require(path.join(modelsPath, file));
  }
});

// Definir interfaces para mensajes y sesiones
interface IMessage {
  content: any;
  timestamp: Date;
  [key: string]: any;
}

interface ISession {
  id: string;
  session: any;
  updatedAt: Date;
}

// Definir esquemas para mensajes y sesiones
const messageSchema = new mongoose.Schema<IMessage>(
  {
    content: mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now },
  },
  { strict: false }
);

const sessionSchema = new mongoose.Schema<ISession>({
  id: { type: String, required: true, index: true },
  session: mongoose.Schema.Types.Mixed,
  updatedAt: { type: Date, default: Date.now },
});

// Crear modelos si no existen
const Message =
  mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);
const Session =
  mongoose.models.Session || mongoose.model<ISession>('Session', sessionSchema);

class Database {
  /**
   * Establece la conexión con MongoDB usando Mongoose
   */
  async connect(): Promise<void> {
    try {
      await mongoose.connect(config.mongodb.uri);

      // Configuración de Mongoose
      mongoose.set('strictQuery', false);

      console.log('Conexión a MongoDB establecida correctamente con Mongoose');
    } catch (error) {
      console.error('Error al conectar a MongoDB:', error);
      throw error;
    }
  }

  /**
   * Cierra la conexión con MongoDB
   */
  async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('Conexión a MongoDB cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar la conexión con MongoDB:', error);
      throw error;
    }
  }

  /**
   * Verifica si la conexión a MongoDB está activa
   * @returns true si la conexión está activa, false en caso contrario
   */
  isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  /**
   * Guarda un mensaje en la base de datos
   * @param message Mensaje a guardar
   * @returns Promesa con el mensaje guardado
   */
  async saveMessage(message: any): Promise<IMessage> {
    try {
      const newMessage = new Message({
        content: message,
        timestamp: new Date(),
      });
      return await newMessage.save();
    } catch (error) {
      console.error('Error al guardar mensaje:', error);
      throw error;
    }
  }

  /**
   * Guarda una sesión en la base de datos
   * @param id ID de la sesión
   * @param session Datos de la sesión
   * @returns Promesa con la sesión guardada
   */
  async saveSession(id: string, session: any): Promise<ISession> {
    try {
      const result = await Session.findOneAndUpdate(
        { id },
        { session, updatedAt: new Date() },
        { upsert: true, new: true }
      );
      return result;
    } catch (error) {
      console.error('Error al guardar sesión:', error);
      throw error;
    }
  }

  /**
   * Obtiene una sesión de la base de datos
   * @param id ID de la sesión
   * @returns Promesa con los datos de la sesión o null si no existe
   */
  async getSession(id: string): Promise<any> {
    try {
      const result = await Session.findOne({ id }).lean();
      return result && 'session' in result ? result.session : null;
    } catch (error) {
      console.error('Error al obtener sesión:', error);
      throw error;
    }
  }
}

// Exportar una instancia única
export const database = new Database();
