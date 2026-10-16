import { Request, Response } from "express";
import {
  environments,
  getNextEnvironmentId,
  Environment
} from "../data/store";

export class EnvironmentController {
  static getAll = (_req: Request, res: Response): void => {
    res.json({ success: true, data: environments });
  };

  static create = (req: Request, res: Response): void => {
    const { nombre, capacidad, ubicacion } = req.body;

    if (
      !nombre ||
      !ubicacion ||
      !Number.isInteger(capacidad) ||
      capacidad <= 0
    ) {
      res.status(400).json({
        success: false,
        message: "Indica nombre, ubicación y capacidad positiva."
      });
      return;
    }

    const environment: Environment = {
      id: getNextEnvironmentId(),
      nombre,
      capacidad,
      ubicacion,
      estado: "activo"
    };

    environments.push(environment);

    res.status(201).json({
      success: true,
      message: "Ambiente creado.",
      data: environment
    });
  };

  static update = (req: Request, res: Response): void => {
    const environment = environments.find(
      e => e.id === Number(req.params.id)
    );

    if (!environment) {
      res.status(404).json({
        success: false,
        message: "Ambiente no encontrado."
      });
      return;
    }

    const { nombre, capacidad, ubicacion, estado } = req.body;

    if (
      capacidad !== undefined &&
      (!Number.isInteger(capacidad) || capacidad <= 0)
    ) {
      res.status(400).json({
        success: false,
        message: "La capacidad debe ser un entero positivo."
      });
      return;
    }

    if (
      estado !== undefined &&
      !["activo", "inactivo"].includes(estado)
    ) {
      res.status(400).json({
        success: false,
        message: "Estado inválido."
      });
      return;
    }

    if (nombre !== undefined) environment.nombre = nombre;
    if (capacidad !== undefined) environment.capacidad = capacidad;
    if (ubicacion !== undefined) environment.ubicacion = ubicacion;
    if (estado !== undefined) environment.estado = estado;

    res.json({
      success: true,
      message: "Ambiente actualizado.",
      data: environment
    });
  };
}