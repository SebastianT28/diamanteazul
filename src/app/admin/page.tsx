import type { Metadata } from "next"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata: Metadata = {
  title: "Panel Administrador de Imágenes | Diamante Azul",
  description:
    "Panel privado de administración de imágenes y catálogo de Diamante Azul.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminPage() {
  return <AdminDashboard />
}
