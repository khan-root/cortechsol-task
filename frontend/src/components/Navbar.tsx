import { FaAngleDown }  from "react-icons/fa6";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const userName: string = (() => {
    try {
      if (!token) return "";
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.full_name as string;
    } catch (error) {
      console.error("Invalid token", error);
      return "";
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  }




  return (
    <div className="border border-white h-10 w-full flex justify-end items-center p-3">
      <div className="flex items-center gap-2">
        <h2 className="text-white text-sm font-semibold">{userName}</h2>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger className="cursor-pointer">
              <FaAngleDown className={`text-white ${open ? "rotate-180" : ""} transition-transform duration-300 cursor-pointer`} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-100" onClick={handleLogout} >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Navbar