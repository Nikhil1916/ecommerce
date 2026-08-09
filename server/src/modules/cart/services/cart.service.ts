import { ApiError } from "../../../core/ApiError";
import { IProductRepository } from "../../product/repositories/product.repository";
import { Cart, CartWithProducts } from "../models/cart.model";
import { ICartRepository } from "../repositories/cart.repository";

export class CartService {
  constructor(
    private cartRepository: ICartRepository,
    private productRepository: IProductRepository,
  ) {}

  async getCart(userId: string): Promise<CartWithProducts | Cart> {
    const cart = await this.cartRepository.findByUserId(userId);

    if (!cart) {
      const newCart = await this.cartRepository.create(userId);
      return newCart;
    }

    if (cart.items.length === 0) {
      return cart;
    }

    const cartWithProducts =
      await this.cartRepository.getCartWithProducts(userId);

    if (!cartWithProducts) {
      throw new ApiError(500, "Failed to fetch cart");
    }

    return cartWithProducts;
  }

  async addToCart(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart> {
    if (quantity <= 0) {
      throw new ApiError(400, "Quantity must be greater than 0");
    }

    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    let cart = await this.cartRepository.findByUserId(userId);

    if (!cart) {
      cart = await this.cartRepository.create(userId);
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        throw new ApiError(400, "Insufficient stock");
      }

      const updatedCart = await this.cartRepository.incrementItemQuantity(
        userId,
        productId,
        quantity,
      );

      if (!updatedCart) {
        throw new ApiError(500, "Failed to update cart");
      }

      return updatedCart;
    }

    if (quantity > product.stock) {
      throw new ApiError(400, "Insufficient stock");
    }

    const updatedCart = await this.cartRepository.addItem(
      userId,
      productId,
      quantity,
    );

    if (!updatedCart) {
      throw new ApiError(500, "Failed to add item to cart");
    }

    return updatedCart;
  }

  async removeFromCart(userId: string, productId: string): Promise<Cart> {
    const updatedCart = await this.cartRepository.removeItem(userId, productId);

    if (!updatedCart) {
      throw new ApiError(404, "Cart item not found");
    }

    return updatedCart;
  }

  async updateCartItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (quantity > product.stock) {
      throw new ApiError(400, "Insufficient stock");
    }

    const updatedCart = await this.cartRepository.updateItemQuantity(
      userId,
      productId,
      quantity,
    );

    if (!updatedCart) {
      throw new ApiError(404, "Cart item not found");
    }

    return updatedCart;
  }

  async clearCart(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.clearCart(userId);

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    return cart;
  }
}
