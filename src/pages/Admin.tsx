import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Users, BookOpen, GraduationCap, Menu } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logoCnea from "@/assets/logo-cnea.png";
import Members from "./admin/Members";
import Courses from "./admin/Courses";
import Students from "./admin/Students";

const menuItems = [
  { id: "members", title: "Membros", icon: Users },
  { id: "courses", title: "Cursos", icon: BookOpen },
  { id: "students", title: "Formandos", icon: GraduationCap },
];

const AdminSidebar = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Administrativo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.id)}
                    isActive={activeTab === item.id}
                    className="cursor-pointer"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

const MobileSidebar = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <img src={logoCnea} alt="Logo CNEA" className="w-8 h-8" />
            <div>
              <h2 className="font-bold text-sm">Painel Admin</h2>
              <p className="text-xs text-muted-foreground">CNEA</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab(item.id);
                  setOpen(false);
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("members");

  const handleLogout = () => {
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "members":
        return <Members />;
      case "courses":
        return <Courses />;
      case "students":
        return <Students />;
      default:
        return <Members />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-b from-background to-muted">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-background/40 backdrop-blur-lg border-b border-border/50 shadow-sm sticky top-0 z-10">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <MobileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <SidebarTrigger className="hidden md:block" />
                <img src={logoCnea} alt="Logo CNEA" className="w-8 h-8 sm:w-10 sm:h-10" />
                <div className="hidden sm:block">
                  <h1 className="font-bold text-base sm:text-lg">Painel Administrativo</h1>
                  <p className="text-xs text-muted-foreground">CNEA</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout} size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
