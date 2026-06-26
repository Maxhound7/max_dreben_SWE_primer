import { Request, Response } from "express";
import { supabase } from "../app";

const checkUserExists = async (userId: number) => {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();
    if (error) {
        console.error("Error checking if user exists:", error);
        return false;
    }
    return !!data;
};

const checkProjectExists = async (projectId: number) => {
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();
    if (error) {
        console.error("Error checking if project exists:", error);
        return false;
    }
    return !!data;
};

// GET /associates/associate/:project_id - Get associates by project ID
export const getAssociatesByProjectId = async (req: Request, res: Response) => {
    const projectId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    // check if project ID is in the projects table
    const projectExists = await checkProjectExists(parseInt(projectId));
    if (!projectExists) {
        return res.status(400).json({ error: "Invalid project ID" });
    }
    const { data, error } = await supabase
        .from("associates")
        .select("*")
        .eq("project_id", projectId);
    if (error) {
        console.error("Error fetching associates by project ID:", error);
        return res.status(500).json({ error: "Failed to fetch associates" });
    }
    return res.json(data);
};

// GET /associates/project/:associate_id - Get projects by associate ID
export const getProjectsByAssociateId = async (req: Request, res: Response) => {
    const associateId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    // check if associate ID is in the users table
    const userExists = await checkUserExists(parseInt(associateId));
    if (!userExists) {
        return res.status(400).json({ error: "Invalid associate ID" });
    }
    const { data, error } = await supabase
        .from("associates")
        .select("*")
        .eq("associate_id", associateId);
    if (error) {
        console.error("Error fetching projects by associate ID:", error);
        return res.status(500).json({ error: "Failed to fetch projects" });
    }
    return res.json(data);
};

// POST /associates - Create a new associate project relationship
export const createAssociate = async (req: Request, res: Response) => {
    const { project_id, associate_id } = req.body;

    // check if project ID is in the projects table
    const projectExists = await checkProjectExists(parseInt(project_id));
    if (!projectExists) {
        return res.status(400).json({ error: "Invalid project ID" });
    }

    // check if associate ID is in the users table
    const userExists = await checkUserExists(parseInt(associate_id));
    if (!userExists) {
        return res.status(400).json({ error: "Invalid associate ID" });
    }

    // check if associate relationship already exists
    const { data: existingAssociate, error: checkError } = await supabase
        .from("associates")
        .select("*")
        .eq("project_id", project_id)
        .eq("associate_id", associate_id)
        .single();

    if (!checkError && existingAssociate) {
        return res.status(400).json({ error: "Associate already exists for this project" });
    }

    const associateData = {
        ...(project_id !== undefined && { project_id }),
        ...(associate_id !== undefined && { associate_id }),
    };

    const { data, error } = await supabase
        .from("associates")
        .insert(associateData)
        .select("*")
        .single();

    if (error) {
        console.error("Error creating associate:", error);
        return res.status(500).json({ error: "Failed to create associate" });
    }

    return res.status(201).json(data);
};

// DELETE /associates/:id - Delete an associate project relationship by ID
export const deleteAssociateById = async (req: Request, res: Response) => {
    const associateId = req.params.id;
    const { data, error } = await supabase
        .from("associates")
        .delete()
        .eq("id", associateId)
        .select("*")
        .single();
    if (error) {
        console.error("Error deleting associate by ID:", error);
        return res.status(500).json({ error: "Failed to delete associate" });
    }
    return res.json(data);
};