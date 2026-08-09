import { Request, Response } from "express";
import { CartService } from "../services/cart.service";

export class CartController {
  constructor(private readonly cartService: CartService) {}

  async addToCart(req: Request, res: Response): Promise<void> {
    const { productId, quantity } = req.body;
    const userId = req.user!.id;

    const cart = await this.cartService.addToCart(userId, productId, quantity);

    res.status(200).json({
      success: true,
      data: cart,
    });
  }

  getCart = async (req: Request, res: Response): Promise<void> => {
    const cart = await this.cartService.getCart(req.user!.id);

    res.status(200).json({
      success: true,
      data: cart,
    });
  };
}
