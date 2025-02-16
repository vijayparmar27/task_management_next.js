import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { Dispatch, SetStateAction } from "react";
import { CreateProjectForm } from "./create-project-form";

const AddProject = ({
  isCreateProjectOpen,
  setIsCreateProjectOpen,
  project, // Accept optional project for editing
}: {
  isCreateProjectOpen: boolean;
  setIsCreateProjectOpen: Dispatch<SetStateAction<boolean>>;
  project?: any; // Optional for edit mode
}) => {
  return (
    <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {project ? "Edit Project" : "Create Project"}
          </DialogTitle>
          <DialogDescription>
            {project ? "Edit your project details" : "Add a new project"}
          </DialogDescription>
        </DialogHeader>
        <CreateProjectForm
          project={project} // Pass project for editing
          onSuccess={() => setIsCreateProjectOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddProject;
