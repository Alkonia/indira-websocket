import { Request, Response } from 'express';
import { whatsapp } from '../services/whatsapp';

export class WhatsAppController {
  /**
   * Obtener el estado de la conexión de WhatsApp
   */
  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const isConnected = whatsapp.isReady();
      
      res.status(200).json({
        status: isConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al obtener estado de WhatsApp:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener estado de WhatsApp',
        error: (error as Error).message
      });
    }
  }

  /**
   * Iniciar la conexión con WhatsApp
   */
  async connect(req: Request, res: Response): Promise<void> {
    try {
      if (whatsapp.isReady()) {
        res.status(200).json({
          status: 'success',
          message: 'Ya existe una conexión activa con WhatsApp'
        });
        return;
      }
      
      // Iniciar conexión de forma asíncrona
      whatsapp.connect()
        .catch(error => {
          console.error('Error al conectar con WhatsApp:', error);
        });
      
      res.status(202).json({
        status: 'pending',
        message: 'Iniciando conexión con WhatsApp. Verifica la terminal para escanear el código QR si es necesario.'
      });
    } catch (error) {
      console.error('Error al iniciar conexión con WhatsApp:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al iniciar conexión con WhatsApp',
        error: (error as Error).message
      });
    }
  }

  /**
   * Enviar un mensaje de texto
   */
  async sendTextMessage(req: Request, res: Response): Promise<void> {
    try {
      const { to, text } = req.body;
      
      if (!to || !text) {
        res.status(400).json({
          status: 'error',
          message: 'Se requieren los campos "to" y "text"'
        });
        return;
      }
      
      if (!whatsapp.isReady()) {
        res.status(400).json({
          status: 'error',
          message: 'No hay conexión activa con WhatsApp'
        });
        return;
      }
      
      const result = await whatsapp.sendTextMessage(to, text);
      
      res.status(200).json({
        status: 'success',
        message: 'Mensaje enviado correctamente',
        result
      });
    } catch (error) {
      console.error('Error al enviar mensaje de texto:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al enviar mensaje de texto',
        error: (error as Error).message
      });
    }
  }

  /**
   * Enviar un mensaje con contenido multimedia
   */
  async sendMediaMessage(req: Request, res: Response): Promise<void> {
    try {
      const { to, url, caption, type } = req.body;
      
      if (!to || !url) {
        res.status(400).json({
          status: 'error',
          message: 'Se requieren los campos "to" y "url"'
        });
        return;
      }
      
      if (!whatsapp.isReady()) {
        res.status(400).json({
          status: 'error',
          message: 'No hay conexión activa con WhatsApp'
        });
        return;
      }
      
      const result = await whatsapp.sendMediaMessage(
        to,
        { url },
        caption,
        type || 'image'
      );
      
      res.status(200).json({
        status: 'success',
        message: 'Mensaje multimedia enviado correctamente',
        result
      });
    } catch (error) {
      console.error('Error al enviar mensaje multimedia:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al enviar mensaje multimedia',
        error: (error as Error).message
      });
    }
  }

  /**
   * Cerrar sesión de WhatsApp
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      if (!whatsapp.isReady()) {
        res.status(400).json({
          status: 'error',
          message: 'No hay conexión activa con WhatsApp'
        });
        return;
      }
      
      await whatsapp.logout();
      
      res.status(200).json({
        status: 'success',
        message: 'Sesión cerrada correctamente'
      });
    } catch (error) {
      console.error('Error al cerrar sesión de WhatsApp:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al cerrar sesión de WhatsApp',
        error: (error as Error).message
      });
    }
  }
}

// Exportar una instancia única
export const whatsappController = new WhatsAppController();
