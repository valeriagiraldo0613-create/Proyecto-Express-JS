import { Request, Response } from "express";
import {
  incidents,
  equipment,
  environments,
  getNextIncidentId,
  Incident
} from "../data/store";

export class IncidentController {
  static getAll = (_req: Request, res: Response): void => {
    res.json({ success: true, data: incidents });
  };

  static create = (req: Request, res: Response): void => {
    const {
      descripcion,
      equipoId,
      ambienteId,
      critica = false
    } = req.body;

    if (!descripcion || typeof descripcion !== "string") {
      res.status(400).json({
        success: false,
        message: "La descripción es obligatoria."
      });
      return;
    }

    if (equipoId === undefined && ambienteId === undefined) {
      res.status(400).json({
        success: false,
        message: "Relaciona la novedad con un equipo o ambiente."
      });
      return;
    }

    if (
      equipoId !== undefined &&
      !equipment.some(e => e.id === equipoId)
    ) {
      res.status(400).json({
        success: false,
        message: "El equipo indicado no existe."
      });
      return;
    }

    if (
      ambienteId !== undefined &&
      !environments.some(e => e.id === ambienteId)
    ) {
      res.status(400).json({
        success: false,
        message: "El ambiente indicado no existe."
      });
      return;
    }

    if (typeof critica !== "boolean") {
      res.status(400).json({
        success: false,
        message: "El campo critica debe ser true o false."
      });
      return;
    }

    const incident: Incident = {
      id: getNextIncidentId(),
      descripcion,
      ...(equipoId !== undefined ? { equipoId } : {}),
      ...(ambienteId !== undefined ? { ambienteId } : {}),
      estado: "pendiente",
      critica,
      fecha: new Date().toISOString()
    };

    incidents.push(incident);

    res.status(201).json({
      success: true,
      message: "Novedad registrada.",
      data: incident
    });
  };

  static update = (req: Request, res: Response): void => {
    const incident = incidents.find(
      i => i.id === Number(req.params.id)
    );

    if (!incident) {
      res.status(404).json({
        success: false,
        message: "Novedad no encontrada."
      });
      return;
    }

    const { estado } = req.body;

    if (
      !["pendiente", "en_proceso", "resuelto"].includes(estado)
    ) {
      res.status(400).json({
        success: false,
        message: "Indica un estado válido."
      });
      return;
    }

    incident.estado = estado;

    res.json({
      success: true,
      message: "Estado de la novedad actualizado.",
      data: incident
    });
  };
}