import { Request, Response } from "express";

export class LoanController {
  public static createLoan = (_req: Request, res: Response): void => {
    res.status(501).json({
      success: false,
      message: "El registro de préstamos todavía no está implementado."
    });
  };

  public static getLoansByFilter = (_req: Request, res: Response): void => {
    res.status(501).json({
      success: false,
      message: "La consulta del historial todavía no está implementada."
    });
  };

  public static getLoanById = (req: Request, res: Response): void => {
    res.status(501).json({
      success: false,
      message: `La consulta del préstamo ${req.params.id} todavía no está implementada.`
    });
  };

  public static acceptLoanInventory = (req: Request, res: Response): void => {
    res.status(501).json({
      success: false,
      message: `La aceptación del préstamo ${req.params.id} todavía no está implementada.`
    });
  };
}