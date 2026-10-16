import { Request, Response } from "express";
import {
  users,
  getNextUserId,
  User
} from "../data/store";

export class UserController {
  static getAll = (_req: Request, res: Response): void => {
    res.json({
      success: true,
      data: users.map(({ password, ...user }) => user)
    });
  };

  static create = (req: Request, res: Response): void => {
    const { nombre, email, rol, password } = req.body;

    if (!nombre || !email || !rol || !password) {
      res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios."
      });
      return;
    }

    if (!["estudiante", "docente", "administrador"].includes(rol)) {
      res.status(400).json({
        success: false,
        message: "El rol no es válido."
      });
      return;
    }

    if (users.some(user => user.email === email)) {
      res.status(409).json({
        success: false,
        message: "El correo ya está registrado."
      });
      return;
    }

    const user: User = {
      id: getNextUserId(),
      nombre,
      email,
      rol,
      password,
      estado: "activo"
    };

    users.push(user);

    const { password: _password, ...safeUser } = user;

    res.status(201).json({
      success: true,
      message: "Usuario creado correctamente.",
      data: safeUser
    });
  };

  static getById = (req: Request, res: Response): void => {
    const user = users.find(u => u.id === Number(req.params.id));

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Usuario no encontrado."
      });
      return;
    }

    const { password, ...safeUser } = user;
    res.json({ success: true, data: safeUser });
  };

  static update = (req: Request, res: Response): void => {
    const user = users.find(u => u.id === Number(req.params.id));

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Usuario no encontrado."
      });
      return;
    }

    const { rol, estado, password } = req.body;

    if (
      rol !== undefined &&
      !["estudiante", "docente", "administrador"].includes(rol)
    ) {
      res.status(400).json({
        success: false,
        message: "El rol no es válido."
      });
      return;
    }

    if (
      estado !== undefined &&
      !["activo", "inactivo"].includes(estado)
    ) {
      res.status(400).json({
        success: false,
        message: "El estado no es válido."
      });
      return;
    }

    if (password !== undefined && typeof password !== "string") {
      res.status(400).json({
        success: false,
        message: "La contraseña debe ser texto."
      });
      return;
    }

    if (rol !== undefined) user.rol = rol;
    if (estado !== undefined) user.estado = estado;
    if (password !== undefined) user.password = password;

    const { password: _password, ...safeUser } = user;

    res.json({
      success: true,
      message: "Usuario actualizado.",
      data: safeUser
    });
  };

  static delete = (req: Request, res: Response): void => {
    const user = users.find(u => u.id === Number(req.params.id));

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Usuario no encontrado."
      });
      return;
    }

    user.estado = "inactivo";

    res.json({
      success: true,
      message: "Usuario desactivado correctamente."
    });
  };
}