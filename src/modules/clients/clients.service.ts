import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, IClient } from '../../models/client.schema';

@Injectable()
export class ClientsService {
  constructor(@InjectModel(Client.name) private clientModel: Model<Client>) {}

  async getAllClients(): Promise<IClient[]> {
    return await this.clientModel.find().exec();
  }

  async getClientById(id: string): Promise<IClient | null> {
    return await this.clientModel.findById(id).exec();
  }

  async getClientByIdentification(
    identification: string,
  ): Promise<IClient | null> {
    return await this.clientModel.findOne({ identification }).exec();
  }

  async getClientByContactNumber(
    contactNumber: string,
  ): Promise<IClient | null> {
    return await this.clientModel.findOne({ contactNumber }).exec();
  }

  async upsertClient(clientData: Partial<IClient>): Promise<IClient> {
    if (!clientData.contactNumber) {
      throw new Error('Se esperaba contactNumber');
    }

    const existingClient = await this.clientModel
      .findOne({ contactNumber: clientData.contactNumber })
      .exec();

    if (existingClient) {
      const updatedClient = await this.clientModel
        .findByIdAndUpdate(existingClient._id, clientData, { new: true })
        .exec();

      if (!updatedClient) {
        throw new Error('Error al actualizar cliente');
      }
      return updatedClient;
    }

    const newClient = new this.clientModel(clientData);
    return await newClient.save();
  }

  async updateClient(
    id: string,
    clientData: Partial<IClient>,
  ): Promise<IClient | null> {
    if (clientData.identification) {
      const existingClient = await this.clientModel
        .findOne({ identification: clientData.identification })
        .exec();

      if (
        existingClient &&
        existingClient._id &&
        String(existingClient._id) !== id
      ) {
        throw new Error(
          'Another client with this identification already exists',
        );
      }
    }

    return await this.clientModel
      .findByIdAndUpdate(id, clientData, { new: true })
      .exec();
  }

  async deleteClient(id: string): Promise<boolean> {
    const result = await this.clientModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
