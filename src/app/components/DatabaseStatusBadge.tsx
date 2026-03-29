import { Database, HardDrive } from "lucide-react";
import { useDatabaseStatus } from "../hooks/useDatabaseStatus";

export function DatabaseStatusBadge() {
  const { mode, isPostgreSQL } = useDatabaseStatus();

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
        isPostgreSQL
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-gray-50 text-gray-700 border border-gray-200"
      }`}
      title={
        isPostgreSQL
          ? "Base de données PostgreSQL activée"
          : "Mode frontend-only (localStorage)"
      }
    >
      {isPostgreSQL ? (
        <Database className="w-3.5 h-3.5" />
      ) : (
        <HardDrive className="w-3.5 h-3.5" />
      )}
      <span>
        {isPostgreSQL ? "PostgreSQL" : "Local"}
      </span>
    </div>
  );
}
