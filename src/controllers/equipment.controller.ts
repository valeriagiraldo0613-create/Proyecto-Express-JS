import { Request, Response } from "express";
import {
  equipment,
  environments,
  getNextEquipmentId,
  Equipment
} from "../data/store";

export class EquipmentController {
  static getAll = (req: Request, res: Response): void => {
    let result = equipment;

    if (req.query.ambienteId !== undefined) {
      const ambienteId = Number(req.query.ambienteId);

      if (!Number.isInteger(ambienteId) || ambienteId <= 0) {
        res.status(400).json({
          success: false,
          message: "El ambienteId no es válido."
        });
        return;
      }

      result = equipment.filter(e => e.ambienteId === ambienteId);
    }

    res.json({ success: true, data: result });
  };

  static create = (req: Request, res: Response): void => {
    const { nombre, ambienteId, ubicacion } = req.body;

    if (
      !nombre ||
      !ubicacion ||
      !Number.isInteger(ambienteId) ||
      ambienteId <= 0
    ) {
      res.status(400).json({
        success: false,
        message: "Indica nombre, ubicación y ambienteId válido."
      });
      return;
    }

    const environment = environments.find(e => e.id === ambienteId);

    if (!environment || environment.estado !== "activo") {
      res.status(400).json({
        success: false,
        message: "El ambiente no existe o está inactivo."
      });
      return;
    }

    const item: Equipment = {
      id: getNextEquipmentId(),
      nombre,
      ambienteId,
      ubicacion,
      estado: "operativo"
    };

    equipment.push(item);

    res.status(201).json({
      success: true,
      message: "Equipo registrado.",
      data: item
    });
  };

  static update = (req: Request, res: Response): void => {
    const item = equipment.find(
      e => e.id === Number(req.params.id)
    );

    if (!item) {
      res.status(404).json({
        success: false,
        message: "Equipo no encontrado."
      });
      return;
    }

    const { estado, ubicacion, ambienteId, nombre } = req.body;

    if (
      estado !== undefined &&
      !["operativo", "mantenimiento", "fuera_de_servicio"].includes(estado)
    ) {
      res.status(400).json({
        success: false,
        message: "Estado técnico inválido."
      });
      return;
    }

    if (
      ambienteId !== undefined &&
      (!Number.isInteger(ambienteId) ||
        !environments.some(
          e => e.id === ambienteId && e.estado === "activo"
        ))
    ) {
      res.status(400).json({
        success: false,
        message: "El nuevo ambiente no existe o está inactivo."
      });
      return;
    }

    if (estado !== undefined) item.estado = estado;
    if (ubicacion !== undefined) item.ubicacion = ubicacion;
    if (ambienteId !== undefined) item.ambienteId = ambienteId;
    if (nombre !== undefined) item.nombre = nombre;

    res.json({
      success: true,
      message: "Equipo actualizado.",
      data: item
    });
  };
}