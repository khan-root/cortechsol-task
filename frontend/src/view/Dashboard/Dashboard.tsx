import { useState } from "react";
import { Button } from "../../components/ui/button"
import Tasks from "./Tasks"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import AddTask from "./AddTask";

const Dashboard = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  }
  return (
    <div className="p-4">
      <div className="flex justify-end">
        <Button className="bg-white text-black cursor-pointer hover:bg-white/80 hover:text-black" onClick={handleOpenDialog}>Add Task</Button>
      </div>
      <Tasks />
      {openDialog && 
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>    
              <DialogTitle>Add Task</DialogTitle>
            </DialogHeader>
            <AddTask 
              handleOpenDialog ={handleOpenDialog}
            />
          </DialogContent>
        </Dialog>
      }
    </div>
  )
}

export default Dashboard