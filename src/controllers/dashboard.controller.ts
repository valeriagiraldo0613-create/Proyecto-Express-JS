import { Request, Response } from "express";
import {
  users,
  environments,
  equipment,
  incidents
} from "../data/store";

export class DashboardController {
  static getSummary = (_req: Request, res: Response): void => {
    const resumen = {
      totalUsuarios: users.filter(
        user => user.estado === "activo"
      ).length,

      ambientesActivos: environments.filter(
        environment => environment.estado === "activo"
      ).length,

      equiposOperativos: equipment.filter(
        item => item.estado === "operativo"
      ).length,

      novedadesCriticasSinResolver: incidents.filter(
        incident =>
          incident.critica && incident.estado !== "resuelto"
      ).length
    };

    res.json({
      success: true,
      message: "Resumen del dashboard obtenido correctamente.",
      data: resumen
    });
  };
}   