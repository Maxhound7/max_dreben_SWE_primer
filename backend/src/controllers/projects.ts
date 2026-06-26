import { Request, Response } from "express";
import { supabase } from "../app";

// Check section 1-2 in the README for more details on how to create this controller.

// Helper function to check if a user exists
const checkUserExists = async (userId: number) => {
    const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("id", userId)
        .single();

    return !error && data !== null;
};

// Get project by ID
export const getProjectById = async (req: Request, res: Response) => {
    const projectId = req.params.id;

    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

    if (error) {
        console.error("Error fetching project by ID:", error);
        return res.status(500).json({ error: "Failed to fetch project" });
    }

    return res.json(data);
};

// Get all projects
export const getAllProjects = async (_req: Request, res: Response) => {
    const { data, error } = await supabase.from("projects").select("*");

    if (error) {
        console.error("Error fetching all projects:", error);
        return res.status(500).json({ error: "Failed to fetch projects" });
    }

    return res.json(data);
};

// Create a new project
export const createProject = async (req: Request, res: Response) => {
    const { name, managerId, description } = req.body;

    if (!name || !managerId || !description) {
        return res.status(400).json({
            error: "Missing required fields: name, managerId, and description",
        });
    }

    const managerExists = await checkUserExists(managerId);

    if (!managerExists) {
        return res.status(404).json({ error: "Project manager does not exist" });
    }

    const { data, error } = await supabase
        .from("projects")
        .insert({
            project_name: name,
            project_manager_id: managerId,
            project_description: description,
        })
        .select("*")
        .single();

    if (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({ error: "Failed to create project" });
    }

    return res.status(201).json(data);
};

// Update a project
export const updateProject = async (req: Request, res: Response) => {
    const projectId = req.params.id;
    const { name, managerId, description } = req.body;

    const updates: {
        project_name?: string;
        project_manager_id?: number;
        project_description?: string;
    } = {};

    if (name !== undefined) {
        updates.project_name = name;
    }

    if (managerId !== undefined) {
        const managerExists = await checkUserExists(managerId);

        if (!managerExists) {
            return res.status(404).json({ error: "Project manager does not exist" });
        }

        updates.project_manager_id = managerId;
    }

    if (description !== undefined) {
        updates.project_description = description;
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({
            error: "No valid fields provided to update",
        });
    }

    const { data, error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", projectId)
        .select("*")
        .single();

    if (error) {
        console.error("Error updating project:", error);
        return res.status(500).json({ error: "Failed to update project" });
    }

    return res.json(data);
};

// Delete a project
export const deleteProject = async (req: Request, res: Response) => {
    const projectId = req.params.id;

    const { data, error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId)
        .select("*")
        .single();

    if (error) {
        console.error("Error deleting project:", error);
        return res.status(500).json({ error: "Failed to delete project" });
    }

    return res.json(data);
};