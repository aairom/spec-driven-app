import { Transaction } from '@/domain/entities/transaction';
import { Account } from '@/domain/entities/account';
import { Category } from '@/domain/entities/category';
import { formatCurrency, formatDate } from '@/shared/utils/format-utils';

interface TransactionListItemProps {
  transaction: Transaction;
  account?: Account;
  category?: Category;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function TransactionListItem({ 
  transaction, 
  account, 
  category, 
  onDelete,
  onEdit 
}: TransactionListItemProps) {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? 'text-green-600' : 'text-red-600';
  const amountPrefix = isIncome ? '+' : '-';

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDate(transaction.date)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        <div className="flex flex-col">
          <span className="font-medium">{transaction.description}</span>
          {transaction.payee && (
            <span className="text-xs text-gray-500">{transaction.payee}</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {account?.name || 'Unknown'}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {category ? (
          <span className="inline-flex items-center gap-1">
            {category.icon && <span>{category.icon}</span>}
            <span>{category.name}</span>
          </span>
        ) : (
          <span className="text-gray-400">Uncategorized</span>
        )}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${amountColor}`}>
        {amountPrefix}{formatCurrency(transaction.amount)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
        {onEdit && (
          <button
            onClick={() => onEdit(transaction.id)}
            className="text-blue-600 hover:text-blue-900 font-medium"
          >
            Edit
          </button>
        )}
        <button
          onClick={() => onDelete(transaction.id)}
          className="text-red-600 hover:text-red-900 font-medium"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

// Made with Bob
