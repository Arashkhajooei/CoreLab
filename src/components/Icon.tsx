import {
  AlignLeft,
  Banknote,
  Box,
  Braces,
  Calendar,
  Clock,
  Database,
  FolderKanban,
  GitBranch,
  Hash,
  LayoutDashboard,
  Link as LinkIcon,
  Package,
  Palette,
  Percent,
  Plus,
  ShoppingCart,
  Star,
  ToggleLeft,
  Trash2,
  Type,
  User,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'

const REGISTRY: Record<string, LucideIcon> = {
  'align-left': AlignLeft,
  banknote: Banknote,
  box: Box,
  braces: Braces,
  calendar: Calendar,
  clock: Clock,
  database: Database,
  'folder-kanban': FolderKanban,
  'git-branch': GitBranch,
  hash: Hash,
  'layout-dashboard': LayoutDashboard,
  link: LinkIcon,
  package: Package,
  palette: Palette,
  percent: Percent,
  plus: Plus,
  'shopping-cart': ShoppingCart,
  star: Star,
  'toggle-left': ToggleLeft,
  trash: Trash2,
  type: Type,
  user: User,
  users: Users,
  x: X,
}

export default function Icon({
  name,
  className,
  size = 18,
}: {
  name: string
  className?: string
  size?: number
}) {
  const Cmp = REGISTRY[name] ?? Box
  return <Cmp size={size} className={className} />
}
