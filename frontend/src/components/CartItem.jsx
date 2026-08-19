import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl">
      {/* Product Details */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="w-16 h-16 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-2 flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-slate-100 text-sm truncate max-w-[200px] sm:max-w-xs" title={item.name}>
            {item.name}
          </h4>
          <span className="text-xs text-sky-400 font-semibold">${item.price.toFixed(2)} each</span>
        </div>
      </div>

      {/* Controllers and Total */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        {/* Quantity control */}
        <div className="flex items-center border border-slate-800 bg-slate-950 rounded-xl overflow-hidden">
          <button
            onClick={() => onUpdateQuantity(item.product, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 disabled:text-slate-700 disabled:bg-transparent transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 text-xs font-bold text-slate-200 min-w-[24px] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.product, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 disabled:text-slate-700 disabled:bg-transparent transition-colors"
            title={item.quantity >= item.stock ? "Maximum stock reached" : "Increase quantity"}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total Price */}
        <div className="text-right min-w-[70px]">
          <span className="text-base font-extrabold text-slate-100">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>

        {/* Trash button */}
        <button
          onClick={() => onRemove(item.product)}
          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
