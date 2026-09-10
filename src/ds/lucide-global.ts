// ds/core/Icon.jsx resolves icons from the global `window.lucide.icons`, converting
// kebab-case names to PascalCase. Importing lucide's whole `icons` object would pull
// all ~2,000 icons into the bundle, so register only the ones this app actually uses.
// If an icon ever renders as a dashed placeholder square, add it here.
import {
  AlertCircle, AlertTriangle, ArrowRight, BadgeCheck, Bell, Calendar, CalendarClock,
  CalendarDays, CalendarPlus, Camera, Check, CheckCheck, CheckCircle2, ChevronDown,
  ChevronLeft, ChevronRight, ChevronUp, ClipboardCheck, ClipboardList, Clock, CloudCheck,
  Download, Droplets, FileCheck2, FileText, Filter, FlaskConical, FolderKanban, Inbox,
  Info, Kanban, Layers, LayoutDashboard, LayoutGrid, List, Mail, MapPin, Maximize2,
  MessageSquare, Minus, MoreHorizontal, Plus, Printer, Receipt, Ruler, Save, ScanBarcode,
  Search, Send, Settings2, SkipForward, TestTubes, TrendingDown, TrendingUp, Undo2,
  Upload, UserPlus, UserRoundX, Users, Wrench, X,
} from 'lucide'

const icons = {
  AlertCircle, AlertTriangle, ArrowRight, BadgeCheck, Bell, Calendar, CalendarClock,
  CalendarDays, CalendarPlus, Camera, Check, CheckCheck, CheckCircle2, ChevronDown,
  ChevronLeft, ChevronRight, ChevronUp, ClipboardCheck, ClipboardList, Clock, CloudCheck,
  Download, Droplets, FileCheck2, FileText, Filter, FlaskConical, FolderKanban, Inbox,
  Info, Kanban, Layers, LayoutDashboard, LayoutGrid, List, Mail, MapPin, Maximize2,
  MessageSquare, Minus, MoreHorizontal, Plus, Printer, Receipt, Ruler, Save, ScanBarcode,
  Search, Send, Settings2, SkipForward, TestTubes, TrendingDown, TrendingUp, Undo2,
  Upload, UserPlus, UserRoundX, Users, Wrench, X,
}

declare global {
  interface Window {
    lucide?: { icons: typeof icons }
  }
}

window.lucide = { icons }
