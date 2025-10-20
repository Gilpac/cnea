import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, FileText, Trophy, LogOut, Menu } from "lucide-react";
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
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logoCnea from "@/assets/logo-cnea.png";
import profilePhoto from "@/assets/profile-photo.png";
import Profile from "./candidate/Profile";
import Enrollment from "./candidate/Enrollment";
import Results from "./candidate/Results";

const menuItems = [
  { id: "profile", title: "Perfil", icon: User },
  { id: "enrollment", title: "Inscrição", icon: FileText },
  { id: "results", title: "Resultado Final", icon: Trophy },
];

const CandidateSidebar = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
  return (
    <Sidebar className="border-r bg-card/50 backdrop-blur-sm">
      <div className="p-6 border-b bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-14 w-14 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
              <AvatarImage src={profilePhoto} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">KS</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">Kelson Silva</p>
            <p className="text-xs text-muted-foreground truncate">portal@gmail.com</p>
            <p className="text-xs text-primary font-medium mt-0.5">Aluno Ativo</p>
          </div>
        </div>
      </div>
      
      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Menu do Aluno
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.id)}
                    isActive={activeTab === item.id}
                    className="cursor-pointer mx-2 rounded-lg transition-all hover:scale-[1.02]"
                  >
                    <div className={`p-1.5 rounded-md ${activeTab === item.id ? 'bg-primary/20' : 'bg-muted/50'}`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{item.title}</span>
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
      <SheetContent side="left" className="p-0 w-64 bg-card/95 backdrop-blur-xl">
        <div className="p-6 border-b bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                <AvatarImage src={profilePhoto} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">KS</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
            </div>
            <div>
              <p className="text-sm font-bold">Kelson Silva</p>
              <p className="text-xs text-muted-foreground">portal@gmail.com</p>
              <p className="text-xs text-primary font-medium mt-0.5">Aluno Ativo</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start rounded-lg transition-all hover:scale-[1.02]"
                onClick={() => {
                  setActiveTab(item.id);
                  setOpen(false);
                }}
              >
                <div className={`p-1.5 rounded-md mr-2 ${activeTab === item.id ? 'bg-primary/20' : 'bg-muted/50'}`}>
                  <item.icon className="h-4 w-4" />
                </div>
                {item.title}
              </Button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const CandidatePortal = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [fullName, setFullName] = useState("Kelson Silva");
  const [emailDisplay, setEmailDisplay] = useState("portal@gmail.com");

  useEffect(() => {
    const checkUser = async () => {
      setCheckingAuth(true);
      const { data } = await supabase.auth.getUser();
      const userId = data?.user?.id;
      const userEmail = data?.user?.email;
      if (!userId) {
        navigate("/login");
        return;
      }
      // busca profile para role e full_name
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", userId)
        .single();

      if (!error && profile) {
        if (profile.role === "admin") {
          navigate("/admin");
          return;
        }
        if (profile.full_name) setFullName(profile.full_name);
      }
      if (userEmail) setEmailDisplay(userEmail);
      setCheckingAuth(false);
    };
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "enrollment":
        return <Enrollment />;
      case "results":
        return <Results />;
      default:
        return <Profile />;
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Verificando sessão...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-muted/30 to-primary/5">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <CandidateSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-xl border-b border-border/50 shadow-lg sticky top-0 z-10">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <MobileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <SidebarTrigger className="hidden md:block p-2 hover:bg-primary/10 rounded-lg transition-colors" />
                <div className="flex items-center gap-3 px-3 py-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                  <img src={logoCnea} alt="Logo CNEA" className="w-8 h-8 sm:w-10 sm:h-10" />
                  <div className="hidden sm:block">
                    <h1 className="font-bold text-base sm:text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Portal do Aluno
                    </h1>
                    <p className="text-xs text-muted-foreground">CNEA</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right mr-3">
                  <span className="text-sm font-bold truncate">{fullName}</span>
                  <span className="text-xs text-muted-foreground truncate">{emailDisplay}</span>
                </div>
                <Button variant="outline" onClick={handleLogout} size="sm" className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CandidatePortal;
