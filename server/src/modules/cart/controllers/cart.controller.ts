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

  removeFromCart = async (req: Request, res: Response): Promise<void> => {
    const { productId } = req.params;
    // const productIdValue = Array.isArray(productId) ? productId[0] : productId;
    const cart = await this.cartService.removeFromCart(
      req.user!.id,
      productId as string,
    );

    res.status(200).json({
      success: true,
      data: cart,
    });
  };

  updateCartItem = async (req: Request, res: Response): Promise<void> => {
    const productId = req.params.productId as string;
    const { quantity } = req.body;

    const cart = await this.cartService.updateCartItem(
      req.user!.id,
      productId,
      quantity,
    );

    res.status(200).json({
      success: true,
      data: cart,
    });
  };

  clearCart = async (req: Request, res: Response): Promise<void> => {
    const cart = await this.cartService.clearCart(req.user!.id);

    res.status(200).json({
      success: true,
      data: cart,
    });
  };
}
