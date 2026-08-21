import { Request, Response } from "express";
import { CartService } from "../services/cart.service";
import { asyncHandler } from "../../../core/asyncHandler";

export class CartController {
  constructor(private readonly cartService: CartService) {}

  addToCart = asyncHandler(async (req: Request, res: Response) => {
    const { productId, quantity } = req.body;
    const userId = req.user!.id;

    const cart = await this.cartService.addToCart(userId, productId, quantity);

    res.status(200).json({
      success: true,
      data: cart,
    });
  });

  getCart = asyncHandler(async (req: Request, res: Response) => {
    const cart = await this.cartService.getCart(req.user!.id);

    res.status(200).json({
      success: true,
      data: cart,
    });
  });

  removeFromCart = asyncHandler(async (req: Request, res: Response) => {
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
  });

  updateCartItem = asyncHandler(async (req: Request, res: Response) => {
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
  });

  clearCart = asyncHandler(async (req: Request, res: Response) => {
    const cart = await this.cartService.clearCart(req.user!.id);

    res.status(200).json({
      success: true,
      data: cart,
    });
  });
}
